/**
 * Created by BrageHalse on 10.01.2018.
 */

/**
 * Definerer variabler
 */
var minBruker = JSON.parse(localStorage.getItem("bruker"));
var brukerId = minBruker.brukerId;
var epost = minBruker.epost;
var husholdningId;
var mineHusholdninger;
var medlemmer;
var hhId;
var leggtilMedlemIHusId;
var photo = minBruker.profilbilde;
var navnIHuset2 = [];

/**
 * Henter husholdningene som brukeren er medlem av
 */
function getHusholdninger() {
    $.getJSON("server/hhservice/husholdning/" + brukerId, function (data) {
        mineHusholdninger = data;
    });
}


$(document).ready(function () {
    if(!(!photo || 0 === photo.length)) {
        $('#photo').html('<img style="width:120px; height:120px; top: 30px" src="' + photo + '">');
    }



    $('#submitProfilbilde').click(function(){
        if($('#profilbilde').val()==""){
            return;
        }
        photo = $('#profilbilde').val();
        $('#photo').html('<img style="width: 120px; height:125px; top: 30px;" src="' + photo + '">')
        minBruker.profilbilde = photo;
        localStorage.setItem("bruker", JSON.stringify(minBruker));
    });

    //onload="resizeImg(this,140, 120)"
    //gethhData();

    getHusholdninger();
    setTimeout(function () {
        hentliste();
    }, 1000);

    /**
     * Gjør det mulig å fjerne seg selv fra en husholdning.
     */
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

    $("#navnpåpers").text(minBruker.navn);
    $("#mail").text(minBruker.epost);

    /**
     * Bruker kan bytte passord. Passordene sjekkes om de er like, og det består av mer enn 7 tegn. Dersom kriteriene
     * er oppfylt kan bruker bytte passord.
     */
    $("#lagreendringer").on('click', function () {
        var brukerId = minBruker.brukerId;
        var endrepassord1 = $("#nyttpassord").val();
        var endrepassord2 = $("#bekreftnytt").val();
        if (endrepassord1 == "" || endrepassord2 == "") {
            alert("PLIS SKRIV IN NOKE...")
            return;
        }
        else if(endrepassord1.length<7){
            alert("Vennligst velg et passord med flere enn 7 tegn");
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

    /**
     * Bruker kan endre navn. Tekstfeltet for å fylle inn nytt navn kan ikke være tomt.
     */
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

    /**
     * Bruker kan endre epost ved å trykke endre epost. Kriterier som at tekstfeltet ikke kan være tomt, samt at
     * epostene må være like må være oppfylt.
     */
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

    // til lagNyHusstandModalen
    $('body').on('click', '#leggTilMedlemKnapp2', function () {
        var medlem = {
            epost: $("#nynavnMedlem2").val()
        };
        var epostmed = $("#nynavnMedlem2").val();
        if(epostmed.length !== 0) {
            $("#nynavnMedlem2").val('');
            navnIHuset2.push(medlem);
            $("#fade").show();
            $("#fadedanger").hide();
        } else {
            $("#fadedanger").show();
            $("#fade").hide();
        }
    });

    /**
     * Bruker kan lage ny husstand
     */

    //brukes for å opprette en ny husstand samt registrere den med navn på medlem og navn på husstand i databasen.
    $("body").on("click", "#lagreHusKnapp2", function () {
        var navnHus = $("#nynavnHusstand").val();

        navnIHuset2.push(
            {
                epost: bruker.epost
            });

        var husObj = {
            navn: navnHus,
            medlemmer: navnIHuset2,
            adminId: bruker.brukerId
        };
        console.log(husObj);
        console.log("Prøver å sende husstand");
        if (navnHus === "") {
            alert("Skriv inn noe");
            return;
        }
        $.ajax({
            url: "server/hhservice/husholdning",
            type: 'POST',
            data: JSON.stringify(husObj),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result); // gjør string til json-objekt
                console.log("Data: " + data);
                if (data) {
                    if (bruker.favHusholdning === 0) {
                        bruker.favHusholdning = 0;
                        localStorage.setItem("bruker", JSON.stringify(bruker));
                        navnIHuset2 = 0;
                    }
                } else {
                    alert("feil!");
                }
            },
            error: function () {
                alert("serverfeil :/");
                console.log(husObj)
            }
        });
    });
   /* setTimeout(function () {
        $("a#profilNavn").html('<span class="glyphicon glyphicon-user"></span>' + navn);
    }, 150);*/
});
    /*$("#nyHusProfil").on("click", function () {
        $("#modaldiv").load("lagnyhusstand.html");
    });*/

    $(document).on('click', '.removeButton', function () {
        hhId = ($(this).attr('value'))
    });
/*

    var script = document.createElement('script');
    script.src = "Javascript/nav.js";
    script.async = true;
    document.head.appendChild(script);


*/
/**
 * Bruker kan sette favoritthusholdning
 */
$(document).on('click', '.glyphicon', function () {
    //event.stopPropagation();
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


$(document).on('click', '.removeMedlem', function () {
    var husId = $(this).attr('value');
    var brukerSId = $(this).attr('value2');
    slettMedlem(brukerSId, husId);
});

$(document).on('click', '#nymedlem', function () {
   var epost = $("#medlemepost").val();
   leggTilMedlem(epost, leggtilMedlemIHusId);
});

$(document).on('click', '#opneLeggTilModal', function () {
    leggtilMedlemIHusId = $(this).attr('value');
});

/**
 * Henter liste over husholdninger slik at en skal kunne sette favoritthusholdning på profilside.
 */
function hentliste() {
    for (var k = 0, lengt = mineHusholdninger.length; k < lengt; k++) {
        husholdningId = mineHusholdninger[k].husholdningId;
        var husholdnavn = mineHusholdninger[k].navn;
        var admin = 0;
        var adminLeggTil = "";
        var adminSlett = "";
        var string ="glyphicon-star-empty";
        if (mineHusholdninger[k].husholdningId == minBruker.favHusholdning){
            string = "glyphicon-star";
        }
        for(var z = 0, x = mineHusholdninger[k].medlemmer.length; z<x; z++){
            if (mineHusholdninger[k].medlemmer[z].brukerId == minBruker.brukerId){
                admin = mineHusholdninger[k].medlemmer[z].admin;
            }
        }
        if (admin == 1){
            adminLeggTil = '<button id="opneLeggTilModal" data-target="#leggtilmedlem" data-toggle="modal" class="btn btn-primary pull-right" value="'+husholdningId+'"><span class="glyphicon glyphicon-plus"></span> Legg til medlem</button>';
            adminSlett = '<button style="padding: 2px 6px" class="btn  btn-danger pull-right removeMedlem"' +
                'type="button" value="'+husholdningId+'" value2="'+medlemId+'">Slett</button>';
        }


        // Ny design, med knapper
        $("#husstander").append('<div  class="panel panel-default container-fluid">' +
            '   <div class="panel-heading clearfix row" data-toggle="collapse" data-parent="#husstander" data-target="#' + husholdningId + '" onclick="displayDiv()">' +
            '       <h4 class= "col-md-9 panel-title" style="display: inline">' + husholdnavn + '</h4>' +
            '       <div class="stjerneogforlat pull-right">' +
            '           <span id="star'+husholdningId+'" value="'+husholdningId+'" style="font-size: 1.7em; color: orange; margin: 6px" role="button" class="glyphicon '+string+'"></span>' + " " +
            '           <button data-target="#bekreftmodal" data-toggle="modal"  class="btn  btn-danger pull-right removeButton" type="button" value="'+husholdningId+'">Forlat</button>' +
            '       </div>' +
            '   </div>' +
            '<div id="' + husholdningId + '" class="panel-collapse collapse invisibleDiv row">' +
            '   <div class="panel-body container-fluid">' +
            '       <ul class="list-group" id="hhliste'+husholdningId+'"></ul>' +adminLeggTil +
            '       <div id="list1" class="list-group"></div>' +
            '   </div>' +
            '</div>');


        for (var p = 0, lengt2 = mineHusholdninger[k].medlemmer.length; p < lengt2; p++) {
            var medlemnavn = mineHusholdninger[k].medlemmer[p].navn;
            var medlemId = mineHusholdninger[k].medlemmer[p].brukerId;
            var giAdmin = "";
            if (mineHusholdninger[k].medlemmer[p].admin == 0){
                giAdmin = '<button style="padding: 2px 6px; margin-right: 3px;" class="btn  btn-primary pull-right giAdmin"' +
                    'type="button" value="'+husholdningId+'" value2="'+medlemId+'">Admin</button>'
            }

            $("#hhliste"+husholdningId).append('<li value="'+medlemId+'" class="list-group-item medlemnavnC"> ' + medlemnavn + adminSlett+ giAdmin +'</li>');
        }
    }

}

/**
 * Setter ny favoritthusholdning; den som skal vises på forsiden.
 * @param id: Bruker id som parameter for å sette ny husholdning
 */
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
            minBruker.favHusholdning = nyId;
            localStorage.setItem("bruker", JSON.stringify(minBruker));
        },
        error: function (data) {
            alert("noe gikk galt");
        }
    })
}

