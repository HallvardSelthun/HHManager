/**
 * Created by BrageHalse on 10.01.2018.
 */

/**
 * Definerer variabler
 */
var minBruker = bruker; //Definert i nav.js
var brukerId = minBruker.brukerId;
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
        if(!minBruker.favHusholdning && mineHusholdninger.length>0){
            settNyFav(mineHusholdninger[0].husholdningId, true);
        }
        hentliste();
    });
}


$(document).ready(function () {

    $('#errorModal').appendTo('body').modal('show');

    if(!(!photo || 0 === photo.length)) {
        $('#photo').html('<img style="width:120px; height:125px; top: 30px" src="' + photo + '">');
    };


    $('#submitProfilbilde').click(function(){
        if($('#profilbilde').val()==""){
            return;
        }
        photo = $('#profilbilde').val();
        $('#photo').html('<img style="width: 120px; height:125px; top: 30px;" src="' + photo + '">')
        minBruker.profilbilde = photo;
        localStorage.setItem("bruker", JSON.stringify(minBruker));
    });

    getHusholdninger();

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

        $.ajax({
            url: "server/BrukerService/fjernBrukerFraHusholdning",
            type: 'DELETE',
            data: JSON.stringify(slettbruker),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                var data = JSON.parse(result);
                if(data) {
                    window.location = "profil.html";
                }
            },
            error: function () {
                $('#errorModal').modal('show');
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
        if(endrepassord1.length<7){
            $('#feilNyttPassord').fadeIn(200);
            setTimeout(function () {
                $('#feilNyttPassord').fadeOut();
            }, 3000);
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
                    localStorage.setItem("bruker", JSON.stringify(minBruker));
                    $('#successPassord').fadeIn(200);
                    setTimeout(function () {
                        $('#successPassord').fadeOut(200);
                        window.location = "profil.html";
                    }, 3000);
                },
                error: function () {
                    $('#errorModal').modal('show');
                }
            })
        } else {
            $('#uliktPassord').fadeIn(200);
            setTimeout(function () {
                $('#uliktPassord').fadeOut(200);
            }, 3000);
        }
    });

    /**
     * Bruker kan endre navn. Tekstfeltet for å fylle inn nytt navn kan ikke være tomt.
     */
    $("#endre").on('click', function () {
        var brukerId = minBruker.brukerId;
        var nyttNavn = $("#nyttnavn").val();
        var bruker = {
            brukerId: brukerId,
            navn: nyttNavn
        };
        if (nyttNavn == "") {
            $('#feilNyttNavn').fadeIn(200);
            setTimeout(function () {
                $('#feilNyttNavn').fadeOut(200)
            },3000);
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
                $('#errorModal').modal('show');
            }
        });
    });

    /**
     * Bruker kan endre epost ved å trykke endre epost. Kriterier som at tekstfeltet ikke kan være tomt, samt at
     * epostene må være like må være oppfylt.
     */
    $("#lagre").on('click', function () {
        var brukerId = minBruker.brukerId;
        var nyepost1 = $("#nyepost").val();
        var nyepost2 = $("#nyepost2").val();
        if (nyepost1 == "" || nyepost2 == "") {
            $('#feilNyEpost').fadeIn(200);
            setTimeout(function () {
                $('#feilNyEpost').fadeOut(200);
            }, 3000);
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
                    localStorage.setItem("bruker", JSON.stringify(minBruker));
                    window.location = "profil.html";
                },
                error: function () {
                    $('#errorModal').modal('show');
                }
            });
        } else {
            $('#ulikNyEpost').fadeIn(200);
            setTimeout(function () {
                $('#ulikNyEpost').fadeOut(200);
            },3000);
        }
    });

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
        if (navnHus === "") {
            $('#feilHusInput').fadeIn(200);
            setTimeout(function () {
                $('#feilHusInput').fadeOut(200);
            },3000);
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
                if (data>0) {
                    if (bruker.favHusholdning === 0) {
                        bruker.favHusholdning = 0;
                        localStorage.setItem("bruker", JSON.stringify(bruker));
                        navnIHuset2 = 0;
                    }
                } else {
                    $('#nyHusError').fadeIn(200);
                    setTimeout(function () {
                        $('#nyHusError').fadeOut(200);
                    }, 3000);
                }
            },
            error: function () {
                $('#errorModal').modal('show');
            }
        });
    });
});

    $(document).on('click', '.removeButton', function () {
        hhId = ($(this).attr('value'))
    });



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
        settNyFav(id, false);
    }
});

