

var dataset = d3.json("https://arnoldmacamos.github.io/bellybutton/samples.json").then(function(data){
	//populate dropdown list
	var selDataset = d3.select("#selDataset");

	var arrNames = data.names;
	arrNames.unshift("Please Select");	
	var options = selDataset
	  .selectAll('option')
		.data(arrNames).enter()
		.append('option')
			.text(function (d) { return d; });
			
	return data;
});

function optionChanged(sampleId){
	
	dataset.then(function(data){
		
		var divMetaData = d3.select("#sample-metadata");
		var divBar = d3.select("#bar");
		var divBubble = d3.select("#bubble");
		
		//Clear all Sections
		divMetaData.html("");
		divBar.html("");
		divBubble.html("");
			
		if(sampleId != "Please Select"){
			
			//--- Fill Demographic Info Section ---
			var metaData = data.metadata.filter(metadata => metadata.id == sampleId)[0];
			console.log(metaData);	
			
			Object.entries(metaData).forEach(function(elem){
				divMetaData.append("div").text(`${elem[0]} : ${elem[1]}`);
			});
			
			//--- Fill Bar Chart Section ---	
			//Transform otu_ids and samples values into key value pair
			var samples = data.samples.filter(samples => samples.id == sampleId)[0];
			var arrOtuValues = [];
			samples.otu_ids.forEach(function(elem,index){
				var otuValue = {"otu_id": "OTU " + elem, "otu_label": samples.otu_labels[index],  "sample_value": samples.sample_values[index]};
				arrOtuValues.push(otuValue);
			});		
			console.log(arrOtuValues);
			
			
			//Sort by sample values and get the top 10
			var sortedOtuValues = arrOtuValues.sort((a, b) => b.sample_value - a.sample_value);
			console.log(sortedOtuValues);

			var topTenOtuValues = sortedOtuValues.slice(0, 10);
			topTenOtuValues = topTenOtuValues.sort((a, b) => a.sample_value - b.sample_value);
			console.log(topTenOtuValues);
			
			var trace1 = {
			  type: 'bar',
			  x: topTenOtuValues.map(elem => elem.sample_value ),
			  y: topTenOtuValues.map(elem => elem.otu_id ),
			  text: topTenOtuValues.map(elem => elem.otu_label ),
			  orientation: 'h'
			};
			
			var barData = [trace1];
			
			Plotly.newPlot('bar', barData);
			
			
			//--- Fill Bubble Chart --
			var trace2 = {
			  x: samples.otu_ids,
			  y: samples.sample_values,
			  text: samples.otu_labels,
			  mode: 'markers',
			  marker: {
				color: samples.otu_ids,
				size: samples.sample_values
			  }
			};

			var bubbleData = [trace2];

			var bubbleLayout = {
			  xaxis: { title: "OTU ID"}	,		
			  showlegend: false ,
			  height: 600,
			  width: 1200 
			};

			Plotly.newPlot('bubble', bubbleData, bubbleLayout);		
			
			
			//--- Fill Guage Chart--
			var trace3 = 
			  {
				domain: { x: [0, 1], y: [0, 1] },
				value: metaData.wfreq,
				title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
				type: "indicator",
				mode: "gauge+number",
				gauge: {
				  axis: { range: [null, 9] },
				  steps: [
					{ range: [0, 1], color:"#ffffff" },
					{ range: [1, 2], color:"#e6f2ff" },
					{ range: [2, 3], color:"#cce6ff" },
					{ range: [3, 4], color:"#b3d9ff" },
					{ range: [4, 5], color:"#99ccff" },
					{ range: [5, 6], color:"#80bfff" },
					{ range: [6, 7], color:"#66b3ff" },
					{ range: [7, 8], color:"#4da6ff" },
					{ range: [8, 9], color:"#3399ff" }				
				  ]
				}
			  };

			var gaugeData = [trace3];
			var gaugeLayout = {width: 600, height: 450};
			Plotly.newPlot('gauge', gaugeData, gaugeLayout);
			
		}		
		
	});
}