/**
 * Kan slette medlem fra en husholdning, men denne rettigheten er det bare admin som kan.
 */
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

function slettMedlem(bid, hid) {
    var idSlett = bid;
    var husIdSlett = hid;
    var hus;
    var t = 0;
    for(t, lengthh = mineHusholdninger.length; t<lengthh; t++){
        if(mineHusholdninger[t].husholdningId == husIdSlett){
            hus = mineHusholdninger[t]
        }
    }
    bruker = {
        brukerId: idSlett,
        favHusholdning: husIdSlett
    };
    $.ajax({
        url: "server/hhservice/slettMedlem",
        type: 'DELETE',
        data: JSON.stringify(bruker),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function () {
            /*for(var m = 0, n = hus.medlemmer.length; m<n; m++) {
                if (hus.medlemmer[m].brukerId == idSlett) {
                    hus.medlemmer.splice(m, 1);
                    mineHusholdninger[t].medlemmer = hus.medlemmer;
                    localStorage.setItem("husholdninger", mineHusholdninger);
                    break;
                }
            }*/
        },
        error: function () {
            console.log(":/");
        }
    });
    window.location = "profil.html";
}

function leggTilMedlem(epost, husId) {
    bruker = {
        favHusholdning: husId,
        epost: epost
    };
    $.ajax({
        url: "server/hhservice/regNyttMedlem",
        type: 'POST',
        data: JSON.stringify(bruker),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            var result = JSON.parse(data);
            if(result){
                alert("bruker registrert");
                console.log("nice");
            }else{
                console.log(": (");
            }
        },
        error: function () {
            alert("noe gikk galt!");
        }
    });
    //window.location = "profil.html";
}

function resizeImg(img, height, width) {
    img.height = height;
    img.width = width;
}

$(document).on('click', '#submitProfilbilde', function () {
    var link = $('#profilbilde').val();
    setProfilbilde(link);
});

function setProfilbilde(link) {
    var id = minBruker.brukerId;
    var bruker = {
        brukerId: id,
        profilbilde: link
    };
    $.ajax({
        url: "server/BrukerService/setProfilbilde",
        type: 'PUT',
        data: JSON.stringify(bruker),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            if(data){
                alert("nice nice");
            }else{
                alert("yikes");
            }
        },
        error: function () {
            alert("feil feil feil feil");
        }
    });
}

$(document).on('click', '.giAdmin', function () {
    bId = $(this).attr('value2');
    hId = $(this).attr('value');
    setAdmin(bId, hId);
    $(this).hide();
});

function setAdmin(bId, hId) {

    var bruker = {
        brukerId: bId,
        favHusholdning: hId
    };
    $.ajax({
        url: "server/hhservice/setAdmin",
        type: 'PUT',
        data: JSON.stringify(bruker),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            if(data){
                alert("nice nice");
            }else{
                alert("yikes");
            }
        },
        error: function () {
            alert("feil feil feil");
        }
    });
}


