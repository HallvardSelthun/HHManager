$(document).ready(function () {
    $("#lagUtlegg").on('click', function () {
       lagNyttUtlegg();
    });


    //Globale variabler
    var testBrukerId = 1;
    var alleOppgjor = [];

    //Kjør JavaScript
    init();

    function init() {
        lastInnOppgjor(testBrukerId);
        //Resten av funksjonene ligger i callbacks for å sørge for riktig rekkefølge.
    }

    function utregnOppgjorSum() {

    }

    function displayOppgjor() {

        // Compile the markup as a named template
        $.template( "oppgjorTemplate", $("#test-oppgjor"));

        $.template("rad-template", $("#rad-template"));
        //Append compiled markup

        for (i = 0; i < alleOppgjor.length; i++) {
            $.tmpl( "oppgjorTemplate", alleOppgjor[i]).appendTo($("#panelGruppe"));

            $.tmpl( "rad-template", alleOppgjor[i].utleggJegSkylder).appendTo($("#radMinus"+i+""));
            $.tmpl( "rad-template", alleOppgjor[i].utleggDenneSkylderMeg).appendTo($("#radPlus"+i+""));
        }
    }

    //Legg til indekser på rader og oppgjør så de er raskere å finne senere
    function leggInnRadNr(callback) {
        for (i = 0; i < alleOppgjor.length; i++) {
            alleOppgjor[i].oppgjorNr = i;
            for (j = 0; j < alleOppgjor[i].utleggJegSkylder.length; j++) {
                alleOppgjor[i].utleggJegSkylder.radNr = j;
            }
            for (j = 0; j < alleOppgjor[i].utleggDenneSkylderMeg.length; j++) {
                alleOppgjor[i].utleggDenneSkylderMeg.radNr = j;
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
                    leggInnRadNr(displayOppgjor);
                }
            },
            error: function () {
                alert("Serveren har det røft atm, prøv igjen senere :/");
            }
        })
    }

    var rad = {
        sum: -36,
        beskrivelse: "Pepperkakedeig",
        betalt: false,
        radNr: -1
    };

    var skylderRad = {
        sum: -36,
        beskrivelse: "Pepperkakedeig",
        betalt: false,
        radNr: -1
    };

    var skylderRad2 = {
        sum: -60,
        beskrivelse: "Taxi hjem",
        betalt: false,
        radNr: 2
    };

    var oppgjor = {
        utleggJegSkylder: [],
        utleggDenneSkylderMeg: [],
        brukerId: 123,
        navn: "Toni Vucic",
        oppgjorNr: -1 //Denne burde genereres når objektet kommer inn i JavaScript
    };

});


function lagNyttUtlegg() {
    var sum = $("#sum").val();
    var beskrivelse = $("#utleggBeskrivelse").val();
    var utleggerId = bruker.brukerId;
    var utleggsbetalere = [];
    skyldigBrukerId = 1;
    var antalDelbetalere = 1;
    var delSum = sum/antalDelbetalere;
    for(var i = 0,  leng = antalDelbetalere; i<leng; i++){
        utleggsbetaler = {
            skyldigBrukerId: skyldigBrukerId,
            delSum: delSum
        };
        utleggsbetalere.push(utleggsbetaler);
    }

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
            alert("RIP");
        }
    })
}