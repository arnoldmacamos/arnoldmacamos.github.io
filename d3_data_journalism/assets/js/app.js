var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Selected Criteria Values
var selCriteriaX = "";
var selCriteriaY = "";

// Import Data
d3.csv("./assets/data/data.csv").then(function(healthData) {

      //Set Default values for selected criterias
      selCriteriaX = "poverty";
      selCriteriaY = "healthcareLow";

      //Render default chart
      RenderChart(selCriteriaX, selCriteriaY, healthData);
    
  }).catch(function(error) {
    console.log(error); 
  });


//Function to render chart according to the selected x and y filter criteria
function RenderChart(strXFilter, strYFilter , healthData){

  //clear svg canvas
  svg.html("");

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Parse Data/Cast as numbers
  // ==============================
  healthData.forEach(function(data) {
    data[strXFilter] = +data[strXFilter];
    data[strYFilter] = +data[strYFilter];
  });

  // Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[strXFilter]) - (d3.min(healthData, d => d[strXFilter])/10), d3.max(healthData, d => d[strXFilter]) + 0.5])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[strYFilter]) - (d3.min(healthData, d => d[strYFilter])/3), d3.max(healthData, d => d[strYFilter]) + 2])
    .range([height, 0]);

  // Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .classed("stateCircle",true)    
    .attr("cx", d => xLinearScale(d[strXFilter]))
    .attr("cy", d => yLinearScale(d[strYFilter]))
    .attr("r", "15")    
    .attr("opacity", ".5")
    .attr("cursor", "pointer");

  var labelsGroup = chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()    
    .append("text")
    .classed("stateText",true)
    .text(d =>d.abbr)    
    .attr("x", d => xLinearScale(d[strXFilter]))
    .attr("y", d => (yLinearScale(d[strYFilter]) + 6))
    .attr("cursor", "pointer");

  // Initialize tool tip
  // ==============================
  var toolTipLabels = {
    healthcareLow: "HealthCare (Low)",
    smokes: "Smokes",
    obesity:"Obesity",
    poverty: "Poverty",
    age: "Age",
    income: "Income"
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
      return (`${d.state}<br\>${toolTipLabels[strYFilter]} : ${d[strYFilter]} <br\> ${toolTipLabels[strXFilter]} : ${d[strXFilter]}`);
    });

  // Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  labelsGroup.on("click", function(data) {
    toolTip.show(data, this);
    }).on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels    
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aTextY")
    .attr("dataCol", "healthcareLow")
    .text("Lacks Healthcare (%)");
  
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aTextY")
    .attr("dataCol", "smokes")
    .text("Smokes (%)");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aTextY")
    .attr("dataCol", "obesity")
    .text("Obese (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aTextX")
    .attr("dataCol", "poverty")
    .text("In Poverty (%)");  
  
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
    .attr("class", "aTextX")
    .attr("dataCol", "age")
    .text("Age (Meridian)");  

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 70})`)
    .attr("class", "aTextX")
    .attr("dataCol", "income")
    .text("Household Income (Meridian)");  
  
  //Set X and Y axis criteria selectability  
  d3.selectAll(".aTextX")
    .classed("inactive",true);
  
  d3.selectAll(".aTextY")
    .classed("inactive",true);
  
  d3.selectAll(`[dataCol = ${strXFilter}]`).classed("inactive",false).classed("active",true);
    
  d3.selectAll(`[dataCol = ${strYFilter}]`).classed("inactive",false).classed("active",true);

  //Add event handler to X-Axis Criteria selection
  d3.selectAll(".aTextX")    
  .on("click", function(d,i){       
      selCriteriaX = d3.select(this).attr("dataCol");
      RenderChart(selCriteriaX, selCriteriaY, healthData);
  });           

  //Add event handler to Y-Axis Criteria selection
  d3.selectAll(".aTextY")
    .on("click", function(d,i){
      selCriteriaY = d3.select(this).attr("dataCol");
      RenderChart(selCriteriaX, selCriteriaY, healthData);
    });
}