$(document).on('click', '#nymedlem', function () {
    var epost = he.encode($("#medlemepost").val());

});

$(document).on('click', '.removeMedlem', function () {
    var husId = $(this).attr('value');
    var brukerSId = $(this).attr('value2');
    slettMedlem(brukerSId, husId);
});

$(document).on('click', '#nymedlem', function () {
   var epost = he.encode($("#medlemepost").val());
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
        var medlemId;
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

        }


        // Ny design, med knapper
        $("#husstander").append('<div  class="panel panel-default container-fluid" ">' +
            '   <div class="panel-heading clearfix row" data-toggle="collapse" data-parent="#husstander" data-target="#husstandAccordion' + husholdningId + '" >' +
            '       <h4 class= "col-md-9 panel-title" style="display: inline">' + husholdnavn + '</h4>' +
            '       <div class="stjerneogforlat pull-right">' +
            '           <span id="star'+husholdningId+'" value="'+husholdningId+'" style="font-size: 1.7em; color: orange; margin: 6px" role="button" class="glyphicon '+string+'"></span>' + " " +
            '           <button data-target="#bekreftmodal" data-toggle="modal"  class="btn  btn-danger pull-right removeButton" type="button" value="'+husholdningId+'">Forlat</button>' +
            '       </div>' +
            '   </div>' +
            '<div id="husstandAccordion' + husholdningId +'" class="panel-collapse collapse row">' +
            '   <div class="panel-body container-fluid">' +
            '       <ul class="list-group" id="hhliste'+husholdningId+'"></ul>' +adminLeggTil +
            '       <div id="list1" class="list-group"></div>' +
            '   </div>' +
            '</div>');


        for (var p = 0, lengt2 = mineHusholdninger[k].medlemmer.length; p < lengt2; p++) {
            var medlemnavn = mineHusholdninger[k].medlemmer[p].navn;
            var medlemId = mineHusholdninger[k].medlemmer[p].brukerId;
            if(admin == 1){
                adminSlett = '<button style="padding: 2px 6px" class="btn  btn-danger pull-right removeMedlem"' +
                    'type="button" value="'+husholdningId+'" value2="'+medlemId+'">Slett</button>';
            }
            var giAdmin = "";
            var erAdmin = "";
            if (mineHusholdninger[k].medlemmer[p].admin == 0 && admin ==1){
                giAdmin = '<button style="padding: 2px 6px; margin-right: 3px;" class="btn  btn-primary pull-right giAdmin"' +
                    'type="button" value="'+husholdningId+'" value2="'+medlemId+'">Admin</button>'
            }
            if (mineHusholdninger[k].medlemmer[p].admin == 1){
                erAdmin = ' <img src="http://icons.iconarchive.com/icons/icons8/windows-8/256/Messaging-Crown-icon.png" height="14px" width="16px">';
            }

            $("#hhliste"+husholdningId).append('<li value="'+medlemId+'" class="list-group-item medlemnavnC"> ' + medlemnavn + erAdmin + adminSlett+ giAdmin +'</li>');
        }
    }
}

/**
 * Setter ny favoritthusholdning; den som skal vises på forsiden.
 * @param id: Bruker id som parameter for å sette ny husholdning
 */
function settNyFav(id, byttSide) {
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
            localStorage.setItem("husholdningId", nyId)
            localStorage.setItem("bruker", JSON.stringify(minBruker));
            $('#errorModal').modal('show');
            if (byttSide) {
                window.location="profil.html";
            }

        },
        error: function (data) {
            $('#errorModal').modal('show');
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
            $('#errorModal').modal('show');
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
                $('#regNyttMedlemS').fadeIn(200);
                setTimeout(function () {
                    $('#regNyttMedlemS').fadeOut(200);
                }, 3000);
            }else{
                $('#regNyttMedlemE').fadeIn(200);
                setTimeout(function () {
                    $('#regNyttMedlemE').fadeOut(200);
                }, 3000);
            }
        },
        error: function () {
            $('#errorModal').modal('show');        }
    });
    window.location = "profil.html";
}

function resizeImg(img, height, width) {
    img.height = height;
    img.width = width;
}

$(document).on('click', '#submitProfilbilde', function () {
    var link = he.encode($('#profilbilde').val());
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
        },
        error: function () {
            $('#errorModal').modal('show');        }
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
        },
        error: function () {
            $('#errorModal').modal('show');
        }
    });
}


