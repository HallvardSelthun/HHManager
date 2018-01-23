$(document).ready(function () {
    $("#lagUtlegg").on('click', function () {
        lagNyttUtlegg();
    });

    setTimeout(function () {
        lastinn()
    },250);

    //Kjør JavaScript
    init();

});

//Globale variabler
var testBrukerId = 1;
var alleOppgjor = [];

function init() {
    lastInnOppgjor(testBrukerId);
    //Resten av funksjonene ligger i callbacks for å sørge for riktig rekkefølge.
}

function utregnOppgjorSum() {

    var sum = 0;
    var totalSum = 0;
    for (var i = 0; i < alleOppgjor.length; i++) {
        for (var j = 0; j < alleOppgjor[i].utleggJegSkylder.length; j++) {
            sum = sum - alleOppgjor[i].utleggJegSkylder[j].delSum;
        }
        alleOppgjor[i].skylderSum = sum;
        totalSum = sum;
        sum = 0;
        for (j = 0; j < alleOppgjor[i].utleggDenneSkylderMeg.length; j++) {
            sum = sum + alleOppgjor[i].utleggDenneSkylderMeg[j].delSum;
        }
        alleOppgjor[i].skylderMegSum = sum;
        totalSum = totalSum + sum;
        if (totalSum > 0) {
            alleOppgjor[i].posNeg = "Pos";
        }
        else {
            alleOppgjor[i].posNeg = "Neg";
        }
        alleOppgjor[i].totalSum = totalSum;
    }

    displayOppgjor();
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
    else {

    }
});

function checkMotattRad(utleggId, skyldigBrukerId, next) {
    var test;

    $.ajax({
        url: 'server/utlegg/'+skyldigBrukerId+'/'+utleggId+'',
        type: 'PUT',
        success: function (result) {
            var suksess = result;
            next();
        },
        error: function () {
            alert("Noe gikk galt :(")
            return false;
        }
    });
}

function displayOppgjor() {

    // Compile the markup as a named template
    $.template( "oppgjorTemplate", $("#test-oppgjor"));

    $.template("rad-template", $("#rad-template"));

    //Append compiled markup
    for (var i = 0; i < alleOppgjor.length; i++) {
        $.tmpl( "oppgjorTemplate", alleOppgjor[i]).appendTo($("#panelGruppe"));

        $.tmpl( "rad-template", alleOppgjor[i].utleggJegSkylder).appendTo($("#radMinus"+i+""));
        console.log(alleOppgjor[i].utleggDenneSkylderMeg);
        $.tmpl( "rad-template", alleOppgjor[i].utleggDenneSkylderMeg).appendTo($("#radPlus"+i+""));
    }
}

//Legg til indekser på rader og oppgjør så de er raskere å finne senere
function leggInnRadNr(callback) {
    for (var i = 0; i < alleOppgjor.length; i++) {
        alleOppgjor[i].oppgjorNr = i;
        for (var j = 0; j < alleOppgjor[i].utleggJegSkylder.length; j++) {
            console.log("utleggId: "+alleOppgjor[i].utleggJegSkylder[j].utleggId);
            alleOppgjor[i].utleggJegSkylder[j].radNr = j;
        }

        for (var j = 0; j < alleOppgjor[i].utleggDenneSkylderMeg.length; j++) {
            alleOppgjor[i].utleggDenneSkylderMeg[j].radNr = j;
        }
    }
    callback();
}

//SQL-kall
function lastInnOppgjor(brukerId) {
    $.ajax({
        url: "server/utlegg/oppgjor/"+ brukerId,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            alleOppgjor = result;
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


function lagNyttUtlegg() {
    var sum = $("#sum").val();
    var beskrivelse = $("#utleggBeskrivelse").val();
    if(sum == "" || beskrivelse == ""){
        alert("pls gi en sum og beskrivelse :)");
        return;
    }
    var utleggerId = bruker.brukerId;
    var utleggsbetalere = [];
    $('#personer input:checked').each(function () {
        utleggsbetaler = {
            skyldigBrukerId: $(this).attr('id'),
            delSum: sum/$('#personer input:checked').length
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
            if (data){
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

function lastinn() {
    var husholdninger = JSON.parse(localStorage.getItem("husholdninger"));
    var husId = localStorage.getItem("husholdningId");
    console.log(husholdninger);
    for(var j = 0, lengt = husholdninger.length; j<lengt; j++){
        if (husholdninger[j].husholdningId==husId){
            for(var k =0 , l = husholdninger[j].medlemmer.length; k<l; k++){
                console.log(husholdninger[j].medlemmer[k].navn);
                $.template( "medlemmer", $("#listeMedlem"));
                $.tmpl("medlemmer", husholdninger[j].medlemmer[k]).appendTo($("#personer"));
            }
        }
    }
}

