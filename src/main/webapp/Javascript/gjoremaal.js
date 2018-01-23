var minBruker = JSON.parse(localStorage.getItem("bruker"));
var bruker;
var utførerId = minBruker.brukerId;
var minegjoremal = minBruker.gjøremål;
var fellesgjoremal;
var husholdningId = localStorage.getItem("husholdningId")


function hentFellesGjoremal() {
    for (var i = 0, len = fellesgjoremal.length; i < len; i++) {
        var fellesnavn = fellesgjoremal[i].beskrivelse;

        $("#fellesGjoremaal").append('<li class="list-group-item ">' + fellesnavn +
            '<input type="checkbox" class="all pull-right"></li>');
    }
}

function hentFellesGjoremalData() {
    $.getJSON("server/gjoremalservice/" + husholdningId, function (data) {
        fellesgjoremal = data;
        console.log(fellesgjoremal);
    });
}
function hentMinegjoremal() {
    /*var etgjoremal ={
     beskrivelse:"Vaske badet"
     }*/
    /*gjoremal.push(etgjoremal)*/
    for (var i = 0, len = minegjoremal.length; i < len; i++) {
        var gjøremålId = minegjoremal[i].gjøremålId;
        var beskrivelse = minegjoremal[i].beskrivelse;
        var frist = minegjoremal[i].frist;
        console.log(minegjoremal);


        $("#mineGjoremaal").append('<li class="list-group-item ">' + '<b>' + beskrivelse + '</b>' + ",  " + frist +
            '<input id="checkboxid'+gjøremålId + '" type="checkbox" class="all pull-right"></li>');
    }
}



$(document).ready(function () {
    hentFellesGjoremalData();
    hentMinegjoremal();
    setTimeout(function () {
        hentFellesGjoremal();
    }, 300);

    $("body").on("click", "#refresh", function () {
        for (var i = 0, len = minegjoremal.length; i < len; i++) {
            var gjoremal = minegjoremal[i];
            var gjøremålId = minegjoremal[i].gjøremålId;
            console.log(gjøremålId);
            var fullfort = document.getElementById("checkboxid" + gjøremålId).checked;
            console.log(fullfort);
            if(fullfort){
                $.ajax({
                    url: "server/gjoremalservice/fullfort",
                    type: 'PUT',
                    data: JSON.stringify(gjoremal),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (result) {
                        var data = JSON.parse(result); // gjør string til json-objekt
                        console.log("Data: " + data);
                        if (data) {
                            var index = minBruker.gjøremål.indexOf(gjoremal.gjoremalId);
                            console.log(index);
                            minBruker.gjøremål.splice(index+1,1);
                            //minBruker.gjøremål.push(gjoremal);
                            localStorage.setItem("bruker", JSON.stringify(minBruker));
                            //window.location = "gjoremaal.html";
                            console.log(minBruker.gjøremål);
                            alert("Det gikk bra!");
                        } else {
                            alert("feil!");
                        }
                        window.location = "gjoremaal.html";
                    },
                    error: function () {
                        alert("serverfeil :/");
                        console.log(gjoremal)
                    }
                });
            }


        }
    });

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
            url: "server/gjoremalservice/nyttfellesgoremal",
            type: 'POST',
            data: JSON.stringify(gjoremal),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result); // gjør string til json-objekt
                console.log("Data: " + data);
                if (data) {
                    minBruker.gjøremål.push(gjoremal);
                    localStorage.setItem("bruker", JSON.stringify(minBruker));
                    window.location = "gjoremaal.html";
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
            hhBrukerId: minBruker.brukerId,
            beskrivelse: beskrivelse,
            frist: frist,
            husholdningId: husholdningId
        };

        if (beskrivelse == "") {
            alert("Skriv inn noe");
            return;
        }
        $.ajax({
            url: "server/gjoremalservice/nyttgjoremal",
            type: 'POST',
            data: JSON.stringify(gjoremal),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result); // gjør string til json-objekt
                if (data) {
                    minBruker.gjøremål.push(gjoremal);
                    localStorage.setItem("bruker", JSON.stringify(minBruker));
                    window.location = "gjoremaal.html";
                    alert("Det gikk bra!");
                } else {
                    alert("feil!");
                }
            },
            error: function () {
                alert("serverfeil :/");
            }
        });
        $("#button").on('click', function () {
            alert("Du har valgt å avbryte")
        });
    });
});