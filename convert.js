function containMoney(element) {
    return element.innerHTML.includes("€");
}

function convertPrice(){
    /*var p = document.getElementsByTagName("p");
    var span = document.getElementsByTagName("span");

    for(var i = 0; i < span.length; i++){
        if(span[i].innerHTML.includes("€")){
            console.log(span[i].innerHTML);
        }
    }*/


    browser.storage.local.get('rev', function(element){
        var moneyperday = element.rev/22;
        var moneyperhour = moneyperday/8;

        var amazon = document.getElementById("price");
        var ali = document.getElementsByClassName("product-price")[0];

        if(amazon == null){
            var itemsPrice = document.getElementsByClassName("product-price-value")[0].innerHTML;
            itemsPrice = itemsPrice.substr(2,itemsPrice.length);
        
            var parts = itemsPrice.replace(/\./g, "").split(" - ");
        }else{
            var itemPrice = document.getElementById("priceblock_ourprice").innerHTML;
            var parts = itemPrice.replace(/\./g, "").substring(0, itemPrice.length-2).split(" ");
        }
    
        var newNode = null;

        if(document.getElementById("PriceToDay") != null){
            var elem = document.getElementById("PriceToDay");
            elem.parentNode.removeChild(elem);
        }

        newNode = document.createElement('div');
        newNode.className = "product-price PriceToDay";
        newNode.id = "PriceToDay";

        var dayprice = "<div class=\"product-price-current\" style=\"display: inline-block; margin-bottom: 10px; font-size: 25px; background: rgba(255, 40,40, 0.1); border-radius: 10px; padding: 5px 10px;\"><span class=\"product-price-value a-size-medium\" style=\"color: #ff6666\">~ ";
        
        for(var i = 0; i < parts.length; i++){
            var perday = (parseFloat(parts[i]) / moneyperday);

            var intera = Math.floor(perday);
            var decimal = perday - intera;
            var minuti_totali = decimal*8*60;

            var ore = Math.floor(minuti_totali/60)
            var minuti = minuti_totali-ore*60

            if(perday < 1){
                price = (parseFloat(parts[i]) / moneyperhour).toFixed(2) + " <span class=\"selection\" style=\"font-size: 14px; color: black; padding: 0 5px;\"> ore di lavoro </span>";
            }else if(perday > 29){
                var giorni = intera % 30;
                var mesi = Math.floor(intera/30);

                price = mesi
                + "<span class=\"selection\" style=\"font-size: 14px; color: black; padding: 0 5px;\">mesi </span>"
                + giorni
                + "<span class=\"selection\" style=\"font-size: 14px; color: black; padding: 0 5px;\">gg </span>"
                + (ore).toFixed(0) +"."+ (minuti).toFixed(0)
                + "<span class=\"selection\" style=\"font-size: 14px; color: black; padding: 0 5px;\">h </span>";
            }else{
                price = intera
                + "<span class=\"selection\" style=\"font-size: 14px; color: black; padding: 0 5px;\">gg </span>"
                + (ore).toFixed(0) +"."+ (minuti).toFixed(0)
                + "<span class=\"selection\" style=\"font-size: 14px; color: black; padding: 0 5px;\">h </span>";
            }
    
            dayprice += price;
    
            if(i != parts.length-1){
                dayprice += "<span style=\"color: #555; padding: 0 10px;\"> / </span>";
            }
        }
    
        dayprice += "<span class=\"selection\" style=\"font-size: 13px; color: #333; padding-left: 10px;\"> di lavoro </span></div>";
    
        newNode.innerHTML = "";
        newNode.innerHTML = dayprice;

        // Get the reference node
        var referenceNode =  amazon || ali;
    
        // Insert the new node before the reference node
        referenceNode.after(newNode);
    });
}

document.addEventListener('click', function(evt) {
    convertPrice();
}, false);

convertPrice();

setInterval(function(){
    convertPrice();
}, 3000)



