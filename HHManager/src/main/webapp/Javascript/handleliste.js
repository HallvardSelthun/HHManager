/**
 * Created by Karol on 14.01.2018.
 */
var epost = localStorage.getItem("epost");
var brukerId = localStorage.getItem("brukerId");
var husholdningId = localStorage.getItem("husholdningId");
var husholdning;
var handlelisteNavn = $("#handlelisteNavn").val();


$(document).ready(function () {
    gethhData();
    getBrukerData();
    getHandlelister();
    setTimeout(setupPage,1000);

    $("#leggTilKnapp").on("click", function () {
        leggTilNyHandleliste();
    });
    $("#leggTilNyGjenstandKnapp").on("click", function () {
        leggTilNyGjenstand();
    });
    $("#slettHandleliste").on("click", function () {
        slettHandleliste();
    });
});

function leggTilNyHandleliste() {
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

function slettHandleliste() {
    
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

function getHandlelister() {
    $.getJSON("server/HandlelisteService/" + husholdningId + "/" + brukerId, function (data) {
        handlelister = data;
    });
}

function setupPage() {
    var handlelister = husholdning.handlelister;

    for(var k = 0, lengt = handlelister[0].varer.length; k<lengt; k++){
        var vare = handlelister[0].varer[k];
        var varenavn = vare.varenavn;
        var checked = vare.kjøpt;
        var string = "";
        if (checked){
            string = "checked";
        }
        $("#handlelisterSide").append('<li class="list-group-item "> '+varenavn+'<input title="toggle all" type="checkbox" class="all pull-right" '+string+'> </li>');
    }

}