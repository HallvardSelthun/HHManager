/**
 *
 * Created by BrageHalse on 12.01.2018.
 *
 */
/**
 *
 */
var husholdning;
var bruker = JSON.parse(localStorage.getItem("bruker"));
var epost = bruker.epost;
var brukerId = bruker.brukerId;
var husholdningId;
var medlemmer;
var handleliste;

/**
 * Metoden under lar deg skrive innlegg i den husholdningen du er medlem av og publiserer slik at
 * andre medlemmer av husholdningen ser det.
 */
$(document).ready(function () {
    husholdningId = bruker.favHusholdning;
    getHandleliste();
    gethhData();
    setTimeout(setupPage, 1000);
    $("#commentBtn").on("click", function () {
        postInnlegg();
    });
    /*$(".skrivNyttInnlegg").on("click", function () {
        skrivNyttInnlegg();
    });*/
    $("body").on("click", "#refreshGForside", function () {
        oppdaterGjoremal();
    });
});

/**
 * Funksjonen tar variablene husNavn og nyhetsinnlegg og setter de lik navnet på husstand
 * samt nyhetsinnlegget og henter medlemmet som skrev det.
 */
function setupPage() {
    console.log(husholdning);
    var husNavn = husholdning.navn;
    var nyhetsinnlegg = husholdning.nyhetsinnlegg;
    medlemmer = husholdning.medlemmer;
    var handlelister = husholdning.handlelister;
    localStorage.setItem("husholdningId", husholdningId);

    /**
     * Løkka kaller på funksjonen innleggToHtml og tar inn parameter nyhetsinnlegg
     */
    for (var i = 0, len = nyhetsinnlegg.length; i < len; i++) {
        innleggToHtml(nyhetsinnlegg[i])
    }
    /**
     * Setter variablene lik en bruker og henter id, navn og gjøremål fra database.
     */
    brukernavn = bruker.navn;
    gjoremal = bruker.gjoremal;
    console.log(bruker);

    /**
     * Setter nyheten i tekstfeltet
     */
    $("#nyhet").html(husNavn);

    /**
     * Løkka legger medlemmenes navn i en liste -medlemnavn- som deretter kan ses fra
     * medlemliste i programmet.
     */
    for (var j = 0, leng = medlemmer.length; j < leng; j++) {
        var medlemnavn = medlemmer[j].navn;
        $("#medlemsliste").append('<li class="list-group-item">' + medlemnavn + '</li>');
    }
    /**
     * Løkka legger beskrivelse av gjøremål i en variabel -beskrivelse- og viser dette
     * på skjerm i form av en liste.
     */

    for (var g = 0, length = gjoremal.length; g < length; g++) {
        var beskrivelse = gjoremal[g].beskrivelse;
        $("#gjøremålForside").append('<li class="list-group-item">' + beskrivelse + '<input id="gjoremal'+gjoremal[g].gjoremalId+'" title="toggle all" type="checkbox" class="all pull-right"></li>')
    }

    /**
     * Løkka går gjennom handleliste og går igjennom antall varer. Definerer variabler som legger
     * varer i en liste, som henter ut varenavnet og om varen er kjøpt eller ikke. Dette sjekkes
     * ved en checkbox.
     */
    for (var k = 0, lengt = handleliste.varer.length; k < lengt; k++) {
        var vare = handleliste.varer[k];
        var varenavn = he.encode(vare.varenavn);
        var checked = vare.kjøpt;
        var string = "";
        if (checked) {
            string = "checked";
        }
        $("#handlelisteForside").append('<label class="list-group-item "> ' + varenavn + '<input title="toggle all" type="checkbox" class="all pull-right" ' + string + '> </label>');
    }
    setTimeout(function () {
        $("#tekst3").append(he.encode(handleliste.tittel));
    }, 150);

}


function getHandleliste(){
    $.getJSON("server/handleliste/forsideListe/"+husholdningId+"/"+brukerId, function(data){
        handleliste=data;
    })
}

/**
 * Funksjonen henter data fra hhservice og metoden husholdningsData.
 */


function gethhData() {
    $.getJSON("server/hhservice/" + husholdningId + "/husholdningData", function (data) {
        husholdning = data;
    });
}


/**
 * Funksjonen brukes til å poste et innlegg og lar bruker skrive et innlegg til gruppa. Det skal
 * ikke være lov til å publisere et tomt innlegg. Et nyhetsinnlegg har en forfatterid, en tekst,
 * husholdningsid, og en dato. Dette hentes med et ajax-kall til hhservice under metoden nyhets-
 * post.
 */
