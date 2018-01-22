var bruker = JSON.parse(localStorage.getItem("bruker"));
var husholdningId = localStorage.getItem("husholdningId");
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
            'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('nyhetsChart'));
        chart.draw(data, options);
    }

}

function getNyhetsstatistikk(){
    $.getJSON("server/StatistikkService/" + husholdningId + "/nyheter", function (data) {
        innleggsListe = data;
        console.log(innleggsListe);
    });
}
/*

 */
function getGjoremalstatistikk(){
    $.getJSON("server/StatistikkService/" + husholdningId + "/gjoremal", function (data) {
        statistikkListe = data;
        console.log(statistikkListe);
    });
}
function getVarekjopstatistikk(){
    $.getJSON("server/StatistikkService/" + husholdningId + "/varer", function (data) {
        console.log("Data: "+vareListe);
        vareListe = data;
    });
}
