/**
 * Klassen omhandler navbaren øverst i programmet.
 * Definerer variabler
 * @type {Array} lager en liste av navn i huset
 */
var navnIHuset = [];
var bruker = JSON.parse(localStorage.getItem("bruker"));
var husholdningId = localStorage.getItem("husholdningId");
var navn;
var epost;
var husholdninger;
var varseler;

/**
 * Laster inn nav-bar og modalene, der modalen sender deg til lagnyhusstand.
 */
$(document).ready(function () {

    navn = he.encode(bruker.navn);
    epost = he.encode(bruker.epost);

    $(function () {
        if(!husholdningId || husholdningId ==0){
            console.log("ALT NAV");
            $("#navbar").load("altnav.html");
        } else{
            $("#navbar").load("nav.html");
        }
        $("#modaldiv").load("lagnyhusstand.html");
    });

    if (!bruker) {
        window.location = "index.html";
        console.log("Redirecting")
    }
    getHusholdningerNav();

    /**
     * Når de ulike delene av navbar blir klikket på skal bruker sendes til de ulike html-sidene
     *
     */
    $(document).on('click', '.hhknapp', function () {
        var nyhhId = ($(this).attr('id'));
        localStorage.setItem("husholdningId", nyhhId);
        //bruker.favHusholdning = nyhhId; Dette er ikke logisk behaviour
        localStorage.setItem("bruker", JSON.stringify(bruker));
        window.location = "forside.html";
    });

    $(document).on("click", "#toggleBtn", function () {
        if(this === false) {
            $("body").css("padding-top", "300px");
        }
    });

    $(document).on('click', '.varslerknapp', function () {
        window.location = "gjoremaal.html";
    });

    $('body').on('click', 'a#bildenav', function () {
        if(!husholdningId || husholdningId ==0){
            window.location ="profil.html";
        }else{
            window.location = "forside.html"
        }
    });
    $('body').on('click', 'a#gjoremaalsknapp', function () {
        window.location = "gjoremaal.html"
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
    $('body').on('click', '#statistikkknapp', function () {
        window.location = "statistikk.html"
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
        var epostmedlem = $("#navnMedlem").val();
        if(epostmedlem.length !== 0){
            navnIHuset.push(medlem);
            $("#fadenav").show();
            $("#fadenav3").hide();
        } else {
            $("#fadenav3").show();
            $("#fadenav").hide();
        }
    });

  /*  $('body').on('click', "#alertbox", function () {
        $("#fadenav").hide();
        console.log("hide");
    });

    $('body').on('click', "#alertbox", function () {
        $("#fadenav3").hide();
        console.log("hide");
    });*/

    //brukes for å opprette en ny husstand samt registrere den med navn på medlem og navn på husstand i databasen.
    $("body").on("click", "#lagreHusKnapp", function () {
        var navnHus = he.encode($("#navnHusstand").val());
        var medlemHus = he.encode($("#navnMedlem").val());

        navnIHuset.push(
            {
                epost: bruker.epost
            });

        var husObj = {
            navn: navnHus,
            medlemmer: navnIHuset,
            adminId: bruker.brukerId
        };

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
                    if (bruker.favHusholdning == 0) {
                        bruker.favHusholdning = 0;
                        localStorage.setItem("bruker", JSON.stringify(bruker));
                    }
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
        $("a#profilNavn").html('<span class="glyphicon glyphicon-user"></span>' + navn);
    }, 150);
});


function utgaatteGjoremaal(liste) {
    for (var f = 0, le = liste.length; f < le; f++) {
        $("#listeVarsel").append('<li> <div class="col-md-2 col-sm-2 col-xs-2"></div>' +
            '<div class="col-md-10 col-sm-10 col-xs-10 pd-l0 varslerknapp" role="button">Fristen har gått ut for: <br><p class="beskrivelse" style="font-size: 15px;">' + he.encode(liste[f].beskrivelse) + '</div>' +
            '</li>')
    }
}

/**
 * henter husholsninger fra hhservice, gitt brukerid.
 */
function getHusholdningerNav() {
    $.getJSON("server/hhservice/husholdning/" + bruker.brukerId, function (data) {
        henteVarsel();
        $("#fadenav").hide();
        husholdninger = data;
        localStorage.setItem("husholdninger", JSON.stringify(husholdninger));

        setTimeout(function () {
            for (i = 0, l = husholdninger.length; i < l; i++) {
                var navn = he.encode(husholdninger[i].navn);
                var id = husholdninger[i].husholdningId;
                $("#husholdninger3").prepend('<li id="' + id + '" class ="hhknapp"><a href="#">' + navn + '</a></li>');
            }
        }, 300);
    });
}

/**
 * Style navbar
 * @type {jQuery|HTMLElement}
 */
var selectBody = $('body');
var selectNavbarCollapse = $('.navbar-collapse');

var heightNavbarCollapsed = $('.navbar').outerHeight(true);
var heightNavbarExpanded = 0;

paddingSmall();

selectNavbarCollapse.on('show.bs.collapse', function () {
    if (heightNavbarExpanded == 0) heightNavbarExpanded = heightNavbarCollapsed + $(this).outerHeight(true);
    paddingGreat();
});
selectNavbarCollapse.on('hide.bs.collapse', function () {
    paddingSmall();
});

$(window).resize(function () {
    if (( document.documentElement.clientWidth > 767 ) && selectNavbarCollapse.hasClass('in')) {
        selectNavbarCollapse.removeClass('in').attr('aria-expanded', 'false');
        paddingSmall();
    }
});

function paddingSmall() {
    selectBody.css('padding-top', heightNavbarCollapsed + 'px');
}

function paddingGreat() {
    selectBody.css('padding-top', heightNavbarExpanded + 'px');
}

//varsellampe i navbar henter alle gjøremål som ikke er gjort og som har gått ut på dato
function henteVarsel() {
    $.getJSON("server/gjoremalservice/" + bruker.brukerId + "/varsler", function (data) {
        var brukervarsler = data;
        varseler = brukervarsler.gjoremal;
        varselListe = brukervarsler.gjoremal.length;
        $("#antallVarsler").text(varselListe);
        $("#ant").text(varselListe);
        $("#antVarsler").text(varselListe);
        setTimeout(function () {
            utgaatteGjoremaal(varseler);
        }, 300);

    });

}