/**
 * Created by BrageHalse on 11.01.2018.
 */
$(document).ready(function () {

    $("#loggInnBtn").on("click", function () {
        var brukerEpost = $("#email").val();
        var passord = $("#password").val();
        if (brukerEpost == "" || passord == "") {
            alert("skriv inn noke pls! ");
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
                    alert("feil epost eller passord!");
                    return;
                }else if(innBruker.favHusholdning > 0){
                    localStorage.setItem("bruker", JSON.stringify(innBruker));
                    window.location = "forside.html";
                    return;
                }
                localStorage.setItem("bruker", JSON.stringify(innBruker));
                window.location = "profil.html";
            },
            error: function () {
                alert("serverfeil kall 2 :/")
            }
        })
    });

    $("#regBruker").on("click", function () {
        window.location = "lagbruker.html";
    });

});


function keyCode(event) {
    var x = event.keyCode;
    if (x == 13) {
        $("#loggInnBtn").click();
    }
}