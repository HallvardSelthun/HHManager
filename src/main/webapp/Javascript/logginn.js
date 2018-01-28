/**
 * Created by BrageHalse on 11.01.2018.
 */
/**
 * Legger lytter på logg inn-knappen og sjekker om epost og passord er tomme. Feilmelding dersom ett av feltene er
 * tomme. Det opprettes et objekt bruker med epost og passord.
 */
$(document).ready(function () {

    $("#loggInnBtn").on("click", function () {
        var brukerEpost = $("#email").val();
        var passord = $("#password").val();
        if (brukerEpost == "" || passord == "") {
            $('#epostPassordTom').fadeIn(200);
            setTimeout(function () {
                $('#epostPassordTom').fadeOut(200);
            }, 3000);
            return;
        }
        var bruker = {
            epost: brukerEpost,
            passord: passord
        };
        $.ajax({
            url: "server/BrukerService/login",
            type: 'POST',
            data: JSON.stringify(bruker),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var innBruker = (result);
                console.log(innBruker);
                if (innBruker == null) {
                    $('#epostPassordAlert').fadeIn(200);
                        return false;
                    return;
                }else if(innBruker.favHusholdning > 0){
                    $('#epostPassordAlert').fadeOut(200);
                    localStorage.setItem("husholdningId", innBruker.favHusholdning);
                    localStorage.setItem("bruker", JSON.stringify(innBruker));
                    window.location = "forside.html";
                    console.log("ok")
                    return;
                }
                localStorage.setItem("bruker", JSON.stringify(innBruker));
                window.location = "profil.html";
            },
            error: function () {
                $('#errorModal').modal('show');
            }
        })
    });

    /**
     * Lytter på knappen registrere bruker, som sender deg videre til lagbruker.html.
     */

    $("#regBruker").on("click", function () {
        window.location = "lagbruker.html";
    });

});

/**
 * Gjør at du kan trykke enter for å logge inn
 * @param event
 */
function keyCode(event) {
    var x = event.keyCode;
    if (x == 13) {
        $("#loggInnBtn").click();
    }
}