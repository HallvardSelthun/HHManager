var husholdning;
var bruker = JSON.parse(localStorage.getItem("bruker"));
var epost = bruker.epost;
var brukerId;
var husholdningId
var medlemmer;

$(document).ready(function () {
    husholdningId = bruker.favHusholdning;

    gethhData();
    setTimeout(setupPage,1000);
    $("#leggtil").on("click", function () {


    });
});

    navnIHuset.push(
        {
            epost: bruker
        });

    var husObj = {
        navn: navnHus,
        medlemmer: navnIHuset,
        adminId: 1 // denne verdien er ikke konstant. Bare for testing til ting er på plass
    };
    console.log(husObj);
    console.log("Prøver å sende husstand");

    if (navnHus == "") {
        alert("Skriv inn noe");
        return;
    }
    $.ajax({
        url: "server/hhservice/husholdning",
        type: 'POST',
        data: JSON.stringify(husObj),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'