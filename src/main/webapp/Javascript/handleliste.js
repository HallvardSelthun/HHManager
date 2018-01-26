/**
 * Created by Karol on
 * 14.01.2018.
 */
/**
 * Definerer variabler
 */
var bruker = JSON.parse(localStorage.getItem("bruker"));
var epost = bruker.epost;
var brukerId = bruker.brukerId;
var husholdningId = localStorage.getItem("husholdningId");
var husholdning;
var alleHandlelister;
var boxesChecked = [];
//var antVarerChecked;

/**
 * kaller på funksjonen getHandlelisterData. Legger til lytter på knappen legg til ny handleliste
 * og slett handleliste og kaller samtidig på funksjonen leggTilNyHandleliste().
 */
$(document).ready(function () {
    getHandlelisterData();
    gethhData();
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

    $(document).on('click','.slettHandlelisteKnapp', function () {
        slettHandleliste($(this).attr('value'))
    });

    $(document).on('click', '.utleggKnapp', function(){
        checkChecked("liste" + $(this).attr('id').slice(6));
        lagUtleggVarer();
    });
    $(document).on('click', '.sendUtlegg', function(){
        sendUtlegg();
    });
});

/**
 * Funksjon for å legge til ny handleliste i systemet. Lagrer navnet på handlelisten og legger antall
 * varer i en tabell, samt spør og sjekker om handleliste skal være offentlig eller ikke.
 */
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
    /**
     * Kall til handleliste i server fo å legge til handlelisteobjektet som er definert over.
     */
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

/**
 * Gjør at man kan legge til varer i handlelisten som er opprettet. Varen får et navn og legges
 * til i riktig handleliste med en handlelisteId.
 */

$(document).on('click', '.nyVareKnapp', function() {
    var listeId = $(this).attr('value');
    var input = ($(this).parent().siblings(".leggTilNyGjenstand").eq(0).val());
    var temp = "#"+listeId;

    leggTilVare(listeId, input);

});
function leggTilVare(hlId, navn) {
    var nyGjenstandNavn = $(".leggTilNyGjenstand:focus").val();

    var vare = {
        varenavn: navn,
        handlelisteId: hlId
    };
    console.log(vare);


    if (nyGjenstandNavn == "") {
        alert("Skriv navnet til gjenstanden!");
        return;
    }

    /**
     * Sender et ajax-kall til handleliste i server der varen lagres.
     */
    setTimeout(function(){
        $.ajax({
            url: "server/handleliste/nyVare",
            type: 'POST',
            data: JSON.stringify(vare),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result);
                window.location = "handlelister.html";

                if (data) {

                } else {
                    alert("feil!");
                }
            },
            error: function () {
                alert("serverfeil :/")
            }
        });
    },200);


}

/**
 *
 * @param sletteId tar inn id på handeliste for å kunne slette riktig handleliste. Id-en sendes til
 * handleliste i server.
 */
