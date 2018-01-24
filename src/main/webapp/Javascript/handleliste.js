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
    $(".invisibleDiv").on("click", function () {
        displayDiv();
    });
    $(".switch").on("click", function () {
        endrePublic();
    });


    /*$("#leggTilNyGjenstandKnapp").on("click", function () {
        leggTilNyGjenstand();
    });
    */
    $(document).on('click','.slettHandlelisteKnapp', function () {
        slettHandleliste($(this).attr('value'))
    });
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

function leggTilVare() {
    var nyGjenstandNavn = $(".leggTilNyGjenstand:focus").val();
    var handlelisteId = $(".leggTilNyGjenstand:focus").attr("id");

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

function slettHandleliste(sletteId) {


    $.ajax({
        url: "server/handleliste/" + sletteId,
        type: 'DELETE',
        data: JSON.parse(sletteId),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            alert("Det gikk bra!");

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

function endreNavn(){}

function checkEllerUncheck(){

}

function endrePublic(){
    //var offentlifKnapp = $(".switch input").prop("checked");

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
}

function getHandlelisterData() {
    $.getJSON("server/handleliste/" + husholdningId + "/" + brukerId, function (data) {
        alleHandlelister = data;
    });
}

function checkChecked(formname) {
    var anyBoxesChecked = false;
    $('#' + formname + ' input[type="checkbox"]').each(function() {
        if ($(this).is(":checked")) {
            anyBoxesChecked += $(this).is(":checked").attr("id");
        }
    });

    if (anyBoxesChecked == false) {
        alert('Please select at least one checkbox');
        return false;
    }

    console.log(anyBoxesChecked);
}

function setupPage() {
    var tittel, handlelisteId, husholdningId, skaperId, varer, offentlig, frist, vareId, vareHandlelisteId, varenavn, kjøpt, kjøperId, datokjøpt;

    for (var i = 0; i < alleHandlelister.length; i++) {
        if (alleHandlelister[i].gjemt == 0) {
            tittel = alleHandlelister[i].tittel;
            handlelisteId = alleHandlelister[i].handlelisteId;
            husholdningId = alleHandlelister[i].husholdningId;
            skaperId = alleHandlelister[i].skaperId;
            varer = alleHandlelister[i].varer;
            offentlig = alleHandlelister[i].offentlig;
            //frist = alleHandlelister[i].frist;

            $("#handlelister").append('<div class="container-fluid panel panel-default"><div' +
                ' class="row panel-heading clearfix" data-toggle="collapse" data-parent="#handlelister" data-target="#' + handlelisteId + '"><h4' +
                ' class="col-md-9 panel-titel" role="button" style="display: inline; padding: 0px">' + tittel + '</h4><div class="invisibleDiv"' +
                ' onclick="slettHandleliste()" style="display: inline; padding-left: 0px; padding-right: 0px">' +
                '<button class="col-md-3 btn btn-danger pull-right slettHandlelisteKnapp" id="slett' + handlelisteId + '" type="button" value ="' + handlelisteId + '">Slett handleliste</button></div></div>' +
                '<div id="' + handlelisteId + '" class="panel-collapse collapse invisibleDiv row"><div class="panel-body container-fluid"><ul id= "liste' + handlelisteId + '" class="list-group"></ul>' +
                '<div id="list1" class="list-group"><form><div class="input-group"><input id="' + handlelisteId + '" class="form-control leggTilNyGjenstand"' +
                ' placeholder="Legg til ny gjenstand i listen" type="text"><div class="input-group-btn" onclick="leggTilVare()">' +
                '<button id="' + handlelisteId + '" class="btn btn-default" type="submit"><i class="glyphicon glyphicon-plus"></i></button></div></div></form>' +
                '<div class="container-fluid"><div class="row"><button id="utlegg" type="button" class="align-left btn btn-primary' +
                ' pull-left align-middle" data-toggle="modal" data-target="#utleggmodal" onclick="checkChecked("liste'+handlelisteId+'")">Lag utlegg</button><button' +
                ' id="utenUtlegg" type="button" class="btn btn-primary pull-left align-items-center">Kjøpt uten utlegg</button>' +
                '<!-- Rounded switch --><div><h5 id="offtekst" class="pull-right">Offentlig</h5><label class="switch pull-right"><input id="switch' + handlelisteId + '" type="checkbox"><span' +
                ' class="slider round">' +
                '</span></label></div></div></div></div></div></div></div>');

            for (var j = 0; j < varer.length; j++) {
                vareId = varer[j].vareId;
                vareHandlelisteId = varer[j].handlelisteId;
                varenavn = varer[j].varenavn;
                kjøpt = varer[j].kjøpt;
                kjøperId = varer[j].kjøperId;
                //datokjøpt = new Date(varer[j].datokjøpt);
                $("#liste" + handlelisteId).append('<label for="' + varenavn + '" class="list-group-item" name="vare"> ' + varenavn + '<input id="' + varenavn + '" title="toggle' +
                    ' all" type="checkbox" class="all pull-right"></label>');
            }
        }
        if (offentlig) {
            $("#switch" + handlelisteId).prop("checked", true);
        }
    }


}

function displayDiv() {
    var x = document.getElementsByClassName("invisibleDiv");
    if ($(".invisibleDiv").css("display") === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}