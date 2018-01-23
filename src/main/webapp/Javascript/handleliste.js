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




    $("body").on("click", "#utlegg", function () {
        var arrayMedCheckedVarer = [];
        $("li[type=checkbox]").each(function() {
            if(this.checked){
                arrayMedCheckedVarer.push($(this).parent.val());
            }
        });
        console.log(arrayMedCheckedVarer);







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
        //console.log(husObj);
        //console.log("Prøver å sende husstand");

        if (navnHus == "") {
            //alert("Skriv inn noe");
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







    /*$("#leggTilNyGjenstandKnapp").on("click", function () {
        leggTilNyGjenstand();
    });
    $("#slettHandlelisteKnapp").on("click", function () {
        slettHandleliste();
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

function leggTilVare() {
    var nyGjenstandNavn = $(".leggTilNyGjenstand:focus").val();
    var handlelisteId = $(".leggTilNyGjenstand:focus").attr("id");
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
    var handlelisteId = document.getElementsByClassName("leggTilNyGjenstand")[0].getAttribute("id").slice(1);
    console.log(handlelisteId);

    $.ajax({
        url: "server/handleliste/" + handlelisteId,
        type: 'DELETE',
        //data: JSON.parse(handlelisteId),
        //contentType: 'application/json; charset=utf-8',
        //dataType: 'json',
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

function endreNavn(){}

function checkEllerUncheck(){

}

function endrePublic(){
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
}

function getHandlelisterData() {
    $.getJSON("server/handleliste/" + husholdningId + "/" + brukerId, function (data) {
        alleHandlelister = data;
    });
}

function getHandlelisteData(){
    $.getJSON("server/handleliste/" + handlelisteId, function (data) {
        handlelisten = data;
    });
}

function setupPage() {
    var tittel, handlelisteId, husholdningId, skaperId, varer, offentlig, frist, vareId, vareHandlelisteId, varenavn, kjøpt, kjøperId, datokjøpt;

    for(var i = 0; i < alleHandlelister.length; i++){
        tittel = alleHandlelister[i].tittel;
        handlelisteId = alleHandlelister[i].handlelisteId;
        husholdningId = alleHandlelister[i].husholdningId;
        skaperId = alleHandlelister[i].skaperId;
        varer = alleHandlelister[i].varer;
        offentlig = alleHandlelister[i].offentlig;
        //frist = alleHandlelister[i].frist;

        $("#handlelister").append('<div class="container-fluid panel panel-default"><div' +
            ' class="row panel-heading clearfix" data-toggle="collapse" data-parent="#handlelister" data-target="#' + handlelisteId + '" onclick="displayDiv()"><h4' +
            ' class="col-md-9 panel-titel" style="display: inline; padding: 0px">' + tittel + '</h4><div class="invisibleDiv"' +
            ' onclick="slettHandleliste()" style="display: inline; padding-left: 0px; padding-right: 0px">' +
            '<button class="col-md-3 btn btn-danger pull-right slettHandlelisteKnapp" type="button">Slett handleliste</button></div></div>' +
            '<div id="' + handlelisteId + '" class="panel-collapse collapse invisibleDiv row"><div class="panel-body container-fluid"><ul id= "liste'+handlelisteId+'" class="list-group"></ul>' +
            '<div id="list1" class="list-group"><form><div class="input-group"><input id="' + handlelisteId + '" class="form-control leggTilNyGjenstand"' +
            ' placeholder="Legg til ny gjenstand i listen" type="text"><div class="input-group-btn" onclick="leggTilVare()">' +
            '<button id="' + handlelisteId + '" class="btn btn-default" type="submit"><i class="glyphicon glyphicon-plus"></i></button></div></div></form>' +
            '<div class="container-fluid" style="padding: 0px"><button id="utlegg" type="button" class="btn btn-primary pull-left" data-toggle="modal"' +
            ' data-target="#utleggmodal">Lag' +
            ' utlegg</button><button' +
            ' id="utenUtlegg" type="button" class="btn btn-primary pull-left">Kjøpt uten utlegg</button>' +
            '<!-- Rounded switch --><h5 id="offtekst" class="pull-right">Offentlig</h5><label class="switch pull-right"><input type="checkbox"><span class="slider round">' +
            '</span></label></div></div></div></div></div>');

        for(var j = 0; j < varer.length; j++){
            vareId = varer[j].vareId;
            vareHandlelisteId = varer[j].handlelisteId;
            varenavn = varer[j].varenavn;
            kjøpt = varer[j].kjøpt;
            kjøperId = varer[j].kjøperId;
            //datokjøpt = new Date(varer[j].datokjøpt);
            //console.log($(".invisibleDiv").attr("id"));
            $("#liste"+handlelisteId).append('<label for="'+varenavn+'" class="list-group-item" name="vare"> ' + varenavn + '<input id="'+varenavn+'" title="toggle all"' +
                ' type="checkbox"' +
                ' class="all' +
                ' pull-right"></label>');
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