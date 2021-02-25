function getData(sample) {
    d3.json("samples.json").then((data) => {
      var metaData= data.metadata;
      var resultsarray= metaData.filter(sample => sample.id == sample);
      var result= resultsarray[0]
      var panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
    });
  };

function buildCharts(sample){
    d3.json("samples.json").then(data =>{
        var samples= data.samples;
        var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
        var result= resultsarray[0]
        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        var bubbleLayout = {
            margin: { t: 0 },
            xaxis: { title: "Id's" },
            hovermode: "closest",
            };
      
            var bubbleData = [
            {
              x: ids,
              y: values,
              text: labels,
              mode: "markers",
              marker: {
                color: ids,
                size: values,
                }
            }
          ];

        Plotly.plot("bubble", bubbleData, bubbleLayout);

        var barData =[
            {
              y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
              x:values.slice(0,10).reverse(),
              text:labels.slice(0,10).reverse(),
              type:"bar",
              orientation:"h"
      
            }
          ];
      
          var barLayout = {
            title: "Top 10 Bacteria Found",
            margin: { t: 50, l: 50 }
          };
      
          Plotly.newPlot("bar", barData, barLayout);
        });
      };  

function init(){
    var menuOptions = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
          menuOptions
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    
        
        const displaySample = sampleNames[0];
        buildCharts(displaySample);
        getData(displaySample);
      });
    }
    
    function optionChanged(newSample) {
      buildCharts(newSample);
      getData(newSample);
    };   

init();