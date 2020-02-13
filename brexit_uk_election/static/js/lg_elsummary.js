function renderSummary(objReportBrexit, objReportNatlElec, filterRegion){
    
    console.log("Render Summary");

    //------ Brexit -------------
       var arrValues1 = [];
       var arrLabels1 = ["LEAVE","REMAIN"];

       if(filterRegion.region_code == "ALL"){
            arrValues1.push(objReportBrexit.total_pct_leave);
            arrValues1.push(objReportBrexit.total_pct_remain);
       }else{
            var indx = objReportBrexit.regional_votes.region_codes.findIndex(item => item == filterRegion.region_code);            
            arrValues1 = objReportBrexit.regional_votes.region_percent[indx];           
       }

      var data1 = [{
        values: arrValues1,
        labels: arrLabels1,
        hole: 0.6,       
        rotation: 90,       
        direction: "clockwise",
        type: 'pie'
      }];
      
      var layout1 = {
        height: 350,
        width: 700,
        title: "Brexit Summary - " + filterRegion.region_name
       
      };
      
      var img_jpg1= d3.select('#elsummary_1').select(".img_export");
      Plotly.newPlot('elsummary_1_svg', data1, layout1).then(
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
       // d3.select('#elsummary_1').select(".plot-container").remove();

   //----- UK Election ---------

   var arrValues2 = [];
   var arrLabels2 = objReportNatlElec[0].top_parties.parties;

   //console.log(objReportNatlElec);
   if(filterRegion.region_code == "ALL"){
        arrValues2 = objReportNatlElec[0].top_parties.parties_percent;
        
   }else{
        var indx = objReportNatlElec[0].regional_votes.region_codes.findIndex(item => item == filterRegion.region_code);            
        arrValues2 = objReportNatlElec[0].regional_votes.region_percent[indx];           
   }

  var data2 = [{
    values: arrValues2,
    labels: arrLabels2,
    hole: 0.6,       
    rotation: 90,       
    direction: "clockwise",
    type: 'pie'
  }];
  
  var layout2 = {
    height: 350,
    width: 700 ,
    title:"UK Election Summary - " + filterRegion.region_name
  };
  
  var img_jpg2= d3.select('#elsummary_2').select(".img_export");
  Plotly.newPlot('elsummary_2_svg', data2, layout2).then(
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

    //d3.select('#elsummary_2').select(".plot-container").remove();
    
}