/**
 *
 * Created by BrageHalse on 12.01.2018.
 *
 */
/**
 *
 */
var husholdning;
var bruker = JSON.parse(localStorage.getItem("bruker"));
var epost = bruker.epost;
var brukerId = bruker.brukerId;
var husholdningId;
var medlemmer;
var handleliste;

/**
 * Metoden under lar deg skrive innlegg i den husholdningen du er medlem av og publiserer slik at
 * andre medlemmer av husholdningen ser det.
 */
$(document).ready(function () {
    $('body').on('contextmenu', 'img', function(e){ return false; });
    husholdningId = bruker.favHusholdning;
    getHandleliste();
    gethhData();
    setTimeout(setupPage, 1000);
    $("#commentBtn").on("click", function () {
        postInnlegg();
    });
    /*$(".skrivNyttInnlegg").on("click", function () {
        skrivNyttInnlegg();
    });*/
    $('body').on("click", "#sendtilhandelknapp", function () {
        window.location = "handlelister.html"
    });
    $('body').on("click", "#sendtilgjoreknapp", function () {
       window.location = "gjoremaal.html"
    });
    $("body").on("click", "#refreshGForside", function () {
        oppdaterGjoremal();
    });


});

/**
 * Funksjonen tar variablene husNavn og nyhetsinnlegg og setter de lik navnet på husstand
 * samt nyhetsinnlegget og henter medlemmet som skrev det.
 */
function setupPage() {
    console.log(husholdning);
    var husNavn = husholdning.navn;
    var nyhetsinnlegg = husholdning.nyhetsinnlegg;
    medlemmer = husholdning.medlemmer;
    var handlelister = husholdning.handlelister;
    localStorage.setItem("husholdningId", husholdningId);

    /**
     * Løkka kaller på funksjonen innleggToHtml og tar inn parameter nyhetsinnlegg
     */
    for (var i = 0, len = nyhetsinnlegg.length; i < len; i++) {
        innleggToHtml(nyhetsinnlegg[i])
    }
    /**
     * Setter variablene lik en bruker og henter id, navn og gjøremål fra database.
     */
    brukernavn = bruker.navn;
    gjoremal = bruker.gjoremal;
    console.log(bruker);

    /**
     * Setter nyheten i tekstfeltet
     */
    $("#nyhet").html(husNavn);

    /**
     * Løkka legger medlemmenes navn i en liste -medlemnavn- som deretter kan ses fra
     * medlemliste i programmet.
     */
    for (var j = 0, leng = medlemmer.length; j < leng; j++) {
        var medlemnavn = medlemmer[j].navn;
        $("#medlemsliste").append('<li class="list-group-item">' + medlemnavn + '</li>');
    }
    /**
     * Løkka legger beskrivelse av gjøremål i en variabel -beskrivelse- og viser dette
     * på skjerm i form av en liste.
     */

    for (var g = 0, length = gjoremal.length; g < length; g++) {
        var beskrivelse = gjoremal[g].beskrivelse;
        $("#gjøremålForside").append('<li class="list-group-item">' + beskrivelse + '<input id="gjoremal'+gjoremal[g].gjoremalId+'" title="toggle all" type="checkbox" class="all pull-right"></li>')
    }

    /**
     * Løkka går gjennom handleliste og går igjennom antall varer. Definerer variabler som legger
     * varer i en liste, som henter ut varenavnet og om varen er kjøpt eller ikke. Dette sjekkes
     * ved en checkbox.
     */
    for (var k = 0, lengt = handleliste.varer.length; k < lengt; k++) {
        var vare = handleliste.varer[k];
        console.log(vare);
        var varenavn = he.encode(vare.varenavn);
        var vareId = vare.vareId;
        var checked = vare.kjøpt;
        var string = "";
        if (checked) {
            string = "checked";
        }
        $("#handlelisteForside").append('<label class="list-group-item vareCheck" value="'+varenavn+'" value2="'+vareId+'"> ' + varenavn + '<input title="toggle all" type="checkbox" value="'+varenavn+'" value2="'+vareId+'" class="all pull-right" ' + string + ' > </label>');
    }
    setTimeout(function () {
        $("#tekst3").append(he.encode(handleliste.tittel));
    }, 150);

}


