var navnIHuset = [];
var bruker = JSON.parse(localStorage.getItem("bruker"));
var navn = bruker.navn;

$(document).ready(function (){
    $(function(){
        $("#navbar").load("nav.html");

        $("#modaldiv").load("lagnyhusstand.html");
    });
    $('body').on('click', 'a#bildenav', function() {
        window.location = "forside.html"
    });
    $('body').on('click', 'a#gjoremaalsknapp', function() {
        window.location = "gjoremaal.html"
    });
    $('body').on('click', 'a#kalenderknapp', function() {
        window.location = "kalender.html"
    });
    $('body').on('click', 'a#handlelisteknapp', function() {
        window.location = "handlelister.html"
    });
    $('body').on('click', 'a#bildeknapp', function() {
        window.location = "forside.html"
    });
    $('body').on('click', 'a#profilNavn', function() {
        window.location = "profil.html"
    });
    $('body').on('click', 'a#oppgjorknapp', function() {
        window.location = "oppgjor.html"
    });

    // til lagNyHusstandModalen
    $('body').on('click', 'a#leggTilMedlemKnapp', function () {
        navnIHuset.push(document.getElementById("navnMeldlemHusstand"));
        console.log("navn i huset");
        console.log(navnIHuset);
    });

    $("#leggTilHusstandKnapp").click(function () {
        var navnHus = $("#navnHusstand").valueOf();

    });

    setTimeout(function () {
        $("a#profilNavn").text(navn);
    }, 300);

});
