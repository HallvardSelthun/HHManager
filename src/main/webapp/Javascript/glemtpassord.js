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