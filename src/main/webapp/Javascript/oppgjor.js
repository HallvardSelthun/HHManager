//Additional JavaScript
/** Testet with:
 *  - IE 5.5, 7.0, 8.0, 9.0 (preview)
 *  - Firefox 3.6.3, 3.6.8
 *  - Safari 5.0
 *  - Chrome 5.0
 *  - Opera 10.10, 10.60
 */
var JavaScript = {
    load: function(src, callback) {
        var script = document.createElement('script'),
            loaded;
        script.setAttribute('src', src);
        if (callback) {
            script.onreadystatechange = script.onload = function() {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    }
};


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


    JavaScript.load("http://ajax.microsoft.com/ajax/jquery.templates/beta1/jquery.tmpl.js", function () {
        init();
    })
    /*
    var script = document.createElement('script');
    script.src = "http://ajax.microsoft.com/ajax/jquery.templates/beta1/jquery.tmpl.js";
    script.async = true;
    document.head.appendChild(script);
    */
    console.log("testbruk: "+testBrukerId);
});

//Globale variabler
var bruker = JSON.parse(localStorage.getItem("bruker"));
var testBrukerId = bruker.brukerId;
var liveOppgjor = [];
var feridgeOppgjor = [];
var delSum = 0;

function init() {
    lastInnOppgjor(testBrukerId,1);
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
    lastInnOppgjor(testBrukerId,0);
});

function displayHistorikk(oppgjorArray) {
    /*
    // Compile the markup as a named template
    $.template( "oppgjorTemplate", $("#test-oppgjor"));

    $.template("rad-template", $("#rad-template"));
    */

    var startOppgjorNr = liveOppgjor.length;
    console.log("Inne i displayHistorikk");

    //Append compiled markup
    for (var i = 0; i < oppgjorArray.length; i++) {
        $.tmpl( "oppgjorTemplate", oppgjorArray[i]).appendTo($("#historikkMain"));
        console.log(oppgjorArray[i].utleggJegSkylder);
        $.tmpl( "rad-template", oppgjorArray[i].utleggJegSkylder).appendTo($("#radMinus"+i+""));
        console.log(oppgjorArray[i].utleggDenneSkylderMeg);
        $.tmpl( "rad-template", oppgjorArray[i].utleggDenneSkylderMeg).appendTo($("#radPlus"+i+""));
    }
}

$(document).on("click", ".checkboxes", function(event){
    var valgtSvarKnapp = $(this).attr('id');
    var utleggId = $(this).attr('data-utleggId');
    var skyldigBrukerId = $(this).attr('data-skyldigBrukerId');
    var substringed = valgtSvarKnapp.match(/\d+/g);

    var oppgjorNrString = $(this).parent().parent().parent().parent().attr('id');
    var oppgjorNr = oppgjorNrString.match(/\d+/g);

    var klikketKnapp = $(this);

    if ($(this).is(':checked')) {
        var ok = checkMotattRad(utleggId,skyldigBrukerId, function () {
            klikketKnapp.parent().parent().parent().fadeOut(500); //Fjern raden
            console.log("antall: "+liveOppgjor[oppgjorNr].antallUtleggsbetalere);
            liveOppgjor[oppgjorNr].antallUtleggsbetalere--;
            console.log(" etter minus: "+liveOppgjor[oppgjorNr].antallUtleggsbetalere);
            if (liveOppgjor[oppgjorNr].antallUtleggsbetalere <= 0) {
                $("#collapse"+oppgjorNr+"").parent().fadeOut(500);
            }
        });

    }
});

//Når denne klikkes skal alle inni merkes som betalt i databasen

