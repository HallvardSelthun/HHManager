//Globale variabler
var bruker = JSON.parse(localStorage.getItem("bruker"));
var minBrukerId = bruker.brukerId;
var liveOppgjor = [];
var ferdigeOppgjor = [];
var delSum = 0;

/**
 * Kjører når HTML DOM er loaded
 */
$(document).ready(function () {
    //Kjør JavaScript
    lastInnOppgjor(minBrukerId,0); //0 er ubetalt, 1 er betalt
    //Resten av funksjonene ligger i callbacks for å sørge for riktig rekkefølge.

    if(localStorage.getItem("postUtleggSuccess") == "sant") {
        $("#utleggSuccess").fadeIn(200);
        $("#utleggSuccess").delay(2500).fadeOut(400);
        localStorage.setItem("postUtleggSuccess", false)
    }

    /////////////////////////////////////////////////////
                // On-Event-funksjoner //
    /////////////////////////////////////////////////////

    /**
     * Knappen høret til lag utlegg-modalen
     */
    $("#lagUtlegg").on('click', function () {
        console.log("LAG UTLEGG KLIKKET");
        lagNyttUtlegg();
    });

    /**
     * Knappen høret til lag utlegg-modalen
     */
    $(document).on('click', '.medlemCheck', function(){
        oppdaterBetalere();
    });

    /**
     * Oppdaterer hvem som er med på utlegget clientside og hvor mye de skylder
     */
    $(document).on('click', '#vereMedPaaUtlegg', function () {
        oppdaterBetalere();
    });

    /**
     * Mulig denne ikke skal brukes. Men det gjør at man kan klikke på hele accordions.
     */
    $(".invisibleDiv").on("click", function () {
        displayDiv();
    });

    /**
     * Laster inn ferdige oppgjør fra databasen når historikk-knappen klikkes
     */
    $(document).on("click", "#historikk", function(event){
        lastInnOppgjor(minBrukerId,1);
    });

    /**
     * Funksjonen tar for seg checkboxene til radene inne i oppgjør.
     */
    $(document).on("click", ".checkboxes", function(event){
        var valgtSvarKnapp = $(this).attr('id');
        var utleggId = $(this).attr('data-utleggId');
        var skyldigBrukerId = $(this).attr('data-skyldigBrukerId');
        var substringed = valgtSvarKnapp.match(/\d+/g);

        var oppgjorNrString = $(this).parent().parent().parent().parent().attr('id');
        var oppgjorNr = oppgjorNrString.match(/\d+/g);

        var klikketKnapp = $(this);

        if ($(this).is(':checked')) {
            var ok = checkMotattRad(utleggId,skyldigBrukerId, function () {
                klikketKnapp.parent().parent().parent().fadeOut(500); //Fjern raden
                liveOppgjor[oppgjorNr].antallUtleggsbetalere--;
                if (liveOppgjor[oppgjorNr].antallUtleggsbetalere <= 0) {
                    $("#collapse"+oppgjorNr+"").parent().fadeOut(500); //Fjern hele oppgjøret
                }
            });
        }
    });

    /**
     * Når denne klikkes skal alle utleggsbetalere inni oppgjøret merkes som betalt i databasen
     */
    $(document).on("click", ".hovedCheckbox", function(event){
        var klikketKnapp = $(this);
        var knappNavn = $(this).attr('id');
        var oppgjorNr = knappNavn.match(/\d+/g);

        if ($(this).is(':checked')) {
            lagUtleggsbetalerListe(liveOppgjor, oppgjorNr, function () {
                klikketKnapp.parent().parent().parent().parent().fadeOut(500); //Fjern raden
            });
            //Oppgjoret gjemmes når metoden over er over
        }
    });
});


//////////////////////////////////////////////////////////////
        // Funksjoner som behandler data clientside //
//////////////////////////////////////////////////////////////

