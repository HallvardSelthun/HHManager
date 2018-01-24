/**
 * Created by BrageHalse on 10.01.2018.
 */


var minBruker = JSON.parse(localStorage.getItem("bruker"));
var brukerId = minBruker.brukerId;
var epost = minBruker.epost;
var husholdningId;
var mineHusholdninger;
var medlemmer;
var hhId;


function getHusholdninger() {
    $.getJSON("server/hhservice/husholdning/" + brukerId, function (data) {
        mineHusholdninger = data;
        console.log("profil: "+data)
    });
}

$(document).ready(function () {
    //gethhData();

    getHusholdninger();
    setTimeout(function () {
        hentliste();
    }, 1000);

    $("#modal-btn-no").on('click', function () {
        $("#bekreftmodal").modal('hide');
    });


    $("#modal-btn-si").on('click', function () {
        var slettbruker={
            brukerId: brukerId,
            favHusholdning: hhId
        };

        console.log(slettbruker);
        $.ajax({
            url: "server/BrukerService/fjernBrukerFraHusholdning",
            type: 'DELETE',
            data: JSON.stringify(slettbruker),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result);
                console.log(data);
                if(data) {
                    window.location = "profil.html";
                } else {
                    alert("feil");
                }
            },
            error: function () {
                alert("serverfeil :/")
            }
        })
    });

    console.log(minBruker);

    $("#navnpåpers").text(minBruker.navn);
    $("#mail").text(minBruker.epost);


    $("#lagreendringer").on('click', function () {
        var brukerId = minBruker.brukerId;
        var endrepassord1 = $("#nyttpassord").val();
        var endrepassord2 = $("#bekreftnytt").val();
        if (endrepassord1 == "" || endrepassord2 == "") {
            alert("PLIS SKRIV IN NOKE...")
            return;
        }
        else if (endrepassord1 == endrepassord2) {
            var bruker = {
                brukerId: brukerId,
                passord: endrepassord1
            };
            $.ajax({
                url: "server/BrukerService/endrePassord",
                type: 'PUT',
                data: JSON.stringify(bruker),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    var data = JSON.parse(result);
                    window.location = "profil.html";
                    localStorage.setItem("bruker", JSON.stringify(minBruker));
                    alert("Passordet er endret");
                },
                error: function () {
                    alert("Noe gikk galt :(")
                }
            })
        } else {
            alert("Passordet må være likt i begge feltene.")
        }
        $("#lukk").on('click', function () {
            alert("Du har valgt å avbryte")
        });
    });


    $("#endre").on('click', function () {
        var brukerId = minBruker.brukerId;
        var nyttNavn = $("#nyttnavn").val();
        console.log(nyttNavn);
        var bruker = {
            brukerId: brukerId,
            navn: nyttNavn
        };
        if (nyttNavn == "") {
            alert("PLIS SKRIV IN NOKE...")
            return;
        }
        $.ajax({
            url: "server/BrukerService/endreNavn",
            type: 'PUT',
            data: JSON.stringify(bruker),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result);
                $("#navnpåpers").text(nyttNavn);
                minBruker.navn = nyttNavn;
                window.location = "profil.html";
                localStorage.setItem("bruker", JSON.stringify(minBruker));
            },
            error: function () {
                alert("Noe gikk galt :(")
            }
        });
        $("#button").on('click', function () {
            alert("Du har valgt å avbryte")
        });
    });

    function endre() {
    }

    $("#lagre").on('click', function () {
        var brukerId = minBruker.brukerId;
        var nyepost1 = $("#nyepost").val();
        var nyepost2 = $("#nyepost2").val();
        if (nyepost1 == "" || nyepost2 == "") {
            alert("PLIS SKRIV IN NOKE...")
            return;
        }
        if (nyepost1 == nyepost2) {
            var bruker = {
                brukerId: brukerId,
                epost: nyepost1
            };
            $.ajax({
                url: "server/BrukerService/endreEpost",
                type: 'PUT',
                data: JSON.stringify(bruker),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    $("#epost").text(nyepost1);
                    minBruker.epost = nyepost1;
                    var data = JSON.parse(result);
                    window.location = "profil.html";
                    localStorage.setItem("bruker", JSON.stringify(minBruker));
                    alert("Eposten er endret");
                },
                error: function () {
                    alert("Noe gikk galt :(")
                }
            });
        } else {
            alert("Epostene du skrev inn var ikke like.")
        }
        $("#lukkvindu").on('click', function () {
            alert("Du har valgt å avbryte")
        });
    });

    function lagre() {
    }

    $("#nyHusProfil").on("click", function () {
        $("#modaldiv").load("lagnyhusstand.html");
    });

    $(document).on('click', '.removeButton', function () {
        hhId = ($(this).attr('value'))
    });
