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

    $('body').on('click', '#oppgjorknapp', function() {
        window.location = "oppgjor.html"
    });

    $('body').on('click', 'a#loggut', function() {
        localStorage.clear();
        window.location = "index.html"
    });
    // til lagNyHusstandModalen
    $('body').on('click', '#leggTilMedlemKnapp', function () {
        var medlem = {
            navn:$("#navnMeldlemHusstand").val()
        };
        $("#navnMeldlemHusstand").val("");
        navnIHuset.push(medlem);
        console.log(navnIHuset);
    });

    $("body").on("click", "#lagreHusKnapp", function () {
        var navnHus = $("#navnHusstand").val();

        var husObj = {
            navn: navnHus,
            medlemmer: navnIHuset,
            adminId: 1 // denne verdien er ikke konstant. Bare for testing til ting er på plass
        };

        console.log("Prøver å sende husstand");
        $.ajax({
            url: "server/hhservice",
            type: 'POST',
            data: JSON.stringify(husObj),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                console.log("Sender ny lagret ny husstand");
                var data = JSON.parse(result); // gjør string til json-objekt
                console.log(data);
                if (data){
                    alert("Det gikk bra!");
                }else{
                    alert("feil!");
                }

            },
            error: function () {
                alert("serverfeil :/")
            }
        })
    });
    setTimeout(function () {
        $("a#profilNavn").text(navn);
    }, 150);

});