function filtrerForXSS(oppgjorArray) {
    for (var i = 0; i < oppgjorArray.length; i++) {
        oppgjorArray[i].navn = he.encode(oppgjorArray[i].navn);
        var j;
        for (j = 0; j < oppgjorArray[i].utleggJegSkylder.length; j++) {
            oppgjorArray[i].utleggJegSkylder[j].navn = he.encode(oppgjorArray[i].utleggJegSkylder[j].navn);
            oppgjorArray[i].utleggJegSkylder[j].beskrivelse = he.encode(oppgjorArray[i].utleggJegSkylder[j].beskrivelse);
        }
        for (j = 0; j < oppgjorArray[i].utleggDenneSkylderMeg.length; j++) {
            oppgjorArray[i].utleggDenneSkylderMeg[j].navn = he.encode(oppgjorArray[i].utleggDenneSkylderMeg[j].navn);
            oppgjorArray[i].utleggDenneSkylderMeg[j].beskrivelse = he.encode(oppgjorArray[i].utleggDenneSkylderMeg[j].beskrivelse);
        }
    }
}

/**
 * Oppdaterer hvem som er med på utlegget clientside og hvor mye de skylder
 */
function oppdaterBetalere() {
    $("#betalere").text("");
    $('.medlemCheck').each(function () {
        var sum = $("#sum").val();
        var pluss = 0;
        if ($("#vereMedPaaUtlegg").is(":checked")){
            pluss = 1;
        }
        delSum = sum/($('#personer input:checked').length+pluss);
        if ($(this).is(":checked")){
            $("#betalere").append('<br> '+$(this).attr('value') +' Sum: '+ delSum);
        }
    })
}

/**
 * Brukes for å holde styr på om det er igjen noen rader inne i et oppgjør.
 * Hvis alle radene i oppgjøret er fjernet skal oppgjøret fjernes.
 * @param oppgjorArray Vanligvis liveArray. Array av Oppgjør.
 */
function tellAntallUtleggsbetalere(oppgjorArray) {
    var utleggsBetalerPerOppgjor = 0;

    for (var i = 0; i < oppgjorArray.length; i++) {
        utleggsBetalerPerOppgjor = 0;
        utleggsBetalerPerOppgjor += oppgjorArray[i].utleggDenneSkylderMeg.length;
        utleggsBetalerPerOppgjor += oppgjorArray[i].utleggJegSkylder.length;
        oppgjorArray[i].antallUtleggsbetalere = utleggsBetalerPerOppgjor;
    }
}

/**
 * Utregner summen som vises clientside og legger inn resultatet i oppgjorArrayet som ble lagt inn.
 * @param oppgjorArray Et array med oppgjorArray.
 */
function utregnOppgjorSum(oppgjorArray) {

    var sum = 0;
    var totalSum = 0;
    var j = 0;
    for (var i = 0; i < oppgjorArray.length; i++) {
        sum = 0;
        for (j = 0; j < oppgjorArray[i].utleggJegSkylder.length; j++) {
            sum = sum - oppgjorArray[i].utleggJegSkylder[j].delSum;
        }
        oppgjorArray[i].skylderSum = Math.round(sum);
        totalSum = sum;
        sum = 0;
        for (j = 0; j < oppgjorArray[i].utleggDenneSkylderMeg.length; j++) {
            sum = sum + oppgjorArray[i].utleggDenneSkylderMeg[j].delSum;
        }

        oppgjorArray[i].skylderMegSum = Math.round(sum);
        totalSum = totalSum + sum;
        if (totalSum > 0) {
            oppgjorArray[i].posNeg = "Pos";
        }
        else {
            oppgjorArray[i].posNeg = "Neg";
        }
        oppgjorArray[i].totalSum = Math.round(totalSum);
    }

    displayOppgjor(oppgjorArray);
}

/**
 * Denne funksjonen brukes i forbindelse med å markere et helt oppgjør som fullført.
 * Det tar inn liveOppgjør gjennom oppgjorArray-parameteren, samt oppgjorNr for å
 * identifisere hvilket oppgjør det er snakk om. Så går man gjennom det relevante
 * oppgjøret og legger alle utleggsbetalerne i en liste. Til sist kjøres checkOppgjørSum med
 * listen som parameter.
 * @param oppgjorArray liveOppgjør
 * @param oppgjorNr indeksen til oppgjøret i den lokale oppgjørArrayen.
 * @param callback Funksjon som kjøres når vi er ferdige.
 */
