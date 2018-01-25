/**
 * Gjelder dersom passord er glemt. Ved klikk på knappen send nytt passord, sendes et kall til
 * brukerservice som inneholder metoder for å få nytt passord tilsendt på mail.
 */
$(document).ready(function () {
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
                    alert("Epost skal være sendt!")
                }else {
                    alert("Epost ble ikke sendt. Vennligst sjekk om du har skrevet inn riktig epostadresse")
                }
            }
        });
    });
});