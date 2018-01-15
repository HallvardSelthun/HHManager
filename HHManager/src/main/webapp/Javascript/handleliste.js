/**
 * Created by Karol on 14.01.2018.
 */
$(document).ready(function () {
    $("#leggTilKnapp").on("click", function () {
        leggTilNyHandleliste();
    });
});

function leggTilNyHandleliste() {
    var handlelisteNavn = $("#handlelisteNavn").val();
    var brukerId = localStorage.getItem("brukerId");
    var husholdningId = localStorage.getItem("husholdningId")
    var varer = [];
    var offentlig = 0;
    var isChecked = $('#offentligKnapp').is(':checked');
    if(isChecked){
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
        alert("Skriv et navn til handlelisten!");
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
            if (data){
                //window.location = "handlelister.html";
            }else{
                alert("feil!");
            }
        },
        error: function () {
            alert("serverfeil :/")
        }
    })
}