function lagUtleggsbetalerListe(oppgjorArray, oppgjorNr, callback) {
    var utleggsbetalere = [];
    var i;
    var gammeltObjekt;
    var utleggsbetalerObjekt;

    for (i = 0; i < oppgjorArray[oppgjorNr].utleggJegSkylder.length; i++) {
        gammeltObjekt = oppgjorArray[oppgjorNr].utleggJegSkylder[i];

        utleggsbetalerObjekt = {
            utleggId: gammeltObjekt.utleggId,
            betalt: true,
            skyldigBrukerId: gammeltObjekt.skyldigBrukerId
        };
        utleggsbetalere.push(utleggsbetalerObjekt);
    }

    for (i = 0; i < oppgjorArray[oppgjorNr].utleggDenneSkylderMeg.length; i++) {

        gammeltObjekt = oppgjorArray[oppgjorNr].utleggDenneSkylderMeg[i];

        utleggsbetalerObjekt = {
            utleggId: gammeltObjekt.utleggId,
            betalt: true,
            skyldigBrukerId: gammeltObjekt.skyldigBrukerId
        };
        utleggsbetalere.push(utleggsbetalerObjekt);
    }
    return checkOppgjorSum(utleggsbetalere, callback);
}


/**
 * Legg til indekser på rader og oppgjør så de er raskere å finne senere
 * Gjør også avrunding av delSummer inne i utleggsbetalerobjektene
 * @param callback funksjon som kjøres etter at denne er ferdig. Vanligvis {@link #utregnOppgjorSum utregnOppgjorSum()}.
 * @param oppgjorArray enten liveArray eller ferdigArray
 */
function leggInnRadNr(callback, oppgjorArray) {
    for (var i = 0; i < oppgjorArray.length; i++) {
        oppgjorArray[i].oppgjorNr = i;
        var j;
        for (j = 0; j < oppgjorArray[i].utleggJegSkylder.length; j++) {
            oppgjorArray[i].utleggJegSkylder[j].radNr = j;
            oppgjorArray[i].utleggJegSkylder[j].delSum = Math.round(oppgjorArray[i].utleggJegSkylder[j].delSum);
        }

        for (j = 0; j < oppgjorArray[i].utleggDenneSkylderMeg.length; j++) {
            oppgjorArray[i].utleggDenneSkylderMeg[j].radNr = j;
            oppgjorArray[i].utleggDenneSkylderMeg[j].delSum = Math.round(oppgjorArray[i].utleggDenneSkylderMeg[j].delSum);
        }
    }
    callback(oppgjorArray);
}


//////////////////////////////////////////////////////
                // AJAX-kode //
//////////////////////////////////////////////////////
//
/**
 * Når en rad krysses av i klienten skal den markeres som betalt i databasen
 * @param utleggId Brukes sammen med skyldigBrukerId for å identifisere raden
 * @param skyldigBrukerId Brukes sammen med utleggId for å identifisere raden
 * @param next Callback-funkjon
 */
function checkMotattRad(utleggId, skyldigBrukerId, next) {
    $.ajax({
        url: 'server/utlegg/'+skyldigBrukerId+'/'+utleggId+'',
        type: 'PUT',
        success: function (result) {
            var suksess = result;
            next();
        },
        error: function () {
            alert("Noe gikk galt :(");
            return false;
        }
    });
}

/**
 * Hent inn alle oppgjørene til en viss bruker fra serveren
 * @param brukerId Brukerens unike ID
 * @param betalt Om utlegget er betalt eller ikke. 1 = betalt, 0 = ikke betalt.
 */