function slettHandleliste(sletteId) {
    $.ajax({
        url: "server/handleliste/" + sletteId,
        type: 'DELETE',
        data: JSON.parse(sletteId),
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

function endreNavn(){}

function checkEllerUncheck(){}

/**
 * Funksjonen kalles når bruker vil endre sin egen handleliste fra public til privat. Andre medlemmer
 * skal ikke kunne gjøre dine handlelister private.
 */
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

/**
 * Henter data om handleliste med husholdningsid og brukerid
 */
function getHandlelisterData() {
    $.getJSON("server/handleliste/" + husholdningId + "/" + brukerId, function (data) {
        alleHandlelister = data;
    });
}

function gethhData() {
    $.getJSON("server/hhservice/" + husholdningId + "/husholdningData", function (data) {
        husholdning = data;
    });
}

/**
 *
 * @param formname lar deg huke av handlelister du er ferdige med.
 * @returns {boolean}
 */
function checkChecked(formname) {
    //console.log(formname);
    $('#' + formname + ' input[type="checkbox"]').each(function() {
        if ($(this).is(":checked")) {
            boxesChecked.push($(this).attr("id"));
        }
    });

    if (boxesChecked == false) {
        alert('Du må krysse av minst en vare');
        return false;
    }
    //console.log(boxesChecked);
}

function lagUtleggVarer() {
    var vareNavn = "";
    var medlemmer = husholdning.medlemmer;
    var medlemNavn = "";
    for(var i = 0; i < boxesChecked.length; i++){
        vareNavn = boxesChecked[i];
        //console.log(vareNavn);
        $("#valgteVarer").append('<li class="list-group-item">' + vareNavn + '</li>');
    }
    for(var j = 0; j < medlemmer.length; j++){
        medlemNavn = medlemmer[j].navn;
        medlemId = medlemmer[j].brukerId;
        $("#medbetalere").append('<label class="list-group-item">' + medlemNavn + '<input id="' + medlemId + '" title="toggle all" type="checkbox" class="all pull-right"></label>');
    }
    //antVarerChecked = boxesChecked.length;
}

/**
 * Sender utlegg til de personene som blir sjekket av
 */

function sendUtlegg() {
    var sum = $("#sum").val();
    var beskrivelse = "Kjøpt: ";
    var vareNavn;
    for(var i = 0; i < boxesChecked.length; i++){
        vareNavn = boxesChecked[i];
        beskrivelse += vareNavn + ", ";
    }
    beskrivelse = beskrivelse.replace(-1, ".");



    if(sum == "" || beskrivelse == ""){
        alert("pls gi en sum og beskrivelse :)");
        return;
    }
    var utleggerId = bruker.brukerId;
    var utleggsbetalere = [];
    //delSum = sum/$('#personer input:checked').length;
    $('#medbetalere input:checked').each(function () {
        utleggsbetaler = {
            skyldigBrukerId: $(this).attr('id'),
            //delSum: delSum
        };
        utleggsbetalere.push(utleggsbetaler)
    });

    utlegg = {
        utleggerId: utleggerId,
        sum: sum,
        beskrivelse: beskrivelse,
        utleggsbetalere: utleggsbetalere
    };

    $.ajax({
        url: "server/utlegg/nyttutlegg",
        type: 'POST',
        data: JSON.stringify(utlegg),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data =JSON.parse(result);
            if (data){ //Returnerer vel true
                location.reload(true);
                alert(" :D");
            }else{
                alert("D:");
            }
        },
        error: function () {
            alert("RIPinpeace");
        }
    })
}

/**
 * Lar alle handlelister bli synlige i nettleser.
 */
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

            $("#handlelister").append('<div class="container-fluid panel panel-default">' +
                '   <div class="row panel-heading clearfix" data-toggle="collapse" data-parent="#handlelister" data-target="#' + handlelisteId + '">' +
                '       <h4 class="col-md-9 panel-titel" role="button" style="display: inline; padding: 0px">' + tittel + '</h4>' +
                '       <div class="invisibleDiv" onclick="slettHandleliste()" style="display: inline">' +
                '       <button class="col-md-3 btn btn-danger pull-right slettHandlelisteKnapp" id="slett' + handlelisteId + '" type="button" value ="' + handlelisteId + '" style="margin-top: 2px">Slett' +
                ' handleliste</button>' +
                '       </div>' +
                '   </div>' +
                '   <div id="' + handlelisteId + '" class="panel-collapse collapse invisibleDiv ">' +
                '       <div class="panel-body row" style="padding-bottom: 0px">' +
                '           <div class="container-fluid">' +
                '               <ul id="liste' + handlelisteId + '" class="list-group row"></ul>' +
                '               <div id="list1" class="list-group row">' +
                '                       ' +
                '                           <div class="input-group container-fluid">' +
                '                               <input id="' + handlelisteId + '" class="form-control leggTilNyGjenstand" placeholder="Legg til ny gjenstand i listen" type="text">' +
                '                                   <div class="input-group-btn">' +
                '                                       <button class="btn btn-default nyVareKnapp" value="'+handlelisteId+'">' +
                '                                           <i class="glyphicon glyphicon-plus"></i>' +
                '                                       </button>' +
                '                                   </div>' +
                '                           </div>' +
                '                      ' +
                '                       <div class="row">' +
                '                           <div class="container-fluid">' +
                '                                   <button id="utlegg'+handlelisteId+'" type="button" class="btn btn-primary pull-left utleggKnapp" data-toggle="modal"' +
                ' data-target="#utleggmodal" style="margin-right: 5px; margin-top: 10px">Lag utlegg</button>' +
                '                                   <button id="utenUtlegg" type="button" class="btn btn-primary pull-left" style="margin-top: 10px">Kjøpt uten' +
                ' utlegg</button>' +
                '                           <!-- Rounded switch -->' +
                '                               <h5 id="offtekst" class="pull-right">Offentlig</h5>' +
                '                               <label class="switch pull-right" style="alignment: right">' +
                '                                   <input id="switch' + handlelisteId + '" type="checkbox">' +
                '                                   <span class="slider round"></span>' +
                '                               </label>' +
                '                        </div>' +
                '                   </div>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>');

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

    if(boxesChecked != null){
        var x = "";
        for(i = 0; i < boxesChecked.length; i++){
            $("#valgteVarer").append('<label for="' + boxesChecked[i] + '" class="list-group-item" name="vare"> ' + boxesChecked[i] + '</label>');
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