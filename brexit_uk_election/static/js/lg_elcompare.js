function renderComparison(objReportBrexit, objReportNatlElec, filterRegion){


    console.log("Render Comparison");
	
	

	var arrTrace = [];


    //------------------------  Election Bar -------------------------------------------------------------------
    var xValues1 = [];
    var yValues1 = [];
    
    if(filterRegion.region_code == "ALL"){
        xValues1 = objReportBrexit.regional_votes.region_names; 
        yValues1 = arrOfSum(objReportBrexit.regional_votes.region_percent,1);
    }else{
        var constData = objReportBrexit.regional_constituencies.filter(item => item.region_code == filterRegion.region_code)[0];
        xValues1 = constData.constituency_votes.const_names;
        yValues1 = arrOfSum(constData.constituency_votes.const_percent, 1);
    }

    var traceElection1 = {
        x: xValues1,
        y: yValues1,				
        name: 'Brexit - Leave Votes',
        type: 'bar'
    };    
    
    arrTrace.push(traceElection1);

    //------------------------  Election Bar -------------------------------------------------------------------
    var xValues2 = [];
    var yValues2 = [];
    
    if(filterRegion.region_code == "ALL"){
        xValues2 = objReportNatlElec[0].regional_votes.region_names; 
        yValues2 = arrOfSum(objReportNatlElec[0].regional_votes.region_percent, 3);
    }else{
        var constData = objReportNatlElec[0].regional_constituencies.filter(item => item.region_code == filterRegion.region_code)[0];
        xValues2 = constData.constituency_votes.const_names;
        yValues2 = arrOfSum(constData.constituency_votes.const_percent, 3);
    }

    var traceElection2 = {
        x: xValues2,
        y: yValues2,				
        name: 'Top 3 Parties',
        type: 'bar'
    };
    
    arrTrace.push(traceElection2);
			  
	var data = arrTrace;
	
    var layout = {barmode: 'group',
            title:`Brexit-YES vs Top 3 Parties in UK Election (${filterRegion.region_name})`
        };
    
    var img_jpg1= d3.select('#elcompare_1').select(".img_export");
    Plotly.newPlot('elcompare_1_svg', data, layout).then(
        function(gd)
         {
          Plotly.toImage(gd,{height:600,width:1000})
             .then(
                 function(url)
             {
                 img_jpg1.attr("src", url);
                 return Plotly.toImage(gd,{format:'png',height:600,width:1000});
             }
             )
        });    
     //d3.select('#elcompare_1').select(".plot-container").remove();  

}


function arrOfSum(arrInput, topWhat){
    var arrOutput = []
    arrInput.forEach(function(d){
        var topSum = 0.0;
        for(i =0 ; i<topWhat ; i++){
            topSum = topSum + d[i];
        }
        topSum = topSum * 100;
        arrOutput.push(topSum);
    });

    return arrOutput;
}