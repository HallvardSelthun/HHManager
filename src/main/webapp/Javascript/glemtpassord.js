/**
 * Gjelder dersom passord er glemt. Ved klikk på knappen send nytt passord, sendes et kall til
 * brukerservice som inneholder metoder for å få nytt passord tilsendt på mail.
 * Ved klikk på tilbake-knappen vil navigere tilbake til innloggingssiden.
 */
$(document).ready(function () {
    $("#tilbake").on("click", function () {
        window.location = "index.html"
    });

    $("#sendNyttPassordKnapp").on("click", function () {
        var epost = $("#email").val();
        $.ajax({
            url: "server/BrukerService/glemtpassord",
            type: 'PUT',
            data: JSON.stringify(epost),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result);
                if(data) {
                    $("#sendt").fadeIn();
                    $("#feil").hide();
                }else {
                    $("#sendt").hide();
                    $("#feil").fadeIn();
                }
            },
            error: function () {
                $('#errorModal').modal('show');
            }
        });
    });
});