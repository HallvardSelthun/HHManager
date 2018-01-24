var minBruker = JSON.parse(localStorage.getItem("bruker"));

var bruker;
// var utførerId = minBruker.brukerId;
var minegjoremal = minBruker.gjøremål;
var fellesgjoremal;
var husholdningId = localStorage.getItem("husholdningId")
var varselListe;
var husholdning;
var id;

function gethhData() {
    $.getJSON("server/hhservice/" + husholdningId + "/husholdningData", function (data) {
        husholdning = data;
    });
}

$(document).on("click", ".valgtMedlem", function () {
    id = $(this).attr('value');
    console.log(id);
    $("#droppknapp").text($(this).text());
});

function hentMedlemmer() {
    var medlemmer = husholdning.medlemmer;
    for (var j = 0, leng = medlemmer.length; j < leng; j++) {
        var medlemnavn = medlemmer[j].navn;
        var hhBrukerId = medlemmer[j].brukerId;
        $("#medlemmer").append('<li class ="valgtMedlem" id="medlem' + hhBrukerId + '"role="presentation" value="' + hhBrukerId + '"><a  role="menuitem" tabindex="-1" href="#">' + medlemnavn + '</a></li>');
    }
}

function hentFellesGjoremal() {
    for (var i = 0, len = fellesgjoremal.length; i < len; i++) {
        var fellesnavn = fellesgjoremal[i].beskrivelse;
        var frist = fellesgjoremal[i].frist;
        var gjøremålId = fellesgjoremal[i].gjøremålId;

        $("#fellesGjoremaal").append('<li class="list-group-item ">' + '<b>' + fellesnavn + '</b>' +
            ",  " + frist +
            '<input id="checkboxid2' + gjøremålId + '" type="checkbox" class="all pull-right"></li>');
    }
}

function hentFellesGjoremalData() {
    $.getJSON("server/gjoremalservice/" + husholdningId, function (data) {
        fellesgjoremal = data;
        console.log(fellesgjoremal);
    });
}

function hentMinegjoremal() {
    for (var i = 0, len = minegjoremal.length; i < len; i++) {
        var gjøremålId = minegjoremal[i].gjøremålId;
        var beskrivelse = minegjoremal[i].beskrivelse;
        var frist = minegjoremal[i].frist;
        console.log(minegjoremal);

        $("#mineGjoremaal").append('<li class="list-group-item minegjoremalliste" value="' + gjøremålId + '">' + '<b>' + beskrivelse + '</b>' +
            ",  " + frist +
            '<input id="checkboxid' + gjøremålId + '" type="checkbox" class="all pull-right"></li>');
    }
}

$(document).ready(function () {
    console.log("Array ved innlastning:");
    console.log((minBruker.gjøremål));
    gethhData();
    hentFellesGjoremalData();
    hentMinegjoremal();
    setTimeout(function () {
        hentFellesGjoremal();
    }, 300);
    setTimeout(function () {
        hentMedlemmer();
    }, 300);

    $("body").on("click", "#refresh2", function () {
        for (var i = 0, len = fellesgjoremal.length; i < len; i++) {
            var gjoremal = fellesgjoremal[i];
            var gjøremålId = fellesgjoremal[i].gjøremålId;
            console.log(gjøremålId);
            var fullfort = document.getElementById("checkboxid2" + gjøremålId).checked;
            console.log(fullfort);
            if (fullfort) {
                $.ajax({
                    url: "server/gjoremalservice/fullfortfelles",
                    type: 'PUT',
                    data: JSON.stringify(gjoremal),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (result) {
                        var data = JSON.parse(result); // gjør string til json-objekt
                        console.log("Data: " + data);
                        if (data) {
                            var index = fellesgjoremal.indexOf(gjoremal);
                            console.log("Index: " + index);
                            fellesgjoremal.splice(index, 1);
                            localStorage.setItem("bruker", JSON.stringify(minBruker));
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

    $("body").on("click", "#refresh", function () {
        var ffListe = [];
        for (var i = 0, len = minegjoremal.length; i < len; i++) {
            var gjoremal = minegjoremal[i];
            var gjøremålId = minegjoremal[i].gjøremålId;
            var fullfort = document.getElementById("checkboxid" + gjøremålId).checked;
            console.log(fullfort);
            if (fullfort) {
                ffListe.push(i);
            }
            console.log(ffListe);
        }
        for (var j = ffListe.length - 1; j >= 0; j--) {
            console.log(j);
            gjoremal = minegjoremal[ffListe[j]];
            $.ajax({
                url: "server/gjoremalservice/fullfort",
                type: 'PUT',
                data: JSON.stringify(gjoremal),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    var data = JSON.parse(result); // gjør string til json-objekt
                    if (data) {
                        console.log("Gjøremål som slettes:");
                        console.log(gjoremal)
                        alert("Det gikk bra!");

                    } else {
                        alert("feil!");
                    }
                    //window.location = "gjoremaal.html";
                },
                error: function () {
                    alert("serverfeil :/");
                    console.log(gjoremal)
                }
            });
        }
        setTimeout(function () {
            for (var h = ffListe.length - 1; h >= 0; h--) {
                minegjoremal.splice(ffListe[h], 1);
            }
            minBruker.gjøremål = minegjoremal;
            localStorage.setItem("bruker", JSON.stringify(minBruker));

        }, 200)
    });


    $("body").on("click", "#lagreGjoremal", function () {
        var beskrivelse = $("#gjoremalInput").val();
        var utførerId = id;
        var frist = $("#dato").val();
        var husholdningId = localStorage.getItem("husholdningId");

        if (id == "null") {
            id = 0;
        }
        var gjoremal = {
            beskrivelse: beskrivelse,
            hhBrukerId: utførerId,
            frist: frist,
            husholdningId: husholdningId
        };
        if (beskrivelse == "") {
            alert("Skriv inn noe");
            return;
        }
        $.ajax({
            url: "server/gjoremalservice/nyttfellesgjoremal",
            type: 'POST',
            data: JSON.stringify(gjoremal),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result); // gjør string til json-objekt
                console.log("Data: " + data);
                if (data) {
                    window.location = "gjoremaal.html";
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
            husholdningId: parseInt(husholdningId)
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
                console.log(data);
                if (data > 0) {
                    var gjoremal2 = {
                        gjøremålId: data,
                        husholdningId: parseInt(husholdningId),
                        hhBrukerId: minBruker.brukerId,
                        fullført: false,
                        beskrivelse: beskrivelse,
                        frist: frist,
                    };
                    console.log("Gjoremal2" + gjoremal2);
                    minBruker.gjøremål.push(gjoremal2);
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
