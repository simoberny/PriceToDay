function showRev(){
    browser.storage.local.get('rev').then(function(elemt){
        if(elemt.rev != null){
            document.getElementById("saved").style.display = "show";
            document.getElementById("saved-rev").innerHTML = elemt.rev;
        }
    });
}

function saveRevenue(rev) { 
    console.log(rev);
    browser.storage.local.set({'rev': rev})

    location.reload(); 
}

document.getElementById("revenue").addEventListener('submit', function(e) {   
    e.preventDefault()   

    var value = parseInt(document.getElementById("rev-input").value);

    saveRevenue(value);
});

showRev();