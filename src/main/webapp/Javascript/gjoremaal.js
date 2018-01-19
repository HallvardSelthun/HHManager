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
        postInnlegg();
    });
});