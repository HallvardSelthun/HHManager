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
var brukerId;
var husholdningId;
var medlemmer;

/**
 * Metoden under lar deg skrive innlegg i den husholdningen du er medlem av og publiserer slik at
 * andre medlemmer av husholdningen ser det.
 */
$(document).ready(function () {
    husholdningId = bruker.favHusholdning;

    gethhData();
    setTimeout(setupPage,1000);
    $("#commentBtn").on("click", function () {
        postInnlegg();
    });
    $(".skrivNyttInnlegg").on("click", function () {
        skrivNyttInnlegg();
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
    brukerId = bruker.brukerId;
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
    for(var j = 0, leng = medlemmer.length; j< leng; j++){
        var medlemnavn = medlemmer[j].navn;
        $("#medlemsliste").append('<li class="list-group-item">'+medlemnavn+'</li>');
    }
    /**
     * Løkka legger beskrivelse av gjøremål i en variabel -beskrivelse- og viser dette
     * på skjerm i form av en liste.
     */

    for(var g = 0, length = gjoremal.length; g<length; g++){
        var beskrivelse = gjoremal[g].beskrivelse;
        $("#gjøremålForside").append('<li class="list-group-item">'+beskrivelse+'<input title="toggle all" type="checkbox" class="all pull-right"></li>')
    }

    /**
     * Løkka går gjennom handleliste og går igjennom antall varer. Definerer variabler som legger
     * varer i en liste, som henter ut varenavnet og om varen er kjøpt eller ikke. Dette sjekkes
     * ved en checkbox.
     */
    for(var k = 0, lengt = handlelister[0].varer.length; k<lengt; k++){
        var vare = handlelister[0].varer[k];
        var varenavn = vare.varenavn;
        var checked = vare.kjøpt;
        var string = "";
        if (checked){
            string = "checked";
        }
        $("#handlelisteForside").append('<label class="list-group-item "> '+varenavn+'<input title="toggle all" type="checkbox" class="all pull-right" '+string+'> </label>');
    }
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
 * Funksjonen henter brukerdata fra serviceklassen Brukerservice
 */
function getBrukerData() {
    $.getJSON("server/BrukerService/" + epost + "/brukerData", function (data) {
        //bruker = data;
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
    if(tekst==""){
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
            if (!result){
                alert("noe gikk galt :/");
            }else{
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
    var tekst = nyhetsinnlegg.tekst;
    var options = {weekday: 'long', year: '2-digit', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'};
    var date = new Date(nyhetsinnlegg.dato).toLocaleDateString("en-US", options);
    for (var j = 0, length = medlemmer.length; j<length; j++){
        if (medlemmer[j].brukerId==fofatterId){
            forfatter = medlemmer[j].navn;
        }
    }
    $("#innleggsliste").prepend('<li class ="innlegg"><div class="media-left"><img src="web-res/avatar.png" class="media-object" style="width:45px"></div><div' +
        ' class="media-body"><h4 class="media-heading">'+forfatter+'<small><i>'+date+'</i></small></h4><p>'+tekst+'</p></div></li>');
}

/**
 * Funksjonen kalles når bruker trykker på knappen om å publisere innlegg.
 */
function skrivNyttInnlegg() {
    var x = document.getElementById("skrivNyttInnlegg").style.display;
    if(x === "none") {
        document.getElementById("skrivNyttInnlegg").style.display = "";
    }else {
        document.getElementById("skrivNyttInnlegg").style.display = "none";
    }
}