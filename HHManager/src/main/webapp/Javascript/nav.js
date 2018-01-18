var navnIHuset = [];
var bruker = JSON.parse(localStorage.getItem("bruker"));
var navn = bruker.navn;

$(document).ready(function (){
    $(function(){
        $("#navbar").load("nav.html");

        $("#modaldiv").load("lagnyhusstand.html");
    });

    setTimeout(function () {
        $("#fade").hide()
    }, 150);

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
            epost: $("#navnMedlem").val()
        };
        $("#navnMedlem").val("");
        navnIHuset.push(medlem);
        console.log(navnIHuset);
        $("#fade").show();
        console.log("funker");
    });

    $('body').on('click', "a#alertbox", function () {
        $("#fade").hide();
        console.log("hide");
    });

    $("body").on("click", "#lagreHusKnapp", function () {
        var navnHus = $("#navnHusstand").val();
        var medlemHus = $("#navnMedlem").val();

        var husObj = {
            navn: navnHus,
            medlemmer: navnIHuset,
            adminId: 1 // denne verdien er ikke konstant. Bare for testing til ting er på plass
        };
        console.log(husObj);

        console.log("Prøver å sende husstand");
        $.ajax({
            url: "server/hhservice/husholdning",
            type: 'POST',
            data: JSON.stringify(husObj),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result); // gjør string til json-objekt
                console.log("Data: "+data);
                if (data){
                    alert("Det gikk bra!");
                }else{
                    alert("feil!");
                }
            },
            error: function () {
                alert("serverfeil :/");
                console.log(husObj)
            }
        })
    });
    setTimeout(function () {
        $("a#profilNavn").text(navn);
    }, 150);
});
