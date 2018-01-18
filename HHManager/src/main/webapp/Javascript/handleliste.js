/**
 * Created by Karol on 14.01.2018.
 */
var bruker = JSON.parse(localStorage.getItem("bruker"));
var epost = bruker.epost;
var brukerId = bruker.brukerId;
var husholdningId = localStorage.getItem("husholdningId");
var husholdning;
var alleHandlelister;


$(document).ready(function () {
    getHandlelisterData();
    setTimeout(setupPage,1000);

    $("#leggTilNyHandlelisteKnapp").on("click", function () {
        leggTilNyHandleliste();
    });
    /*$("#leggTilNyGjenstandKnapp").on("click", function () {
        leggTilNyGjenstand();
    });
    $("#slettHandlelisteKnapp").on("click", function () {
        slettHandleliste();
    });
    /*$("#offentligKnapp").on("click", function () {
        offentligKnapp();
    });*/
});

function leggTilNyHandleliste() {
    var handlelisteNavn = $("#handlelisteNavn").val();

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
    var nyGjenstandNavn = $(".leggTilNyGjenstand").val();
    var handlelisteId = document.getElementsByClassName("leggTilNyGjenstand")[0].getAttribute("id").slice(1);
    console.log(nyGjenstandNavn + "\n" + handlelisteId);

    var vare = {
        varenavn: nyGjenstandNavn,
        handlelisteId: handlelisteId
    };

    if (nyGjenstandNavn == "") {
        alert("Skriv navnet til gjenstanden!");
        return;
    }


    $.ajax({
        url: "server/handleliste/" + handlelisteId + "/" + brukerId,
        type: 'POST',
        data: JSON.stringify(vare),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            alert("Det gikk bra!");

            if (data) {
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
    var handlelisteId = document.getElementsByClassName("leggTilNyGjenstand")[0].getAttribute("id").slice(1)
    console.log(handlelisteId);

    $.ajax({
        url: "server/handleliste/" + handlelisteId,
        type: 'DELETE',
        data: JSON.stringify(handlelisteId),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            console.log(data);
            alert("Det gikk bra!");

            if (data) {
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



// IKKE FERDIG ENNÅ
/*function offentligKnapp() {
    var offentligKnapp = $("#offentligKnapp").val();
    var handlelisteId = $(this).closest('id').prop("id");
    //console.log(handlelisteId);

    $.ajax({
        url: "server/handleliste/" + handlelisteId + "/private",
        type: 'PUT',
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
}*/


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
        //frist = alleHandlelister[i].frist;

        $("#handlelister").append('<div class="panel panel-default"><div class="panel-heading clearfix" data-toggle="collapse" data-parent="#handlelister"' +
            ' data-target="#' + handlelisteId + '" onclick="displayDiv()"><h4 class="panel-titel col-md-9"><a></a>' + tittel + '</h4><div onclick="slettHandleliste()">' +
            '<button class="btn btn-danger pull-right col-md-3" type="button">Slett handleliste</button></div></div>' +
            '<div id="' + handlelisteId + '" class="panel-collapse collapse invisibleDiv"><div class="panel-body"><ul class="list-group"></ul>' +
            '<div id="list1" class="list-group"><form><div class="input-group"><input id="#' + handlelisteId + '" class="form-control leggTilNyGjenstand"' +
            ' placeholder="Legg til ny gjenstand i listen" type="text"><div class="input-group-btn" onclick="leggTilNyGjenstand()">' +
            '<button id="' + handlelisteId + '" class="btn btn-default" type="submit"><i class="glyphicon glyphicon-plus"></i></button></div></div></form>' +
            '<button id="utlegg" type="button" class="btn btn-primary pull-left" data-toggle="modal" data-target="#utleggmodal">Lag utlegg</button>' +
            '<!-- Rounded switch --><h5 id="offtekst" class="pull-right">Offentlig</h5><label class="switch pull-right"><input type="checkbox"><span class="slider round">' +
            '</span></label></div></div></div></div>');



        /*$("#handlelister").append('<div class="panel panel-default"><div class="container-fluid"><div class="panel-heading clearfix"><h4 class="panel-titel' +
            ' pull-left" style="padding-top: 7.5px"><a data-toggle="collapse" data-parent="accordion" href="#collapse1" aria-expanded="true"></a>' +
            tittel + '</h4><div><button id="slettHandlelisteKnapp" class="btn btn-danger pull-right removeButton" type="button">Slett handleliste</button></div></div></div><div' +
            ' id="collapse1" class="panel-collapse collapse in" aria-expanded="true"><div class="panel-body"><div class="panel-body"><ul class="list-group"></ul><div id="list1"' +
            ' class="list-group"><form><div id="' + handlelisteId + '" class="input-group leggTilNyGjenstand"><input class="form-control" placeholder="Legg til ny gjenstand i listen"' +
            ' type="text"><div class="input-group-btn"><button id="leggTilNyGjenstandKnapp" class="btn btn-default" type="submit"><i class="glyphicon glyphicon-plus"></i>' +
            '</button></div></div></form><button id="utlegg" type="button" class="btn btn-primary pull-left" data-toggle="modal" data-target="#utleggmodal">Lag utlegg</button>' +
            '<!-- Rounded switch --><h5 id="offtekst" class="pull-right">Offentlig</h5><label class="switch pull-right"><input type="checkbox"><span class="slider round"></span>' +
            '</label></div></div></div></div></div>');*/

        for(var j = 0; j < varer.length; j++){
            vareId = varer[j].vareId;
            varenavn = varer[j].varenavn;
            kjøpt = varer[j].kjøpt;
            kjøperId = varer[j].kjøperId;
            //datokjøpt = new Date(varer[j].datokjøpt);
            $("#handlelister ul").append('<li class="list-group-item "> ' + varenavn + '<input title="toggle all" type="checkbox" class="all pull-right"></li>');
        }
    }
    if(offentlig){
        $(".slider").click();
    }
}

function displayDiv() {
    var x = document.getElementsByClassName("invisibleDiv");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
