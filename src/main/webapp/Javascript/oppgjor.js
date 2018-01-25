$(document).ready(function () {
    $("#lagUtlegg").on('click', function () {
        lagNyttUtlegg();
    });
    $(document).on('click', '.medlemCheck', function(){
        oppdaterBetalere();
    });
    $(document).on('click', '#vereMedPaaUtlegg', function () {
        oppdaterBetalere();
    });

    //Kjør JavaScript
    init();

});

//Globale variabler
var testBrukerId = 1;
var liveOppgjor = [];
var feridgeOppgjor = [];
var delSum = 0;

function init() {
    lastInnOppgjor(testBrukerId);
    setTimeout(function () {
        lastinn();
    },500);

    //Resten av funksjonene ligger i callbacks for å sørge for riktig rekkefølge.
}


/////////////////////////////////////////////////////
              // On-Event-funksjoner //
/////////////////////////////////////////////////////

//Historikk
$(document).on("click", "#historikk", function(event){
    // Compile the markup as a named template
    $.template( "oppgjorTemplate", $("#test-oppgjor"));

    $.template("rad-template", $("#rad-template"));

    //Append compiled markup
    for (var i = 0; i < liveOppgjor.length; i++) {
        $.tmpl( "oppgjorTemplate", liveOppgjor[i]).appendTo($("#historikkMain"));

        $.tmpl( "rad-template", liveOppgjor[i].utleggJegSkylder).appendTo($("#radMinus"+i+""));
        console.log(liveOppgjor[i].utleggDenneSkylderMeg);
        $.tmpl( "rad-template", liveOppgjor[i].utleggDenneSkylderMeg).appendTo($("#radPlus"+i+""));
    }
});

function populateHistorikk() {
    
}

$(document).on("click", ".checkboxes", function(event){
    var valgtSvarKnapp = $(this).attr('id');
    var utleggId = $(this).attr('data-utleggId');
    var skyldigBrukerId = $(this).attr('data-skyldigBrukerId');
    var substringed = valgtSvarKnapp.match(/\d+/g);

    var klikketKnapp = $(this);

    if ($(this).is(':checked')) {
        var ok = checkMotattRad(utleggId,skyldigBrukerId, function () {
            klikketKnapp.parent().parent().parent().fadeOut(500); //Fjern raden
        });
    }
});

//Når denne klikkes skal alle inni merkes som betalt i databasen
$(document).on("click", ".hovedCheckbox", function(event){
    var klikketKnapp = $(this);
    var knappNavn = $(this).attr('id');
    var oppgjorNr = knappNavn.match(/\d+/g);
    console.log("oppgjorNr: "+oppgjorNr);

    if ($(this).is(':checked')) {
        lagUtleggsbetalerListe(oppgjorNr, function () {
            klikketKnapp.parent().parent().parent().fadeOut(500); //Fjern raden
        });
        //Oppgjoret gjemmes når metoden over er over
    }
});


//////////////////////////////////////////////////////////////
        // Funksjoner som behandler data clientside //
//////////////////////////////////////////////////////////////

function oppdaterBetalere() {
    $("#betalere").text("");
    $('.medlemCheck').each(function () {
        var sum = $("#sum").val();
        var pluss = 0;
        if ($("#vereMedPaaUtlegg").is(":checked")){
            pluss = 1;
        }
        delSum = sum/($('#personer input:checked').length+pluss);
        if ($(this).is(":checked")){
            console.log($(this).attr('value'));
            $("#betalere").append('<br> '+$(this).attr('value') +' Sum: '+ delSum);
        }
    })
}

function utregnOppgjorSum() {

    var sum = 0;
    var totalSum = 0;
    for (var i = 0; i < liveOppgjor.length; i++) {
        for (var j = 0; j < liveOppgjor[i].utleggJegSkylder.length; j++) {
            sum = sum - liveOppgjor[i].utleggJegSkylder[j].delSum;
        }
        liveOppgjor[i].skylderSum = sum;
        totalSum = sum;
        sum = 0;
        for (j = 0; j < liveOppgjor[i].utleggDenneSkylderMeg.length; j++) {
            sum = sum + liveOppgjor[i].utleggDenneSkylderMeg[j].delSum;
        }
        liveOppgjor[i].skylderMegSum = sum;
        totalSum = totalSum + sum;
        if (totalSum > 0) {
            liveOppgjor[i].posNeg = "Pos";
        }
        else {
            liveOppgjor[i].posNeg = "Neg";
        }
        liveOppgjor[i].totalSum = totalSum;
    }

    displayOppgjor();
}