function getHandleliste(){
    $.getJSON("server/handleliste/forsideListe/"+husholdningId+"/"+brukerId, function(data){
        handleliste=data;
    })
}

/**
 * Funksjonen henter data fra hhservice og metoden husholdningsData.
 */


function gethhData() {
    $.getJSON("server/hhservice/" + husholdningId + "/husholdningData", function (data) {
        husholdning = data;
    });
}

$(document).on('click', '#sendUtlegg', function () {
    sendUtlegg();
});

$(document).on('click', '#utleggForside', function () {
    for(var j = 0; j < medlemmer.length; j++) {
        medlemNavn = medlemmer[j].navn;
        medlemId = medlemmer[j].brukerId;
        if (medlemId != bruker.brukerId) {
            $("#medbetalere").append('<label class="list-group-item">' + medlemNavn + '<input id="' + medlemId + '" title="toggle all" type="checkbox" class="all pull-right"></label>');
        }
    }
});
$(document).on('click', '#utenUtleggForside', function(){
    setVarerKjopt();
});


/**
 * Funksjonen brukes til å poste et innlegg og lar bruker skrive et innlegg til gruppa. Det skal
 * ikke være lov til å publisere et tomt innlegg. Et nyhetsinnlegg har en forfatterid, en tekst,
 * husholdningsid, og en dato. Dette hentes med et ajax-kall til hhservice under metoden nyhets-
 * post.
 */
function postInnlegg() {
    var tekst = $("#comment").val();
    if (tekst == "") {
        return;
    }
    var dato = new Date(Date.now());
    var nyhetsinnlegg = {forfatterId: brukerId, tekst: tekst, husholdningId: husholdningId, dato: dato};
    $.ajax({
        url: "server/hhservice/nyhetspost",
        type: 'POST',
        data: JSON.stringify(nyhetsinnlegg),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            var result = JSON.parse(data);
            console.log(result + " :D");
            if (!result) {
                alert("noe gikk galt :/");
            } else {
                innleggToHtml(nyhetsinnlegg);
                $("#comment").val("");
                document.getElementById("skrivNyttInnlegg").style.display = "none";
            }
        }
    })
}

/**
 * Funksjonen henter innlegget med forfatterId, tekst og diverse datoer/tidspunkter for så å
 * la bruker se det på nettsiden.
 * @param nyhetsinnlegg tar inn teksten skrevet i inputfeltet på forsiden.
 */
function innleggToHtml(nyhetsinnlegg) {
    var fofatterId = nyhetsinnlegg.forfatterId;
    var forfatter = "pls";
    var bilde = "web-res/avatar.png";
    var tekst = he.encode(nyhetsinnlegg.tekst); //XSS prevention

    var nyDate = new Date(nyhetsinnlegg.dato).toISOString().slice(0,10);

    for (var j = 0, length = medlemmer.length; j < length; j++) {
        if (medlemmer[j].brukerId == fofatterId) {
            forfatter = medlemmer[j].navn;
            if (medlemmer[j].profilbilde!=null){
                bilde = medlemmer[j].profilbilde;
            }
        }
    }
    $(".innleggsliste").prepend('<li class ="innlegg"><div class="media-left"><img src="'+bilde+'" class="media-object" style="width:45px"></div><div' +
        ' class="media-body"><h4 class="media-heading">' + forfatter + '<small><i> ' + nyDate + '</i></small></h4><p>' + tekst + '</p></div></li>');

    setTimeout(function () {


    var list = $(".innleggsliste li");
    var numToShow = 7;
    var button = $("#next");
    var numInList = list.length;
    list.hide();
    if (numInList > numToShow) {
        button.show();
    }
    list.slice(0, numToShow).show();

    button.click(function () {
        console.log("lll");
        var showing = list.filter(':visible').length;
        list.slice(showing - 1, showing + numToShow).fadeIn();
        var nowShowing = list.filter(':visible').length;
        if (nowShowing >= numInList) {
            button.hide();
        }
    });
    },0);
}

