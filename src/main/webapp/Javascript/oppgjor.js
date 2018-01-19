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

    var input = [
        {brukerNavn: "Toni Vucic"}
    ];

    $("#buttonn").click(function() {
        // Compile the markup as a named template
        $.template( "oppgjorTemplate", $("#test-oppgjor"));
        //Append compiled markup
        $.tmpl( "oppgjorTemplate", input).appendTo($("#accordion"));

    });





    var kake = "Bløtkake";
    var markup = "<h1> Tekst og variabel: ${variabel} </h1>"

    //Mal: $.tmpl( myTemplate, myData ).appendTo( "#target" );


    var template = $('#hidden-template').html();

    var movies = [
        { Name: "The Red Violin", ReleaseYear: "1998" },
        { Name: "Eyes Wide Shut", ReleaseYear: "1999" },
        { Name: "The Inheritance", ReleaseYear: "1976" }
    ];

    var extra = [
        {extra: "Blautkake"}
    ]

    var markup =
        "<li>" +
            "<b>${Name}</b> (${ReleaseYear})" +
        "</li>";

    var markup2 =
        "<li>" +
            "Jeg liker <b>${extra}</b>" +
        "</li>";

    $("#buttonnn").click(function() {
        // Compile the markup as a named template
        $.template( "movieTemplate", markup );
        $.template( "extraTemplate", markup2/*$("#test-template")*/);

        // Render the template with the movies data and insert
        // the rendered HTML under the "movieList" element
        $.tmpl( "movieTemplate", movies ).appendTo($("#left"));
        $.tmpl( "extraTemplate", extra).appendTo($("#left"));

    });

});