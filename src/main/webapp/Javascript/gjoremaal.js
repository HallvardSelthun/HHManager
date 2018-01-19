var minBruker = JSON.parse(localStorage.getItem("bruker"));
var bruker;
var utførerId = minBruker.brukerId;

$(document).ready(function () {

    $("body").on("click", "#lagreGjoremal", function () {
        var beskrivelse = $("#gjoremalInput").val();
        var utførerId = $("#menu1").val();
        var frist = $("#dato").val();
        var husholdningId = localStorage.getItem("husholdningId");

        var gjoremal = {
            beskrivelse: beskrivelse,
            utførerId: utførerId,
            frist: frist,
            husholdningId: husholdningId
        };

        console.log("halo ja")

        if (beskrivelse == "") {
            alert("Skriv inn noe");
            return;
        }
        $.ajax({
            url: "server/hhservice/LeggTilGjoremal",
            type: 'POST',
            data: JSON.stringify(gjoremal),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result); // gjør string til json-objekt
                console.log("Data: " + data);
                if (data) {
                    alert("Det gikk bra!");
                } else {
                    alert("feil!");
                }
                window.location = "gjormaal.html";
            },
            error: function () {
                alert("serverfeil :/");
                console.log(gjoremal)
            }
        });
        $("#button").on('click', function () {
            alert("Du har valgt å avbryte")
        });
    });

    $("body").on("click", "#lagreMineGjoremal", function () {
        var beskrivelse = $("#mineGjoremalInput").val();
        var frist = $("#minDato").val();
        var husholdningId = localStorage.getItem("husholdningId");

        var gjoremal = {
            utførerId: minBruker.brukerId,
            beskrivelse: beskrivelse,
            frist: frist,
            husholdningId: husholdningId
        };

        if (beskrivelse == "") {
            alert("Skriv inn noe");
            return;
        }
        $.ajax({
            url: "server/hhservice/gjøremål",
            type: 'POST',
            data: JSON.stringify(gjoremal),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result); // gjør string til json-objekt
                console.log("Data: " + data);
                if (data) {
                    alert("Det gikk bra!");
                } else {
                    alert("feil!");
                }
                window.location = "gjormaal.html";
            },
            error: function () {
                alert("serverfeil :/");
                console.log(gjoremal)
            }
        });
        $("#button").on('click', function () {
            alert("Du har valgt å avbryte")
        });
    });
});