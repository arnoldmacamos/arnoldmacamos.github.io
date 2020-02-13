function renderDetails(objReportBrexit, objReportNatlElec, filterRegion){
    
    console.log("Render Details");
	//------------------------ Render Brexit ------------------------------------------------------------------------------
	var arrTrace1 = [];

	objReportBrexit.regional_votes.brexit_replies.forEach(function(breply, indx){

		var xValues1 = [];
		var yValues1 = [];
		
		if(filterRegion.region_code == "ALL"){
			yValues1 = objReportBrexit.regional_votes.region_names;
			xValues1 = getElectionPercent(objReportBrexit.regional_votes.region_percent, indx);
		}else{
			var constData = objReportBrexit.regional_constituencies.filter(item => item.region_code == filterRegion.region_code)[0];
			yValues1 = constData.constituency_votes.const_names;
			xValues1 = getElectionPercent(constData.constituency_votes.const_percent, indx)
		}

		var trace = {
			x: xValues1,
			y: yValues1,				
			name: breply,
            type: 'bar',
            orientation: 'h'
		};

		arrTrace1.push(trace);
	});
			  
	var data1 = arrTrace1;
	
	var layout1 = {barmode: 'stack'};
	
	Plotly.newPlot('eldetails_1', data1, layout1);


	//------------------------ Render National Election -------------------------------------------------------------------

	var arrTrace2 = [];

	objReportNatlElec[0].top_parties.parties.forEach(function(party, indx){

		var xValues2 = [];
		var yValues2 = [];
		
		if(filterRegion.region_code == "ALL"){
			yValues2 = objReportNatlElec[0].regional_votes.region_names;
			xValues2 = getElectionPercent(objReportNatlElec[0].regional_votes.region_percent, indx);
		}else{
			var constData = objReportNatlElec[0].regional_constituencies.filter(item => item.region_code == filterRegion.region_code)[0];
			
			yValues2 = constData.constituency_votes.const_names;
			xValues2 = getElectionPercent(constData.constituency_votes.const_percent, indx)
		}

		var trace = {
			x: xValues2,
			y: yValues2,				
			name: party,
            type: 'bar',
            orientation: 'h'
		};

		arrTrace2.push(trace);
	});
			  
	var data2 = arrTrace2;
	
	var layout2 = {barmode: 'stack'};
	
	var img_jpg2= d3.select('#eldetails_2').select(".img_export");
	Plotly.newPlot('eldetails_2', data2, layout2).then(
        function(gd)
         {
          Plotly.toImage(gd,{height:600,width:1000})
             .then(
                 function(url)
             {
                 img_jpg2.attr("src", url);
                 return Plotly.toImage(gd,{format:'png',height:600,width:1000});
             }
             )
        });    
	d3.select('#eldetails_2').select(".plot-container").remove();
}