function lagUtleggsbetalerListe(oppgjorNr, callback) {
    console.log("OPPGJØRNR: "+oppgjorNr);
    console.log(liveOppgjor);
    var utleggsbetalere = [];
    var i;
    var gammeltObjekt;
    var utleggsbetalerObjekt;

    for (i = 0; i < liveOppgjor[oppgjorNr].utleggJegSkylder.length; i++) {
        gammeltObjekt = liveOppgjor[oppgjorNr].utleggJegSkylder[i];

        utleggsbetalerObjekt = {
            utleggId: gammeltObjekt.utleggId,
            betalt: true,
            skyldigBrukerId: gammeltObjekt.skyldigBrukerId
        };

        utleggsbetalere.push(utleggsbetalerObjekt);
    }
    console.log("utleggDenneSkylderMeg");
    console.log(liveOppgjor[oppgjorNr].utleggDenneSkylderMeg);
    for (i = 0; i < liveOppgjor[oppgjorNr].utleggDenneSkylderMeg.length; i++) {

        gammeltObjekt = liveOppgjor[oppgjorNr].utleggDenneSkylderMeg[i];
        console.log("GammeltObjekt");
        console.log(gammeltObjekt);

        utleggsbetalerObjekt = {
            utleggId: gammeltObjekt.utleggId,
            betalt: true,
            skyldigBrukerId: gammeltObjekt.skyldigBrukerId
        };

        utleggsbetalere.push(utleggsbetalerObjekt);
    }
    console.log(utleggsbetalere);
    return checkOppgjorSum(utleggsbetalere, callback);
}

//Legg til indekser på rader og oppgjør så de er raskere å finne senere
function leggInnRadNr(callback) {
    for (var i = 0; i < liveOppgjor.length; i++) {
        liveOppgjor[i].oppgjorNr = i;
        var j;
        for (j = 0; j < liveOppgjor[i].utleggJegSkylder.length; j++) {
            console.log("utleggId: "+liveOppgjor[i].utleggJegSkylder[j].utleggId);
            liveOppgjor[i].utleggJegSkylder[j].radNr = j;
        }

        for (j = 0; j < liveOppgjor[i].utleggDenneSkylderMeg.length; j++) {
            liveOppgjor[i].utleggDenneSkylderMeg[j].radNr = j;
        }
    }
    callback();
}


//////////////////////////////////////////////////////
                // AJAX-kode //
//////////////////////////////////////////////////////
//Når en rad krysses av i klienten skal den markeres som betalt i databasen
function checkMotattRad(utleggId, skyldigBrukerId, next) {
    $.ajax({
        url: 'server/utlegg/'+skyldigBrukerId+'/'+utleggId+'',
        type: 'PUT',
        success: function (result) {
            var suksess = result;
            next();
        },
        error: function () {
            alert("Noe gikk galt :(");
            return false;
        }
    });
}

function lastInnOppgjor(brukerId) {
    $.ajax({
        url: "server/utlegg/oppgjor/"+ brukerId,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            liveOppgjor = result;
            if (!result){
                alert("Noe rart har skjedd i lastInnOppgjor");
            }else{
                console.log(result);
                leggInnRadNr(utregnOppgjorSum);
            }
        },
        error: function () {
            alert("Serveren har det røft atm, prøv igjen senere :/");
        }
    })
}

function checkOppgjorSum(utleggsbetalere, next) {
    $.ajax({
        url: 'server/utlegg/utleggsbetaler',
        type: 'PUT',
        data: JSON.stringify(utleggsbetalere),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            suksess = result;
            alert("suksess ny greie: "+suksess);
            next();
        },
        error: function () {
            alert("Noe gikk galt :(");
        }
    });
}


function lagNyttUtlegg() {
    var sum = $("#sum").val();
    var beskrivelse = $("#utleggBeskrivelse").val();
    if(sum == "" || beskrivelse == ""){
        alert("pls gi en sum og beskrivelse :)");
        return;
    }
    var utleggerId = bruker.brukerId;
    var utleggsbetalere = [];
    //delSum = sum/$('#personer input:checked').length;
    $('#personer input:checked').each(function () {
        utleggsbetaler = {
            skyldigBrukerId: $(this).attr('id'),
            delSum: delSum
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


/////////////////////////////////////////////////////////
        // Kode for å legge inn dynamisk HTML //
/////////////////////////////////////////////////////////

function displayOppgjor() {
    // Compile the markup as a named template
    $.template( "oppgjorTemplate", $("#test-oppgjor"));

    $.template("rad-template", $("#rad-template"));

    //Append compiled markup
    for (var i = 0; i < liveOppgjor.length; i++) {
        $.tmpl( "oppgjorTemplate", liveOppgjor[i]).appendTo($("#panelGruppe"));

        $.tmpl( "rad-template", liveOppgjor[i].utleggJegSkylder).appendTo($("#radMinus"+i+""));
        console.log(liveOppgjor[i].utleggDenneSkylderMeg);
        $.tmpl( "rad-template", liveOppgjor[i].utleggDenneSkylderMeg).appendTo($("#radPlus"+i+""));
    }
}

function lastinn() {
    var husholdninger = JSON.parse(localStorage.getItem("husholdninger"));
    var husId = localStorage.getItem("husholdningId");
    console.log(husholdninger);
    //$.template( "medlemmerListe", $("#listeMedlemPls"));
    for(var j = 0, lengt = husholdninger.length; j<lengt; j++){
        if (husholdninger[j].husholdningId==husId){
            for(var k =0 , l = husholdninger[j].medlemmer.length; k<l; k++){
                var navn = husholdninger[j].medlemmer[k].navn;
                var id = husholdninger[j].medlemmer[k].brukerId;
                if (id != bruker.brukerId){
                    $("#personer").append('<li class="medlemCheck"><div><label role="button" type="checkbox" class="dropdown-menu-item checkbox">'+
                        '<input id="'+id+'" type="checkbox" role="button" value="'+navn+'" class="medlemCheck">'+
                        navn +'</label></div></li>');
                }
            }
        }
    }
}

