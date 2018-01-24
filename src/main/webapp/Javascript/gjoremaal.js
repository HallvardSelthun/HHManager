/**
 * Definerer variabler
 */
var minBruker = JSON.parse(localStorage.getItem("bruker"));
var bruker;
var utførerId = minBruker.brukerId;
var minegjoremal = minBruker.gjøremål;
var fellesgjoremal;
var husholdningId = localStorage.getItem("husholdningId")

/**
 * Funksjonen kalles når et nytt gjøremål skal opprettes og det skrives et nytt gjøremål inn
 * i tekstboksen fellesGjoremaal.
 */
function hentFellesGjoremal() {
    for (var i = 0, len = fellesgjoremal.length; i < len; i++) {
        var fellesnavn = fellesgjoremal[i].beskrivelse;

        $("#fellesGjoremaal").append('<label class="list-group-item ">' + fellesnavn +
            '<input type="checkbox" class="all pull-right"></label>');
    }
}

/**
 *  Henter felles gjøremål fra gjoremalservice
 */

function hentFellesGjoremalData() {
    $.getJSON("server/gjoremalservice/" + husholdningId, function (data) {
        fellesgjoremal = data;
        console.log(fellesgjoremal);
    });
}

/**
 * Lar deg hente dine egne gjøremål som opprettes med en id, beskrivelse og en frist.
 * Deretter legges den til på gjøremålsiden med en checkbox.
 */
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

        $("#mineGjoremaal").append('<label class="list-group-item ">' + '<b>' + beskrivelse + '</b>' + ",  " + frist +
            '<input id="checkboxid'+gjøremålId + '" type="checkbox" class="all pull-right"></label>');
    }
}

/**
 * Funksjonene kalles i starten av document.ready(). En timeout lar det gå millisekunder før
 * fellesgjøremål kan hentes. Dette fordi minegjøremål hentes fra localstorage og felles hentes fra
 * database.
 */
$(document).ready(function () {
    hentFellesGjoremalData();
    hentMinegjoremal();
    setTimeout(function () {
        hentFellesGjoremal();
    }, 300);

    /**
     * Et klikk på refreshknappen på siden lar deg oppdatere gjøremålene slik at de som er huket
     * av forsvinner
     */

    $("body").on("click", "#refresh", function () {
        for (var i = 0, len = minegjoremal.length; i < len; i++) {
            var gjoremal = minegjoremal[i];
            var gjøremålId = minegjoremal[i].gjøremålId;
            console.log(gjøremålId);
            var fullfort = document.getElementById("checkboxid" + gjøremålId).checked;
            console.log(fullfort);
            if(fullfort) {
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
                            var index = minBruker.gjøremål.indexOf(gjoremal);
                            console.log("Index: " + index);
                            minBruker.gjøremål.splice(index, 1);
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

    /**
     * Lar deg lagre gjøremålet i databasen når det klikkes på knappen. Lagres med en beskrivelse,
     * en utførerId, frist og en husholdningsid for hvilken husholdning det skal vises i.
     */
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
        /**
         * Dersom beskrivelsen av gjøremålet ikke er tomt skal det være et ajax-kall til gjøremål-
         * service under metoden nyttfellesgoremal.
         */
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

    /**
     * Lagrer egne gjøremål på samme måte som felles gjøremål.
     */
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