$(document).on("click", ".hovedCheckbox", function(event){
    var klikketKnapp = $(this);
    var knappNavn = $(this).attr('id');
    var oppgjorNr = knappNavn.match(/\d+/g);

    if ($(this).is(':checked')) {
        lagUtleggsbetalerListe(liveOppgjor, oppgjorNr, function () {
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
            $("#betalere").append('<br> '+$(this).attr('value') +' Sum: '+ delSum);
        }
    })
}

function tellAntallUtleggsbetalere(oppgjorArray) {
    var utleggsBetalerPerOppgjor = 0;

    for (var i = 0; i < oppgjorArray.length; i++) {
        utleggsBetalerPerOppgjor = 0;
        utleggsBetalerPerOppgjor += oppgjorArray[i].utleggDenneSkylderMeg.length;
        utleggsBetalerPerOppgjor += oppgjorArray[i].utleggJegSkylder.length;
        oppgjorArray[i].antallUtleggsbetalere = utleggsBetalerPerOppgjor;
        console.log("Oppgjor "+i+" har "+oppgjorArray[i].antallUtleggsbetalere+" oppgjorsbetalere");
    }
    console.log("Ferdig med telling")
}

function utregnOppgjorSum(oppgjorArray) {

    var sum = 0;
    var totalSum = 0;
    var j = 0;
    for (var i = 0; i < oppgjorArray.length; i++) {
        sum = 0;
        for (j = 0; j < oppgjorArray[i].utleggJegSkylder.length; j++) {
            sum = sum - oppgjorArray[i].utleggJegSkylder[j].delSum;
        }
        oppgjorArray[i].skylderSum = sum;
        console.log("Oppgjor "+i+" skylderSum "+ sum);
        totalSum = sum;
        sum = 0;
        for (j = 0; j < oppgjorArray[i].utleggDenneSkylderMeg.length; j++) {
            sum = sum + oppgjorArray[i].utleggDenneSkylderMeg[j].delSum;
        }
        console.log("Oppgjor "+i+" skylderMegSum "+sum);
        oppgjorArray[i].skylderMegSum = sum;
        totalSum = totalSum + sum;
        if (totalSum > 0) {
            oppgjorArray[i].posNeg = "Pos";
        }
        else {
            oppgjorArray[i].posNeg = "Neg";
        }
        oppgjorArray[i].totalSum = totalSum;
    }
    console.log("Summer:");
    console.log(oppgjorArray);

    displayOppgjor(oppgjorArray);
}

function lagUtleggsbetalerListe(oppgjorArray, oppgjorNr, callback) {
    var utleggsbetalere = [];
    var i;
    var gammeltObjekt;
    var utleggsbetalerObjekt;

    for (i = 0; i < oppgjorArray[oppgjorNr].utleggJegSkylder.length; i++) {
        gammeltObjekt = oppgjorArray[oppgjorNr].utleggJegSkylder[i];

        utleggsbetalerObjekt = {
            utleggId: gammeltObjekt.utleggId,
            betalt: true,
            skyldigBrukerId: gammeltObjekt.skyldigBrukerId
        };

        utleggsbetalere.push(utleggsbetalerObjekt);
    }

    for (i = 0; i < oppgjorArray[oppgjorNr].utleggDenneSkylderMeg.length; i++) {

        gammeltObjekt = oppgjorArray[oppgjorNr].utleggDenneSkylderMeg[i];

        utleggsbetalerObjekt = {
            utleggId: gammeltObjekt.utleggId,
            betalt: true,
            skyldigBrukerId: gammeltObjekt.skyldigBrukerId
        };

        utleggsbetalere.push(utleggsbetalerObjekt);
    }
    return checkOppgjorSum(utleggsbetalere, callback);
}

//Legg til indekser på rader og oppgjør så de er raskere å finne senere
function leggInnRadNr(callback, oppgjorArray) {
    for (var i = 0; i < oppgjorArray.length; i++) {
        oppgjorArray[i].oppgjorNr = i;
        var j;
        for (j = 0; j < oppgjorArray[i].utleggJegSkylder.length; j++) {
            oppgjorArray[i].utleggJegSkylder[j].radNr = j;
        }

        for (j = 0; j < oppgjorArray[i].utleggDenneSkylderMeg.length; j++) {
            oppgjorArray[i].utleggDenneSkylderMeg[j].radNr = j;
        }
    }
    callback(oppgjorArray);
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

function lastInnOppgjor(brukerId, betalt) {
    $.ajax({
        url: "server/utlegg/oppgjor/"+ brukerId,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var valgtOppgjorArray = []
            if (betalt === 1) {
                liveOppgjor = result;
                valgtOppgjorArray = liveOppgjor;
                tellAntallUtleggsbetalere(liveOppgjor);
            }
            else {
                feridgeOppgjor = result;
                valgtOppgjorArray = feridgeOppgjor;
            }
            if (!result){
                alert("Noe rart har skjedd i lastInnOppgjor");
            }else{
                console.log(result);
                leggInnRadNr(utregnOppgjorSum, valgtOppgjorArray);
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

function displayOppgjor(oppgjorArray) {
    if (oppgjorArray === liveOppgjor) {
        // Compile the markup as a named template
        $.template( "oppgjorTemplate", $("#test-oppgjor"));

        $.template("rad-template-deSkylder", $("#rad-template-deSkylder"));
        $.template("rad-template-duSkylder", $("#rad-template-duSkylder"))

        //Append compiled markup
        for (var i = 0; i < oppgjorArray.length; i++) {
            $.tmpl( "oppgjorTemplate", oppgjorArray[i]).appendTo($("#panelGruppe"));

            $.tmpl( "rad-template-duSkylder", oppgjorArray[i].utleggJegSkylder).appendTo($("#radMinus"+i+""));
            $.tmpl( "rad-template-deSkylder", oppgjorArray[i].utleggDenneSkylderMeg).appendTo($("#radPlus"+i+""));
        }
    }
    else {
        displayHistorikk(oppgjorArray);
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

