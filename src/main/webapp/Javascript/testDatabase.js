/**
 * Testklasse
 */
function test() {
    $.ajax({
        url:"../server/brukere",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        dataype: "json",
        success: function (result) {
            console.log("gettet");
            console.log(result);
        },
        error: function (result) {
            $('#errorModal').modal('show');
        }
    })
}

$(document).ready(function () {
    $("#testknapp").click(function () {
        console.log("trykket");
        test();
    })
});