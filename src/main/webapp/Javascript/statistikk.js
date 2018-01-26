var bruker = JSON.parse(localStorage.getItem("bruker"));
var husholdningId = localStorage.getItem("husholdningId");
var husholdninger;
var innleggsListe;
var statistikkListe;
var vareListe;


$(document).ready(function(){
    getNyhetsstatistikk();
    getGjoremalstatistikk();
    getVarekjopstatistikk();

    setTimeout(function(){
        nyhetsGraf();
        gjøremålsGraf();
        vareGraf();

        husholdninger= JSON.parse(localStorage.getItem("husholdninger"));
        console.log("husholdningId: "+husholdningId)
        for(var i = 0; i<husholdninger.length;i++){
            var hhId = husholdninger[i].husholdningId;
            var hhNavn =husholdninger[i].navn;
            //console.log(hhNavn);
            if (hhId == husholdningId){
                $("#husholdningsNavn").text(hhNavn);
            }
            $("#hhstatliste").append('<li role="button" class ="hhobjekt" id = "hhobjekt'+hhId+'" value="'+hhId+'">'+hhNavn+'</li>');
        }
    }, 400);
});

$(document).on('click', '.hhobjekt', function () {
    husholdningId= $(this).attr('value');
    $("#husholdningsNavn").text();
    getNyhetsstatistikk();
    getGjoremalstatistikk();
    getVarekjopstatistikk();
    setTimeout(function(){
        nyhetsGraf();
        gjøremålsGraf();
        vareGraf();
        for(var i = 0; i<husholdninger.length;i++) {
            var hhId = husholdninger[i].husholdningId;
            var hhNavn = husholdninger[i].navn;
            //console.log(hhNavn);
            if (hhId == husholdningId) {
                $("#husholdningsNavn").text(hhNavn);
            }
        }
    }, 400);
});

function vareGraf(){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    var newArray =[];
    for(var i =0; i<vareListe.length; i++){
        var miniArray = [vareListe[i][1] , parseInt(vareListe[i][0])];
        newArray.push(miniArray);
    }



    function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Medlem');
        data.addColumn('number', 'Antall varer');
        for(var j = 0; j<newArray.length;j++)
        {
            console.log(newArray[j]);

        }
        data.addRows(
            newArray
        );

        // Set chart options
        var options = {'title':'Antall varer kjøpt per medlem denne måneden',
            'width':400,
            'is3D': true,
            'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('vareChart'));
        chart.draw(data, options);
    }
}
function gjøremålsGraf(){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    var newArray =[];
    for(var i =0; i<statistikkListe.length; i++){
        var miniArray = [statistikkListe[i][1] , parseInt(statistikkListe[i][0])];
        newArray.push(miniArray);
    }



    function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Medlem');
        data.addColumn('number', 'Antall gjøremål');
        for(var j = 0; j<newArray.length;j++)
        {
            console.log(newArray[j]);

        }
        data.addRows(
            newArray
        );



        // Set chart options
        var options = {'title':'Antall gjøremål gjort per medlem denne måneden',
            'width':400,
            'is3D':true,
            'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('gjøremålsChart'));
        chart.draw(data, options);
    }
}
function nyhetsGraf(){
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    var newArray =[];
    for(var i =0; i<innleggsListe.length; i++){
        var miniArray = [innleggsListe[i][1] , parseInt(innleggsListe[i][0])];
        newArray.push(miniArray);
    }



    function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Medlem');
        data.addColumn('number', 'Antall innlegg');
        for(var j = 0; j<newArray.length;j++)
        {
            console.log(newArray[j]);

        }
        data.addRows(
            newArray
        );



        // Set chart options
        var options = {'title':'Antall nyhetsinnlegg per medlem denne måneden',
            'width':400,
            'is3D': true,
            'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('nyhetsChart'));
        chart.draw(data, options);
    }

}

/**
 * Henter statistikk over mest publiserte nyhetsinnlegg per medlem, fra StatistikkServide
 */
function getNyhetsstatistikk(){
    $.getJSON("server/StatistikkService/" + husholdningId + "/nyheter", function (data) {
        innleggsListe = data;
        console.log(innleggsListe);
    });
}

/**
 * Henter statistikk over hvem som har gjort flest gjøremål i husstanden, fra StatistikkService
 */
function getGjoremalstatistikk(){
    $.getJSON("server/StatistikkService/" + husholdningId + "/gjoremal", function (data) {
        statistikkListe = data;
        console.log(statistikkListe);
    });
}

/**
 * Henter statistikk over hvem som har kjøpt flest varer i en husholdning fra StatistikkService.
 */
function getVarekjopstatistikk(){
    $.getJSON("server/StatistikkService/" + husholdningId + "/varer", function (data) {
        vareListe = data;
    });
}
