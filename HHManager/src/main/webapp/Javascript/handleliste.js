/**
 * Created by Karol on 14.01.2018.
 */
$(document).ready(function () {
    setupPage();
    $("#leggTilKnapp").on("click", function () {
        leggTilNyHandleliste();
    });$("#leggTilNyGjenstandKnapp").on("click", function () {
        leggTilNyGjenstand();
    });
});

function leggTilNyHandleliste() {
    var handlelisteNavn = $("#handlelisteNavn").val();
    var brukerId = localStorage.getItem("brukerId");
    var husholdningId = localStorage.getItem("husholdningId")
    var varer = [];
    var offentlig = 0;
    var isChecked = $('#offentligKnapp').is(':checked');
    if (isChecked) {
        offentlig = 1;
    }


    var handlelisteObjekt = {
        tittel: handlelisteNavn,
        skaperId: brukerId,
        husholdningId: husholdningId,
        offentlig: offentlig,
        varer: varer
    };

    if (handlelisteNavn == "") {
        alert("Skriv navnet til handlelisten!");
        return;
    }

    $.ajax({
        url: "server/handleliste",
        type: 'POST',
        data: JSON.stringify(handlelisteObjekt),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            if (data) {
                //window.location = "handlelister.html";
            } else {
                alert("feil!");
            }
        },
        error: function () {
            alert("serverfeil :/")
        }
    })
}

function leggTilNyGjenstand() {
    var nyGjenstandNavn = $("#leggTilNyGjenstand").val()
    var handlelisteNavn;



    if (nyGjenstandNavn == "") {
        alert("Skriv navnet til gjenstanden!");
        return;
    }

    /* SKAL JOBBE MED DET PÅ TIRSDAG

    $.ajax({
        url: "server/handleliste",
        type: 'POST',
        data: JSON.stringify(handlelisteObjekt),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            if (data) {
                //window.location = "handlelister.html";
            } else {
                alert("feil!");
            }
        },
        error: function () {
            alert("serverfeil :/")
        }
    })

    */
}

function setupPage() {

}



/*

    $(document).ready(function () {
        gethhData();
        getBrukerData();
        setTimeout(setupPage,200);
    });

    function setupPage() {


        console.log(husholdning);
        var husholdningId = husholdning.husholdningId;
        var husNavn = husholdning.navn;
        var nyhetsinnlegg = husholdning.nyhetsinnlegg;
        var medlemmer = husholdning.medlemmer;
        var handlelister = husholdning.handlelister;
        localStorage.setItem("husholdningId", husholdningId);

        for (var i = 0, len = nyhetsinnlegg.length; i < len; i++) {
            var fofatterId = nyhetsinnlegg[i].forfatterId;
            var forfatter = "pls";
            var tekst = nyhetsinnlegg[i].tekst;
            var options = {weekday: 'long', year: '2-digit', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'};
            var date = new Date(nyhetsinnlegg[i].dato).toLocaleDateString("en-US", options);
            console.log(date);
            console.log('Medlemmer: '+medlemmer.length);
            for (var j = 0, length = medlemmer.length; j<length; j++){
                if (medlemmer[j].brukerId==fofatterId){
                    forfatter = medlemmer[j].navn;
                }
            }
            console.log(fofatterId);
            $("#innleggsliste").append('<li class ="innlegg"><div class="media-left"> <img src="web-res/avatar.png" class="media-object" style="width:45px"> </div><div class="media-body"><h4 class="media-heading">'+forfatter+'<small><i>'+date+'</i></small></h4><p>'+tekst+'</p></div></li>');
        };

        var brukerId = bruker.brukerId;
        brukernavn = bruker.navn;
        var gjøremål = bruker.gjøremål;
        console.log(bruker);
        console.log(brukernavn);
        localStorage.setItem("brukerId", brukerId);
        $("a#brukernavn").text('' + brukernavn);
        $("#nyhet").html('' + brukernavn);
    }

    function gethhData() {
        $.getJSON("server/hhservice/" + epost + "/husholdningData", function (data) {
            husholdning = data;
        });
    }
    function getBrukerData() {
        $.getJSON("server/BrukerService/" + epost + "/brukerData", function (data) {
            bruker = data;
        });
    }

*/