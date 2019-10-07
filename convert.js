let locale_string = {
    "en": {
      "month": "month",
      "hour": "hours",
      "work": "of work",
      "setted": "Revenue not setted!"
    },
    "it": {
      "month": "mesi",
      "hour": "ore",
      "work": "di lavoro",
      "setted": "Guadagno non settato!"
    }
}

let prevStore = null;
let stores = ["amazon", "aliexpress", "ebay"];

let isNumber = (n) => !isNaN(parseFloat(n))

let getSite = (url) => {
    let match = (/https?.*?(\w{4,})(?=(?:\.\w{2,3})+)/g).exec(url);
    if(match != null) return match[1];
}

// Domain check for chrome extension
let checkAndConvert = () => {
    let match = getSite(window.location);
    if(stores.includes(match))
        convertPrice(match);
}

let convertPrice = (match) => {
    let daily_hour = 8;

    // Popular sites DOM element to append our price
    var amazon = document.getElementById("price");
    var ali = document.getElementsByClassName("product-price")[0];
    var ebay = document.getElementById("vi-mskumap-none");

    var sites = [amazon, ali, ebay];

    let locale = (navigator.language || navigator.userLanguage).split("-")[0] || "en";
    if(locale != "it") locale = "en";

    let style = "";

    chrome.storage.local.get(['pricetoday_rev', 'pricetoday_parttime', 'pricetoday_month', 'pricetoday_noprice', 'pricetoday_dark'], (store) => {
        console.log(store);


        if(store.pricetoday_parttime) daily_hour = 4;

        sites.forEach((site) => {
            if(site != null) 
                site.style.display = (store.pricetoday_noprice) ? "none" : "block"
        });
        
        var moneyperday = store.pricetoday_rev/22; // Daily revenue
        var moneyperhour = moneyperday/daily_hour; // Hour revenue

        switch(match){
            case "amazon":
                var itemPrice = document.getElementById("priceblock_ourprice").textContent;
                var parts = itemPrice.replace(/\./g, "").split(" ").filter(isNumber);
                style = "border: 2px solid #88aaaa; color: #88aaaa;";
            break;

            case "ebay":
                var itemPrice = document.getElementById("prcIsum").textContent;
                var parts = itemPrice.replace(/\./g, "").split(" ").filter(isNumber);
                style = "border: 2px solid #2255dd; color: #2255dd;";
            break;

            case "aliexpress":
                var itemsPrice = document.getElementsByClassName("product-price-value")[0].textContent;            
                var parts = itemsPrice.replace(/\./g, "").substr(2,itemsPrice.length).split(" - ");
                style = "border: 2px solid #ff6666; color: #ff6666;";
            break;

            default: site_fallback();
        }

        // Create content
        var dayprice = "<div class=\"product-price-current\" style=\"box-shadow: 0 7px 20px -6px rgba(0,0,0,0.2); display: inline-block; margin: 10px 0; font-size: 25px; background: white; border-radius: 30px; padding: 5px 15px;" + style + "\">"
                        + "<span class=\"product-price-value\" style=\"display: flex; align-items: center; font-weight: 600;\">";
        
        if(store.pricetoday_rev){
            for(var i = 0; i < parts.length; i++){
                if(isNumber(parts[i])){
                    var dayofwork = (parseFloat(parts[i]) / moneyperday);

                    var intera = Math.floor(dayofwork);
                    var decimal = dayofwork - intera;
                    var minuti_totali = decimal*daily_hour*60;
                    var ore = Math.floor(minuti_totali/60);
                    var minuti = minuti_totali-ore*60; 
                    var giorni = intera % 22; // 22 day of work
                    var mesi = Math.floor(intera/22);
        
                    if(dayofwork < 1){
                        price = (parseFloat(parts[i]) / moneyperhour).toFixed(2) + " <span class=\"selection\" style=\"font-size: 14px; color: black; padding: 0 5px;\">" + locale_string[locale].hour + "</span>";
                    }else if(dayofwork > 29 && store.pricetoday_month){
                        price = mesi
                        + "<span class=\"selection\" style=\"font-size: 14px; color: black; padding: 0 5px;\"> " + locale_string[locale].month + "</span>"
                        + "<span style=\"font-size: 14px; padding-left: 5px;\">" + giorni + "</span>"
                        + "<span class=\"selection\" style=\" font-size: 12px; color: black; padding: 0 5px;\">gg </span>"
                        + "<span style=\"font-size: 14px;  padding-left: 5px;\">" + (ore).toFixed(0) +"."+ (minuti).toFixed(0) + "</span>"
                        + "<span class=\"selection\" style=\" font-size: 12px; color: black; padding: 0 5px;\">" + locale_string[locale].hour + " </span>";
                    }else{
                        price = intera
                        + "<span class=\"selection\" style=\"font-size: 14px; color: black; padding: 0 5px;\">gg </span>"
                        + "<span style=\"font-size: 14px;  padding-left: 5px;\">" + (ore).toFixed(0) +"."+ (minuti).toFixed(0) + "</span>"
                        + "<span class=\"selection\" style=\" font-size: 12px; color: black; padding: 0 5px;\">" + locale_string[locale].hour + " </span>";
                    }
            
                    dayprice += price;
            
                    if(i != parts.length-1){
                        dayprice += "<span style=\"color: #555; padding: 0 10px;\"> / </span>";
                    }
                }
            }

            dayprice += "<span class=\"selection\" style=\"font-size: 13px; color: #333; padding-left: 10px; \"> " + locale_string[locale].work + " </span></div>";
        }else{
            dayprice += locale_string[locale].setted;
        }

        // Reference node
        var referenceNode =  amazon || ali || ebay;

        // InneHTML alternative
        if(document.getElementById("pricetoday")){
            let todelete = document.getElementById("pricetoday");
            todelete.parentNode.removeChild(todelete);
        }

        const parser = new DOMParser();
        const parsed = parser.parseFromString(dayprice, `text/html`);
        const tags = parsed.getElementsByTagName(`body`);
        tags[0].id = "pricetoday";
        tags[0].style.background = "white";
        
        // Insert the new node before the reference node
        for (const tag of tags) {
            referenceNode.appendChild(tag)
        }
    });
}

// Check diff in the storage settings trigger
let checkDiff = () => {
    chrome.storage.local.get(['pricetoday_rev', 'pricetoday_parttime', 'pricetoday_month', 'pricetoday_noprice', 'pricetoday_dark'], (store) => {
        let acc = 0;

        for(var key in store)
            if(prevStore != null && store[key] !== prevStore[key]) acc++

        if(acc > 0) convertPrice();

        prevStore = store;
    });
}

let site_fallback = () => console.log("Not yet implemented!");

// Event to get all the version product change on the page
document.addEventListener('click', (evt) => {
    checkAndConvert();

    // Timeout trick for Amazon website
    if(getSite(window.location) == "amazon") setTimeout(() => checkAndConvert(), 2000)
}, false);

// Settings change listener
setInterval(() => checkDiff() , 1000)

checkAndConvert();