var navnIHuset = [];
var bruker = JSON.parse(localStorage.getItem("bruker"));
var navn = bruker.navn;
var husholdninger;

$(document).ready(function () {
    $(function () {
        $("#navbar").load("nav.html");

        $("#modaldiv").load("lagnyhusstand.html");
    });
    getHusholdninger();
    setTimeout(function(){
        henteVarsel();
    },200);

    setTimeout(function () {
        $("#fade").hide()
    }, 150);

    $(document).on('click', '.hhknapp', function(){
         var nyhhId = ($(this).attr('id'));
         localStorage.setItem("husholdningId", nyhhId);
         bruker.favHusholdning = nyhhId;
         localStorage.setItem("bruker", JSON.stringify(bruker));
         window.location = "forside.html";
    });

    $('body').on('click', 'a#bildenav', function () {
        window.location = "forside.html"
    });
    $('body').on('click', 'a#gjoremaalsknapp', function () {
        window.location = "gjoremaal.html"
    });
    $('body').on('click', 'a#kalenderknapp', function () {
        window.location = "kalender.html"
    });
    $('body').on('click', 'a#handlelisteknapp', function () {
        window.location = "handlelister.html"
    });
    $('body').on('click', 'a#bildeknapp', function () {
        window.location = "forside.html"
    });

    $('body').on('click', 'a#profilNavn', function () {
        window.location = "profil.html"
    });

    $('body').on('click', '#oppgjorknapp', function () {
        window.location = "oppgjor.html"
    });

    $('body').on('click', 'a#loggut', function () {
        localStorage.clear();
        window.location = "index.html"
    });

    // til lagNyHusstandModalen
    $('body').on('click', '#leggTilMedlemKnapp', function () {
        var medlem = {
            epost: $("#navnMedlem").val()
        };
        $("#navnMedlem").val('');
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

        navnIHuset.push(
            {
                epost: bruker.epost
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
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result); // gjør string til json-objekt
                console.log("Data: " + data);
                if (data) {
                    alert("Det gikk bra!");
                } else {
                    alert("feil!");
                }
            },
            error: function () {
                alert("serverfeil :/");
                console.log(husObj)
            }
        });
    });
    setTimeout(function () {
        $("a#profilNavn").text(navn);
    }, 150);
});


function getHusholdninger() {
    $.getJSON("server/hhservice/husholdning/" + bruker.brukerId, function (data) {
        husholdninger = data;
    });
    setTimeout(function () {
        for (i = 0, l = husholdninger.length; i < l; i++) {
            var navn = husholdninger[i].navn;
            var id = husholdninger[i].husholdningId;
            console.log(husholdninger[i]);
            $("#husholdninger3").prepend('<li id="' + id + '" class = "hhknapp"><a href="#">' + navn + '</a></li>');
        }
    }, 250);
}


var selectBody = $('body');
var selectNavbarCollapse = $('.navbar-collapse');

var heightNavbarCollapsed = $('.navbar').outerHeight(true);
var heightNavbarExpanded = 0;

paddingSmall();

selectNavbarCollapse.on('show.bs.collapse', function () {
    if (heightNavbarExpanded == 0 ) heightNavbarExpanded = heightNavbarCollapsed + $(this).outerHeight(true);
    paddingGreat();
})
selectNavbarCollapse.on('hide.bs.collapse', function () {
    paddingSmall();
})

$(window).resize( function () {
    if (( document.documentElement.clientWidth > 767 ) && selectNavbarCollapse.hasClass('in') ) {
        selectNavbarCollapse.removeClass('in').attr('aria-expanded','false');
        paddingSmall();
    }
});

function paddingSmall() {
    selectBody.css('padding-top', heightNavbarCollapsed + 'px');
}
function paddingGreat() {
    selectBody.css('padding-top', heightNavbarExpanded + 'px');
}

function henteVarsel() {

    $.getJSON("server/gjoremalservice/" + bruker.brukerId +"/varsler", function (data) {
        varselListe=data;
        console.log(varselListe);
        $("#antallVarsler").text(varselListe);
    });
}