/*

    var script = document.createElement('script');
    script.src = "Javascript/nav.js";
    script.async = true;
    document.head.appendChild(script);


*/

    $(document).on('click', '.glyphicon', function () {
        event.stopPropagation();
        if ($(this).hasClass('glyphicon-star-empty')){
            $(".glyphicon-star").each(function () {
                $(this).removeClass('glyphicon-star');
                $(this).addClass('glyphicon-star-empty')
            });
            $(this).removeClass('glyphicon-star-empty');
            $(this).addClass('glyphicon-star');
            var id = $(this).attr('value');
            settNyFav(id);
        }
    });
});

function hentliste() {
    console.log(husholdninger);
    for (var k = 0, lengt = mineHusholdninger.length; k < lengt; k++) {
        husholdningId = mineHusholdninger[k].husholdningId;
        var husholdnavn = mineHusholdninger[k].navn;
        var string ="glyphicon-star-empty";
        if (mineHusholdninger[k].husholdningId == minBruker.favHusholdning){
            string = "glyphicon-star";
        }
        console.log(husholdnavn);


        // Ny design, med knapper
        $("#husstander").append('<div  class="panel panel-default container-fluid"><div class="panel-heading clearfix row" ' +
            'data-toggle="collapse" data-parent="#husstander"' +
            ' data-target="#' + husholdningId + '" onclick="displayDiv()">' +
            '<h4 class= "col-md-9 panel-title" style="display: inline; padding: 0px">' + husholdnavn + '</h4>' +
                '<div class="stjerneogforlat pull-right">' +
            '<span id="star'+husholdningId+'" value="'+husholdningId+'" style="font-size: 1.7em;' +
            ' color: orange" role="button" class="glyphicon '+string+'"></span>' + " " +
            '<button data-target="#bekreftmodal" data-toggle="modal"  class="btn  btn-danger pull-right removeButton" ' +
            'type="button" value="'+husholdningId+'">Forlat</button></div></div>' + '<div id="' + husholdningId + '"' +
            ' class="panel-collapse collapse invisibleDiv row"><div class="panel-body container-fluid">' +
            '<ul class="list-group" id="hhliste'+husholdningId+'"></ul>' +
            '<div id="list1" class="list-group"></div></div></div>');


        for (var p = 0, lengt2 = mineHusholdninger[k].medlemmer.length; p < lengt2; p++) {
            var medlemnavn = mineHusholdninger[k].medlemmer[p].navn;
            console.log(medlemnavn);

            $("#hhliste"+husholdningId).append('<li class="list-group-item "> ' + medlemnavn + '</li>');

        }
    }

}

function settNyFav(id) {
    var nyId = parseInt(id);
    var bruker= {
        brukerId: brukerId,
        favHusholdning: nyId
    };
    $.ajax({
        url: "server/BrukerService/favHusholdning",
        type: 'PUT',
        data: JSON.stringify(bruker),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function () {
            console.log("Det gikk bra :)");
            minBruker.favHusholdning = nyId;
            localStorage.setItem("bruker", JSON.stringify(minBruker));
        },
        error: function (data) {
            alert("noe gikk galt");
        }
    })
}

function slettmedlem() {
    event.stopPropagation();
    $("#bekreftmodal").modal();


}

function displayDiv() {
    var x = document.getElementsByClassName("invisibleDiv");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}