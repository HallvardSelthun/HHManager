$(document).ready(function () {

    function

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
});