/**
 * Funksjonen kalles når bruker trykker på knappen om å publisere innlegg.
 */
/*function skrivNyttInnlegg() {
    var x = document.getElementById("skrivNyttInnlegg").style.display;
    if (x === "none") {
        document.getElementById("skrivNyttInnlegg").style.display = "";
    } else {
        document.getElementById("skrivNyttInnlegg").style.display = "none";
    }
}*/
/**
 * Oppdaterer gjøremål dersom bruker krysser av en avkrysningsboks.
 */

function oppdaterGjoremal() {
    var ffListe = [];
    var minegjoremal = bruker.gjoremal;
    for (var i = 0, len = minegjoremal.length; i < len; i++) {
        var gjoremal = minegjoremal[i];
        var gjoremalId = minegjoremal[i].gjoremalId;
        var fullfort = document.getElementById("gjoremal" + gjoremalId).checked;
        console.log(fullfort);
        if (fullfort) {
            ffListe.push(i);
        }
        console.log(ffListe);
    }
    for (var j = ffListe.length - 1; j >= 0; j--) {
        console.log(j);
        gjoremal = minegjoremal[ffListe[j]];
        console.log(gjoremal);
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
        bruker.gjoremal = minegjoremal;
        localStorage.setItem("bruker", JSON.stringify(bruker));
        window.location = "forside.html"
    }, 200)
}

$(document).on('click', '.vareCheck', function () {
    if($('#handlelisteForside input:checked').length > 0){
        $('#handlelisteForside input:checked').each(function () {
            console.log($(this).attr('value'));
            $("#valgteVarer").append('<label for="' + $(this).attr('value') + '" class="list-group-item" name="vare"> ' + $(this).attr('value') + '</label>');
        });
        $('.hiddenButton').show();
    }else{
        $('.hiddenButton').hide();
    }
});

function sendUtlegg() {
    var sum = $("#sum").val();
    var beskrivelse = "Kjøpt: ";
    var vareNavn;
    $('#handlelisteForside input:checked').each(function () {
        vareNavn = $(this).attr('value');
        beskrivelse += vareNavn + ", ";
    });
    beskrivelse = beskrivelse.replace(-1, ".");

    if(sum == "" || beskrivelse == ""){
        alert("pls gi en sum og beskrivelse :)");
        return;
    }
    var pluss = 0;
    if ($("#vereMedPaaUtlegg").is(":checked")){
        pluss = 1;
    }
    var utleggerId = bruker.brukerId;
    var utleggsbetalere = [];
    var delSum = sum/($('#medbetalere input:checked').length+1);
    $('#medbetalere input:checked').each(function () {
        utleggsbetaler = {
            skyldigBrukerId: $(this).attr('id'),
            delSum: delSum
        };
        utleggsbetalere.push(utleggsbetaler)
    });
    //var delSum = sum / (utleggsbetalere.length);

    utlegg = {
        utleggerId: utleggerId,
        sum: sum,
        beskrivelse: beskrivelse,
        utleggsbetalere: utleggsbetalere
    };

    setVarerKjopt();

    $.ajax({
        url: "server/utlegg/nyttutlegg",
        type: 'POST',
        data: JSON.stringify(utlegg),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data =JSON.parse(result);
            if (data){ //Returnerer vel true
                location.reload(true);
                alert(" :D");
            }else{
                alert("D:");
            }
        },
        error: function () {
            alert("RIPinpeace");
        }
    })
}
function setVarerKjopt() {
    var liste=[];
    $('#handlelisteForside input:checked').each(function () {
        var id = $(this).attr('value2');
        var vare ={
            handlelisteId: handleliste.handlelisteId,
            kjoperId: bruker.brukerId,
            datoKjopt: new Date(Date.now()),
            vareId: id
        };
        liste.push(vare);
    });
    $.ajax({
        url: "server/handleliste/kjoptVarer",
        type: 'PUT',
        data: JSON.stringify(liste),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data=JSON.parse(result);
            if(data){
                window.location =" forside.html";
            }else console.log("not ok")
        },
        error: function () {
            alert("Noe gikk galt :(")
        }
    })
}