function postInnlegg() {
    var tekst = $("#comment").val();
    if (tekst == "") {
        return;
    }
    var dato = new Date(Date.now());
    var nyhetsinnlegg = {forfatterId: brukerId, tekst: tekst, husholdningId: husholdningId, dato: dato};
    $.ajax({
        url: "server/hhservice/nyhetspost",
        type: 'POST',
        data: JSON.stringify(nyhetsinnlegg),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            var result = JSON.parse(data);
            console.log(result + " :D");
            if (!result) {
                alert("noe gikk galt :/");
            } else {
                innleggToHtml(nyhetsinnlegg);
                $("#comment").val("");
                document.getElementById("skrivNyttInnlegg").style.display = "none";
            }
        }
    })
}

/**
 * Funksjonen henter innlegget med forfatterId, tekst og diverse datoer/tidspunkter for så å
 * la bruker se det på nettsiden.
 * @param nyhetsinnlegg tar inn teksten skrevet i inputfeltet på forsiden.
 */
function innleggToHtml(nyhetsinnlegg) {
    var fofatterId = nyhetsinnlegg.forfatterId;
    var forfatter = "pls";
    var tekst = he.encode(nyhetsinnlegg.tekst); //XSS prevention

    var nyDate = new Date(nyhetsinnlegg.dato).toISOString().slice(0,10);

    for (var j = 0, length = medlemmer.length; j < length; j++) {
        if (medlemmer[j].brukerId == fofatterId) {
            forfatter = medlemmer[j].navn;
        }
    }
    $(".innleggsliste").prepend('<li class ="innlegg"><div class="media-left"><img src="web-res/avatar.png" class="media-object" style="width:45px"></div><div' +
        ' class="media-body"><h4 class="media-heading">' + forfatter + '<small><i> ' + nyDate + '</i></small></h4><p>' + tekst + '</p></div></li>');

    setTimeout(function () {


    var list = $(".innleggsliste li");
    var numToShow = 7;
    var button = $("#next");
    var numInList = list.length;
    list.hide();
    if (numInList > numToShow) {
        button.show();
    }
    list.slice(0, numToShow).show();

    button.click(function () {
        console.log("lll");
        var showing = list.filter(':visible').length;
        list.slice(showing - 1, showing + numToShow).fadeIn();
        var nowShowing = list.filter(':visible').length;
        if (nowShowing >= numInList) {
            button.hide();
        }
    });
    },0);
}

/**
 * Funksjonen kalles når bruker trykker på knappen om å publisere innlegg.
 */
/*function skrivNyttInnlegg() {
    var x = document.getElementById("skrivNyttInnlegg").style.display;
    if (x === "none") {
        document.getElementById("skrivNyttInnlegg").style.display = "";
    } else {
        document.getElementById("skrivNyttInnlegg").style.display = "none";
    }
}*/

function oppdaterGjoremal() {
    var ffListe = [];
    var minegjoremal = bruker.gjoremal;
    for (var i = 0, len = minegjoremal.length; i < len; i++) {
        var gjoremal = minegjoremal[i];
        var gjoremalId = minegjoremal[i].gjoremalId;
        var fullfort = document.getElementById("gjoremal" + gjoremalId).checked;
        console.log(fullfort);
        if (fullfort) {
            ffListe.push(i);
        }
        console.log(ffListe);
    }
    for (var j = ffListe.length - 1; j >= 0; j--) {
        console.log(j);
        gjoremal = minegjoremal[ffListe[j]];
        console.log(gjoremal);
        $.ajax({
            url: "server/gjoremalservice/fullfort",
            type: 'PUT',
            data: JSON.stringify(gjoremal),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result); // gjør string til json-objekt
                if (data) {
                    console.log("Gjøremål som slettes:");
                    console.log(gjoremal)
                    alert("Det gikk bra!");

                } else {
                    alert("feil!");
                }
                window.location = "forside.html";
            },
            error: function () {
                alert("serverfeil :/");
                console.log(gjoremal)
            }
        });
    }
    setTimeout(function () {
        for (var h = ffListe.length - 1; h >= 0; h--) {
            minegjoremal.splice(ffListe[h], 1);
        }
        bruker.gjoremal = minegjoremal;
        localStorage.setItem("bruker", JSON.stringify(bruker));
    }, 200)
}