function lastInnOppgjor(brukerId, betalt) {
    $.ajax({
        url: "server/utlegg/oppgjor/"+ brukerId+"/"+betalt,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            lastInnBrukere();
            var valgtOppgjorArray = []
            if (betalt === 0) {
                liveOppgjor = result;
                valgtOppgjorArray = liveOppgjor;
                filtrerForXSS(liveOppgjor);
                tellAntallUtleggsbetalere(liveOppgjor);
            }
            else {
                ferdigeOppgjor = result;
                console.log("Ferdigeoppgjor");
                console.log(ferdigeOppgjor);
                filtrerForXSS(ferdigeOppgjor);
                valgtOppgjorArray = ferdigeOppgjor;
            }
            if (!result){
                alert("Noe rart har skjedd i lastInnOppgjor");
            }else{
                console.log(result);
                leggInnRadNr(utregnOppgjorSum, valgtOppgjorArray);
            }
        },
        error: function () {
            alert("Serveren har det røft atm, prøv igjen senere :/");
            lastInnBrukere();
        }
    })
}

/**
 * Merk et helt oppgjør som gjort i databasen. Dvs. at alle utleggsbetalere i oppgjøret
 * blir markert som betalt.
 * @param utleggsbetalere En array av utleggsbetaler-objekt
 * @param next Callback-funksjon
 */
function checkOppgjorSum(utleggsbetalere, next) {
    $.ajax({
        url: 'server/utlegg/utleggsbetaler',
        type: 'PUT',
        data: JSON.stringify(utleggsbetalere),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            suksess = result;
            alert("suksess ny greie: "+suksess);
            next();
        },
        error: function () {
            alert("Noe gikk galt :(");
        }
    });
}

/**
 * Funksjonen følger med på om sum-inputen endres og viser en warning hvis
 * input er mindre enn 0.
 */
$(function() {
    var inputId = "#sum";
    var alertId = "#sumAlert";
    var content = $(inputId).val();
    $(inputId).keyup(function() {
        if ($(inputId).val() != content) {
            content = $(inputId).val();
            if (content <= 0) {$(alertId).fadeIn(200)}
            else {$(alertId).fadeOut(200);}
        }
    });
});

/**
 * Funksjon som sjekker om beskrivelse er satt
 */
$(function() {
    var inputId = he.encode("#utleggBeskrivelse");
    var alertId = he.encode("#beskrivelseAlert");
    var content = $(inputId).val();
    $(inputId).keyup(function() {
        console.log("Inne i tekstfelt"+$(inputId).val());
        if ($(inputId).val() == '') {
            $(alertId).fadeIn(200);
            console.log("FadeIn");
        }
        else {
            console.log("FadeOut");
            $(alertId).fadeOut(200);
        }
    })
});

/**
 * Funksjon som tar inn input fra lag nytt utlegg-modal og sender til databasen
 */
function lagNyttUtlegg() {
    var sum = $("#sum").val();
    var beskrivelse = he.encode($("#utleggBeskrivelse").val());
    var utleggerId = bruker.brukerId;
    var utleggsbetalere = [];
    if(sum == "" || beskrivelse == ""){
        $('#sumbeskrivelseAlert').fadeIn(200);
        $('#sumbeskrivelseAlert').delay(2500).fadeOut(400);
        return;
    }
    if ($('#personer input:checked').length < 1) {
        $('#checkboxAlert').fadeIn(200);
        $('#checkboxAlert').delay(2500).fadeOut(400);
        return;
    }

    $('#personer input:checked').each(function () {
        utleggsbetaler = {
            skyldigBrukerId: $(this).attr('id'),
            delSum: delSum
        };
        utleggsbetalere.push(utleggsbetaler);
    });

    utlegg = {
        utleggerId: utleggerId,
        sum: sum,
        beskrivelse: beskrivelse,
        utleggsbetalere: utleggsbetalere
    };


    $.ajax({
        url: "server/utlegg/nyttutlegg",
        type: 'POST',
        data: JSON.stringify(utlegg),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data =JSON.parse(result);

            if (data){ //Returnerer vel true
                localStorage.setItem("postUtleggSuccess", "sant");
                location.reload(true);
            }else{
                alert("D:");
            }
        },
        error: function () {
            alert("RIPinpeace");
        }
    })
}


