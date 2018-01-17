/**
 * Created by Karol on 14.01.2018.
 */
var epost = localStorage.getItem("epost");
var brukerId = localStorage.getItem("brukerId");
var husholdningId = localStorage.getItem("husholdningId");
var husholdning;
var handlelisteNavn = $("#handlelisteNavn").val();
var alleHandlelister;


$(document).ready(function () {
    gethhData();
    getBrukerData();
    getHandlelisterData();
    setTimeout(setupPage,1000);

    $("#leggTilKnapp").on("click", function () {
        leggTilNyHandleliste();
    });
    $("#leggTilNyGjenstandKnapp").on("click", function () {
        leggTilNyGjenstand();
    });
    $("#slettHandleliste").on("click", function () {
        slettHandleliste();
    });
});

function leggTilNyHandleliste() {
    var varer = [];
    var offentlig = 0;
    var isChecked = $('#offentligKnapp').is(':checked');
    if (isChecked) {
        offentlig = 1;
    }


    var handlelisteObjekt = {
        tittel: handlelisteNavn,
        skaperId: brukerId,
        husholdningId: husholdningId,
        offentlig: offentlig,
        varer: varer
    };

    if (handlelisteNavn == "") {
        alert("Skriv navnet til handlelisten!");
        return;
    }

    $.ajax({
        url: "server/handleliste",
        type: 'POST',
        data: JSON.stringify(handlelisteObjekt),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            if (data) {
                window.location = "handlelister.html";
            } else {
                alert("feil!");
            }
        },
        error: function () {
            alert("serverfeil :/")
        }
    })
}

function leggTilNyGjenstand() {
    var nyGjenstandNavn = $("#leggTilNyGjenstand").val();
    var handlelisteId;
    
    function getHadlelisteId() {

    }

    var vare = {
        varenavn: nyGjenstandNavn,
        handlelisteId: handlelisteId
    };

    if (nyGjenstandNavn == "") {
        alert("Skriv navnet til gjenstanden!");
        return;
    }


    $.ajax({
        url: "server/handleliste/" + husholdningId + "/",
        type: 'POST',
        data: JSON.stringify(vare),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            if (data) {
                alert("Det gikk bra!");
                //window.location = "handlelister.html";
            } else {
                alert("feil!");
            }
        },
        error: function () {
            alert("serverfeil :/")
        }
    })
}

function slettHandleliste() {
    
}

function gethhData() {
    $.getJSON("server/hhservice/" + epost + "/husholdningData", function (data) {
        husholdning = data;
    });
}

function getBrukerData() {
    $.getJSON("server/BrukerService/" + epost + "/brukerData", function (data) {
        bruker = data;
    });
}

function getHandlelisterData() {
    $.getJSON("server/handleliste/" + husholdningId + "/" + brukerId, function (data) {
        alleHandlelister = data;
    });
}

function setupPage() {
    var tittel, handlelisteId, husholdningId, skaperId, varer, offentlig, frist, vareId, varenavn, kjøpt, kjøperId, datokjøpt;

    for(var i = 0; i < alleHandlelister.length; i++){
        tittel = alleHandlelister[i].tittel;
        handlelisteId = alleHandlelister[i].handlelisteId;
        husholdningId = alleHandlelister[i].husholdningId;
        skaperId = alleHandlelister[i].skaperId;
        varer = alleHandlelister[i].varer;
        offentlig = alleHandlelister[i].offentlig;
        frist = alleHandlelister[i].frist;
        for(var j = 0; j < varer.length; j++){
            vareId = varer[j].vareId;
            varenavn = varer[j].varenavn;
            kjøpt = varer[j].kjøpt;
            kjøperId = varer[j].kjøperId;
            //datokjøpt = new Date(varer[j].datokjøpt);
        }

        $("#handlelister").append('<div class="panel panel-default"><div class="container-fluid"><div class="panel-heading clearfix"><h4 class="panel-titel' +
            ' pull-left" style="padding-top: 7.5px"><a data-toggle="collapse" data-parent="accordion" href="#collapse1"' +
            ' aria-expanded="true"></a>' + tittel + '</h4><div><button id="slettHandleliste" class="btn btn-danger pull-right removeButton"' +
            ' type="button">Slett handleliste</button></div></div></div><div id="collapse1" class="panel-collapse collapse in" aria-expanded="true"><div' +
            ' class="panel-body"><div class="panel-body"><ul class="list-group">' + varenavn + '</ul><div id="list1"' +
            ' class="list-group"><form><div class="input-group"><input id="leggTilNyGjenstand" class="form-control"' +
            ' placeholder="Legg til ny gjenstand i listen" type="text"><div class="input-group-btn"><button id="leggTilNyGjenstandKnapp" class="btn btn-default" type="submit">' +
            ' <i class="glyphicon glyphicon-plus"></i></button></div></div></form><button id="utlegg" type="button" class="btn btn-primary pull-left" data-toggle="modal"' +
            ' data-target="#utleggmodal">Lag utlegg</button><!-- Rounded switch --><h5 id="offtekst" class="pull-right">Offentlig</h5><label class="switch pull-right"><input ' +
            ' type="checkbox"><span class="slider round"></span></label></div></div></div></div></div>');

        if(offentlig){
            $(".slider").click();
        }
    }
}