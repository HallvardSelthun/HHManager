/**
 * Created by BrageHalse on 12.01.2018.
 */
var husholdning;
var bruker = JSON.parse(localStorage.getItem("bruker"));
var epost = bruker.epost;
var brukerId;
var husholdningId;
var medlemmer;

$(document).ready(function () {
    husholdningId = bruker.favHusholdning;

    gethhData();
    setTimeout(setupPage,1000);
    $("#commentBtn").on("click", function () {
        postInnlegg();
    });
});

function setupPage() {
    console.log(husholdning);
    var husNavn = husholdning.navn;
    var nyhetsinnlegg = husholdning.nyhetsinnlegg;
    medlemmer = husholdning.medlemmer;
    var handlelister = husholdning.handlelister;
    localStorage.setItem("husholdningId", husholdningId);

    for (var i = 0, len = nyhetsinnlegg.length; i < len; i++) {
        innleggToHtml(nyhetsinnlegg[i])
    }

    brukerId = bruker.brukerId;
    brukernavn = bruker.navn;
    gjoremal = bruker.gjøremål;
    console.log(bruker);

    $("#nyhet").html(husNavn);

    for(var j = 0, leng = medlemmer.length; j< leng; j++){
        var medlemnavn = medlemmer[j].navn;
        $("#medlemsliste").append('<li class="list-group-item">'+medlemnavn+'</li>');
    }

    for(var g = 0, length = gjoremal.length; g<length; g++){
        var beskrivelse = gjoremal[g].beskrivelse;
        $("#gjøremålForside").append('<li class="list-group-item">'+beskrivelse+'<input title="toggle all" type="checkbox" class="all pull-right"></li>')
    }

    for(var k = 0, lengt = handlelister[0].varer.length; k<lengt; k++){
        var vare = handlelister[0].varer[k];
        var varenavn = vare.varenavn;
        var checked = vare.kjøpt;
        var string = "";
        if (checked){
            string = "checked";
        }
        $("#handlelisteForside").append('<li class="list-group-item "> '+varenavn+'<input title="toggle all" type="checkbox" class="all pull-right" '+string+'> </li>');
    }
}

function gethhData() {
    $.getJSON("server/hhservice/" + husholdningId + "/husholdningData", function (data) {
        husholdning = data;
    });
}
function getBrukerData() {
    $.getJSON("server/BrukerService/" + epost + "/brukerData", function (data) {
        //bruker = data;
    });
}
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
            }
        }
    })
}
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
    $("#innleggsliste").prepend('<li class ="innlegg"><div class="media-left"> <img src="web-res/avatar.png" class="media-object" style="width:45px"> </div><div class="media-body"><h4 class="media-heading">'+forfatter+'<small><i>'+date+'</i></small></h4><p>'+tekst+'</p></div></li>');
};
