/**
 * Created by BrageHalse on 11.01.2018.
 */
$(document).ready(function () {
    /**
     * Created by Karol on 10-Jan-2018 at 10:55:44.
     */

    $("#registrerBtn").click(function () {

        var fornavn = $("#fornavn").val();
        var email = $("#email").val();
        var password = $("#password").val();
        if (fornavn == "" || email == "" || password == "") {
            alert("Du må fylle ut alle feltene")
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
                    alert("Bruker registrert!");
                    window.location = "index.html";
                }
            },
            error: function () {
                alert("Serveren har det røft atm, prøv igjen senere :/");
            }
        })
    })
});