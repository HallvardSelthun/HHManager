$(document).ready(function (){
    $(function(){
        $("#navbar").load("nav.html");
        $("#modaldiv").load("lagnyhusstand.html");
    });
    $('body').on('click', 'a#bildenav', function() {
        window.location="forside.html"
    });

    $('body').on('click', 'a#gjoremaalsknapp', function() {
        window.location="gjoremaal.html"
    });
    $('body').on('click', 'a#kalenderknapp', function() {
        window.location="kalender.html"
    });
    $('body').on('click', 'a#handlelisteknapp', function() {
        window.location="handlelister.html"
    });
    $('body').on('click', 'a#bildeknapp', function() {
        window.location = "forside.html"
    });
    $('body').on('click', 'a#brukernavn', function() {
        window.location = "profil.html"
    });
    $('body').on('click', 'a#oppgjorknapp', function() {
        window.location = "oppgjor.html"
    });
});
