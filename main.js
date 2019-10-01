var part = document.getElementById("parttime");
var month = document.getElementById("month");
var noprice = document.getElementById("noprice");
var dark = document.getElementById("dark");
var form = document.getElementById("revenue");

var checks = document.getElementsByClassName("checks");

let updateSettings = () => {
    browser.storage.local.get(['pricetoday_rev', 'pricetoday_parttime', 'pricetoday_month', 'pricetoday_noprice', 'pricetoday_dark']).then((elemt) => {
        if(elemt.pricetoday_rev != null)
            document.getElementById("saved-rev").innerHTML = elemt.pricetoday_rev;

        month.checked = elemt.pricetoday_month;
        part.checked = elemt.pricetoday_parttime;
        noprice.checked = elemt.pricetoday_noprice;
        dark.checked = elemt.pricetoday_dark;
    });
}

let saveRevenue = (rev) => { 
    browser.storage.local.set({'pricetoday_rev': rev})
    location.reload(); 
}

form.addEventListener('submit', (e) => {   
    e.preventDefault();
    var value = parseInt(document.getElementById("rev-input").value);
    saveRevenue(value);
});

// Checkbox events listener
Array.from(checks).forEach((element) => {
    element.addEventListener('change', (event) => onCheckChange(event));
});

onCheckChange = (event) => {
    browser.storage.local.set({[`pricetoday_${event.target.id}`]: event.target.checked})
}

updateSettings();