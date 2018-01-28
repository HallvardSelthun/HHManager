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
            $('#feltTom').fadeIn(200);
            setTimeout(function () {
                $('#feltTom').fadeOut(200);
            }, 3000);
            return;
        }
        if (password!=password2){
            $('#passordLike').fadeIn(200);
            setTimeout(function () {
                $('#passordLike').fadeOut(200);
            }, 3000);
            return;
        }
        if(password.length<6){
            $('#passordLengde').fadeIn(200);
            setTimeout(function () {
                $('#passordLengde').fadeOut(200);
            }, 3000);
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
                if (!result){
                    $('#epostRegistrert').fadeIn(200);
                    setTimeout(function () {
                        $('#epostRegistrert').fadeOut(200)
                    }, 3000);
                    $("#email").css('color', 'red');
                }else{
                    $('#registrerSuccess').fadeIn(200);
                    setTimeout(function () {
                        $('#registrerSuccess').fadeOut(200)
                        window.location = "index.html";
                    }, 3000);
                }
            },
            error: function () {
                $('#errorModal').modal('show');
            }
        })
    })
});