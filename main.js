let translation = {
    "en": {
        "revenue": "Monthly revenue: ",
        "notsetted": "Not setted",
        "month": "Enable months",
        "hideprice": "Hide Price",
        "input-rev.placeholder": "Monthly revenue..."
    },
    "it": {
        "revenue": "Guadagno mensile: ",
        "notsetted": "Non settato",
        "month": "Abilitare mesi",
        "hideprice": "Nascondi prezzo",
        "input-rev.placeholder": "Guadagno mensile..."
    }
}

let part = document.getElementById("parttime");
let month = document.getElementById("month");
let noprice = document.getElementById("noprice");
let dark = document.getElementById("dark");
let form = document.getElementById("revenue");

let checks = document.getElementsByClassName("checks");

let updateSettings = () => {
    let locale = (navigator.language || navigator.userLanguage).split("-")[0] || "en";
    let matches = document.querySelectorAll("[data-l10n-id]");
    for(var i = 0; i < matches.length; i++){
        matches[i].textContent = translation[locale][matches[i].getAttribute("data-l10n-id")];
    }

    chrome.storage.local.get(['pricetoday_rev', 'pricetoday_parttime', 'pricetoday_month', 'pricetoday_noprice', 'pricetoday_dark']).then((elemt) => {
        if(elemt.pricetoday_rev != null)
            document.getElementById("saved-rev").textContent = elemt.pricetoday_rev;

        month.checked = elemt.pricetoday_month;
        part.checked = elemt.pricetoday_parttime;
        noprice.checked = elemt.pricetoday_noprice;
        dark.checked = elemt.pricetoday_dark;
    });
}

let saveRevenue = (rev) => { 
    chrome.storage.local.set({'pricetoday_rev': rev})
    location.reload(); 
}

form.addEventListener('submit', (e) => {   
    e.preventDefault();
    let value = parseInt(document.getElementById("rev-input").value);
    saveRevenue(value);
});

// Checkbox events listener
Array.from(checks).forEach((element) => {
    element.addEventListener('change', (event) => onCheckChange(event));
});

onCheckChange = (event) => {
    chrome.storage.local.set({[`pricetoday_${event.target.id}`]: event.target.checked})
    convertPrice();
}

updateSettings();