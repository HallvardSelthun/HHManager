/**
 * Created by BrageHalse on 11.01.2018.
 */
$(document).ready(function () {

    // henter hash og salt ved hjelp av epost
    // hasher passord fra bruker sammen med saltet
    // sjekker om lokal hash og hash fra databasen er den samme
    // hvis ok, logg in
    $("#loggInnBtn").on("click", function () {
        if (brukerEpost == "" || passord == "") {
            alert("skriv inn noke pls! ");
            return;
        }
        $.ajax({
            url: "BrukerService/" + brukerEpost + "/brukerData",
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (bruker) {
                var hashenAjax = bruker.hashen;
                var salt = bruker.salt;
                var lokalHash = sha1($("#password").val() + salt);
                if (hashenAjax == lokalHash) {


                }
            },
            error: function () {
                alert("Serverfeil :/");
            }
        });


        passord = MD5(passord);
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
                alert("serverfeil :/")
            }
        })
    })
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
var favHus;