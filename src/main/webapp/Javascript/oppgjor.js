$(document).ready(function () {

    function lastInnOppgjor() {
        $.ajax({
            url: "server/BrukerService/registrer",
            type: 'POST',
            data: JSON.stringify(bruker),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result);
                console.log(data +" :D");
                if (!result){
                    alert("Epost er allerede registrert :/");
                    $("#email").css('color', 'red');
                }else{
                    alert("Bruker registrert!");
                    window.location = "index.html";
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
        navn: "Toni Vucic"
    };

    $("#buttonn").click(function() {
        // Compile the markup as a named template
        $.template( "oppgjorTemplate", $("#test-oppgjor"));
        //Append compiled markup
        $.tmpl( "oppgjorTemplate", oppgjor).appendTo($("#accordion"));
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





    var kake = "Bløtkake";
    var markup = "<h1> Tekst og variabel: ${variabel} </h1>"

    //Mal: $.tmpl( myTemplate, myData ).appendTo( "#target" );


    var template = $('#hidden-template').html();

    var movies = [
        { Name: "The Red Violin", ReleaseYear: "1998" },
        { Name: "Eyes Wide Shut", ReleaseYear: "1999" },
        { Name: "The Inheritance", ReleaseYear: "1976" }
    ];

});