/////////////////////////////////////////////////////////
        // Kode for å legge inn dynamisk HTML //
/////////////////////////////////////////////////////////

/**
 * Ta et oppgjorArray og vis alle oppgjørene på siden.
 * Avhengig av om det er et liveOppgjor eller ferdigOppgjor vil
 * forskjellig kode kjøres.
 * @param oppgjorArray
 */
function displayOppgjor(oppgjorArray) {
    if (oppgjorArray === liveOppgjor) {
        // Compile the markup as a named template
        $.template( "oppgjorTemplate", $("#test-oppgjor"));

        $.template("rad-template-deSkylder", $("#rad-template-deSkylder"));
        $.template("rad-template-duSkylder", $("#rad-template-duSkylder"));

        //Append compiled markup
        for (var i = 0; i < oppgjorArray.length; i++) {
            $.tmpl( "oppgjorTemplate", oppgjorArray[i]).appendTo($("#panelGruppe"));

            $.tmpl( "rad-template-duSkylder", oppgjorArray[i].utleggJegSkylder).appendTo($("#radMinus"+i+""));
            $.tmpl( "rad-template-deSkylder", oppgjorArray[i].utleggDenneSkylderMeg).appendTo($("#radPlus"+i+""));
        }
    }
    else {
        displayHistorikk(oppgjorArray);
    }
}

/**
 * Metode som tar inn et array med oppgjørs-objekter og legger dem til i historikk-modalen
 * @param oppgjorArray sender vanligvis inn objektet ferdigArray som inneholder ferdige oppgjør
 */
function displayHistorikk(oppgjorArray) {

    $.template( "historikkTemplate", $("#historikk-oppgjor"));

    $.template("rad-template-deSkylder-historikk", $("#rad-template-deSkylder-historikk"));
    $.template("rad-template-duSkylder-historikk", $("#rad-template-duSkylder-historikk"));

    var startOppgjorNr = liveOppgjor.length;

    if (liveOppgjor.length <= 0) {
        $("#ingenOppgjorAlert").show();
    }
    else {
        $("#ingenOppgjorAlert").hide();
    }

    //Append compiled markup
    for (var i = 0; i < oppgjorArray.length; i++) {
        $.tmpl("historikkTemplate", oppgjorArray[i]).appendTo($("#historikkMain"));
        $.tmpl("rad-template-duSkylder-historikk", oppgjorArray[i].utleggJegSkylder).appendTo($("#radMinusHisto"+i+""));
        console.log("Skal ha lagt inn radminushisto");
        $.tmpl("rad-template-deSkylder-historikk", oppgjorArray[i].utleggDenneSkylderMeg).appendTo($("#radPlusHisto"+i+""));
    }
}

/**
 * Henter inn alle brukerne i favoritthusholdningen og legger dem til
 * i dropdown-menyen inne i lag oppgjør-modalen.
 */
function lastInnBrukere() {
    var husholdninger = JSON.parse(localStorage.getItem("husholdninger"));
    var husId = localStorage.getItem("husholdningId");
    for(var j = 0, lengt = husholdninger.length; j<lengt; j++){
        if (husholdninger[j].husholdningId==husId){
            for(var k =0 , l = husholdninger[j].medlemmer.length; k<l; k++){
                var navn = husholdninger[j].medlemmer[k].navn;
                var id = husholdninger[j].medlemmer[k].brukerId;
                if (id != bruker.brukerId){
                    $("#personer").append('<li class="medlemCheck"><div><label role="button" type="checkbox" class="dropdown-menu-item checkbox skalAlignes" >'+
                        '<input id="'+id+'" type="checkbox" role="button" value="'+navn+'" class="medlemCheck">'+
                        navn +'</label></div></li>');
                }
            }
        }
    }
}

//Skal visst gjære at man kan klikke på hele accordien for at den skal droppe ned
function displayDiv() {
    var x = document.getElementsByClassName("invisibleDiv");
    if ($(".invisibleDiv").css("display") === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}