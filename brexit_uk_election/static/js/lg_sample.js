function renderSample(objReportBrexit, objReportNatlElec, filterRegion){

	console.log("Render Sample");
	//------------------------ Render Brexit ------------------------------------------------------------------------------
	var arrTrace1 = [];

	objReportBrexit.regional_votes.brexit_replies.forEach(function(breply, indx){

		var xValues = [];
		var yValues = [];
		
		if(filterRegion.region_code == "ALL"){
			xValues = objReportBrexit.regional_votes.region_names;
			yValues = getElectionPercent(objReportBrexit.regional_votes.region_percent, indx);
		}else{
			var constData = objReportBrexit.regional_constituencies.filter(item => item.region_code == filterRegion.region_code)[0];
			xValues = constData.constituency_votes.const_names;
			yValues = getElectionPercent(constData.constituency_votes.const_percent, indx)
		}

		var trace = {
			x: xValues,
			y: yValues,				
			name: breply,
			type: 'bar'
		};

		arrTrace1.push(trace);
	});
			  
	var data1 = arrTrace1;
	
	var layout1 = {barmode: 'stack', title:"BREXIT - " + filterRegion.region_name};
	
	var img_jpg1= d3.select('#elsample_1').select(".img_export");
	Plotly.newPlot('elsample_1_svg', data1, layout1).then(
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
	//d3.select('#elsample_1').select(".plot-container").remove();
  


	//------------------------ Render National Election -------------------------------------------------------------------

	var arrTrace2 = [];

	objReportNatlElec[0].top_parties.parties.forEach(function(party, indx){

		var xValues = [];
		var yValues = [];
		
		if(filterRegion.region_code == "ALL"){
			xValues = objReportNatlElec[0].regional_votes.region_names;
			yValues = getElectionPercent(objReportNatlElec[0].regional_votes.region_percent, indx);
		}else{
			var constData = objReportNatlElec[0].regional_constituencies.filter(item => item.region_code == filterRegion.region_code)[0];
			//console.log(constData);
			xValues = constData.constituency_votes.const_names;
			yValues = getElectionPercent(constData.constituency_votes.const_percent, indx)
		}

		var trace = {
			x: xValues,
			y: yValues,				
			name: party,
			type: 'bar'
		};

		arrTrace2.push(trace);
	});
			  
	var data2 = arrTrace2;
	
	var layout2 = {barmode: 'stack', title:"UK Election Details - " + filterRegion.region_name};
	
	var img_jpg2= d3.select('#elsample_2').select(".img_export");
	Plotly.newPlot('elsample_2_svg', data2, layout2).then(
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
	
	//d3.select('#elsample_2').select(".plot-container").remove();

}