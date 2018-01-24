/**
 * Gjelder dersom passord er glemt. Ved klikk på knappen send nytt passord, sendes et kall til
 * brukerservice som inneholder metoder for å få nytt passord tilsendt på mail.
 */
$(document).ready(
    $("#sendNyttPassordKnapp").on("click", function () {
        $.ajax({
            url: "server/Brukersevice/glemtpassord",
            type: 'PUT',
            data: $(this).val(),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function () {
                console.log(":D");
            }
        });
        }
    )
);