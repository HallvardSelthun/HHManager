$(document).ready(function () {

    //Globale variabler
    var testBrukerId = 1;
    var alleOppgjor = {oppgjorene: []};

    //Kjør JavaScript
    init();

    function init() {
        lastInnOppgjor(testBrukerId);
    }

    function displayOppgjor() {
        //Compile the markup as a named template
        $.template( "oppgjorTemplate", $("#test-oppgjor"));
        for (i = 0; i < alleOppgjor.length; i++) {
            $.tmpl( "oppgjorTemplate", oppgjor[i].appendTo($("#panelGruppe")));
        }
        //Append compiled markup
        leggInnSkylderRader();
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
                    console.log(result)
                    //alert(alleOppgjor[0].utleggDenneSkylderMeg[0].beskrivelse);
                }
            },
            error: function () {
                alert("Serveren har det røft atm, prøv igjen senere :/");
            }
        })
    }

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

    $("#buttonn").click(function() {
        // Compile the markup as a named template
        $.template( "oppgjorTemplate", $("#test-oppgjor"));
        //Append compiled markup
        $.tmpl( "oppgjorTemplate", oppgjor).appendTo($("#panelGruppe"));
        leggInnSkylderRader();

    });

    function leggInnSkylderRader() {
        oppgjor.utleggJegSkylder.push(skylderRad);
        oppgjor.utleggJegSkylder.push(skylderRad2);

        //Compile
        $.template("rad-template", $("#rad-template"));
        //Append compiled markup
        $.tmpl("rad-template", oppgjor.utleggJegSkylder).appendTo($("#radData"));
    }
});