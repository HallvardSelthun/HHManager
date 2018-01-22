var minBruker = JSON.parse(localStorage.getItem("bruker"));
var bruker;
var utførerId = minBruker.brukerId;
var minegjoremal = minBruker.gjøremål;
var fellesgjoremal;
var husholdningId = localStorage.getItem("husholdningId")


function hentFellesGjoremal() {
    for(var i = 0, len = fellesgjoremal.length; i<len; i++){
        var fellesnavn = fellesgjoremal[i].beskrivelse;

        $("#fellesGjoremaal").append('<li class="list-group-item ">'+ fellesnavn +
            '<input title="toggle all" type="checkbox" class="all pull-right"></li>');
    }

}
function hentFellesGjoremalData() {
    $.getJSON("server/gjoremal/" + husholdningId, function (data) {
        fellesgjoremal = data;
        console.log(fellesgjoremal);
    });
}
function hentMinegjoremal() {
    /*var etgjoremal ={
        beskrivelse:"Vaske badet"
    }*/
    /*gjoremal.push(etgjoremal)*/
    for (var i = 0,len = minegjoremal.length; i< len; i++){
        var beskrivelse = minegjoremal[i].beskrivelse;
        var frist = minegjoremal[i].frist;
        console.log(minegjoremal);

        $("#mineGjoremaal").append('<li class="list-group-item ">'+ beskrivelse + ",  " + frist +
            '<input title="toggle all" type="checkbox" class="all pull-right"></li>');
    }
}

$(document).ready(function () {
    hentFellesGjoremalData();
    hentMinegjoremal();
    setTimeout(function(){hentFellesGjoremal();},300);

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
                    localStorage.setItem("bruker",JSON.stringify(minBruker));
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
                    localStorage.setItem("bruker",JSON.stringify(minBruker));
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