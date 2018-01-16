/**
 * Created by Karol on 14.01.2018.
 */
$(document).ready(function () {
    setTimeout(setupPage,1000);
    gethhData();
    getBrukerData();
    $("#leggTilKnapp").on("click", function () {
        leggTilNyHandleliste();
    });
    $("#leggTilNyGjenstandKnapp").on("click", function () {
        leggTilNyGjenstand();
    });
});

function leggTilNyHandleliste() {
    var handlelisteNavn = $("#handlelisteNavn").val();
    var brukerId = localStorage.getItem("brukerId");
    var husholdningId = localStorage.getItem("husholdningId");
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
                window.location = "handlelister.html";
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
    var nyGjenstandNavn = $("#leggTilNyGjenstand").val();
    var handlelisteNavn = $("#handlelisteNavn").val();
    var handlelisteId;
    
    function getHadlelisteId() {

    }

    var vare = {
        varenavn: nyGjenstandNavn,
        handlelisteId: handlelisteId
    };

    if (nyGjenstandNavn == "") {
        alert("Skriv navnet til gjenstanden!");
        return;
    }


    $.ajax({
        url: "server/handleliste/" + husholdningId + "/",
        type: 'POST',
        data: JSON.stringify(vare),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data = JSON.parse(result);
            if (data) {
                alert("Det gikk bra!");
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

function setupPage() {
    var husholdningId = husholdning.localStorage.getItem("husholdningId");
    var brukerId = bruker.localStorage.getItem("brukerId");



}