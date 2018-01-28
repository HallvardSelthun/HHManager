/**
 * Created by BrageHalse on 11.01.2018.
 */


$(document).ready(function () {
    /**
     * Created by Karol on 10-Jan-2018 at 10:55:44.
     */

    /**
     * Legger lytter på knappen registrer deg, fornavn, email og passord lagres i databasen.
     * Er en eller flere tekstfelter tomme skal bruker få feilmelding. Bruker lagres i Bruker-
     * Service dersom registrering er ok.
     */
    $("#registrerBtn").click(function () {

        var fornavn = $("#fornavn").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var password2= $("#password2").val();
        if (fornavn == "" || email == "" || password == "" || password2 == "") {
            alert("Du må fylle ut alle feltene");
            return;
        }
        if (password!=password2){
            alert("Passordene er ikke like, vennligst skriv inn riktig!");
            return;
        }
        if(password.length<6){
            alert('Velg et passord med minst 7 bokstaver!');
            return;
        }
        var bruker = {navn: fornavn, passord: password, epost: email};

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
                    alert("Bruker registrert! Logg deg på.");
                    window.location = "index.html";
                }
            },
            error: function () {
                $('#errorModal').modal('show');
            }
        })
    })
});