var samplesData = "samples.json";


function buildChart(sample){
    d3.json(samplesData).then(function(data) { 
    var samples = data.samples; 
    var array = samples.filter(sampleObject => sampleObject.id == sample)
    var results = array[0];
    var otu_ids = results.otu_ids;
    var otu_labels = results.otu_labels;
    var sample_values = results.sample_values;

    
    // build bar chart
    var trace1 = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };

    // data array
    var data = [trace1];

    // layout
    var layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
    };

    // plot the chart
    Plotly.newPlot("bar", data, layout)



    // build bubble chart 
    var trace2 = {
        x: otu_ids.slice(0, 10).reverse(),
        y: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        mode: 'markers',
        marker: {
            color: otu_ids.slice(0, 10).reverse(),
            size: sample_values.slice(0, 10).reverse(),
        }
    };

    var bubbleData = [trace2];

    var bubbleLayout = {
        title: "Top 10 OTUs",
        xaxis: { title: "OTU Ids" },
        yaxis: { title: "Sample Values" }
    }

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    })
}



function initialization(){
    d3.json(samplesData).then(function(data) {
        var sampleNames = data.names;
        var dropdown = d3.select('#selDataset')
        dropdown.append("option")
                .text("Select ID")
                .property("value", "");
        sampleNames.forEach((sample) => {
            dropdown.append("option")
                    .text(sample)
                    .property("value", sample)
        })
        // buildChart(sampleNames[0])
    })
}

initialization()

function metadata(sample) {
    d3.json(samplesData).then(function(data){
        var panel = d3.select("#sample-metadata")
        var metadata = data.metadata
        var array = metadata.filter(sampleObject => sampleObject.id == sample)
        var result = array[0]
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h5").text(`${key}: ${value}`)
        })
    })
}



function optionChanged(newSample) {
    if (newSample !== "") {
        buildChart(newSample) 
        metadata(newSample)
    } else {
        var barChart = d3.select("#bar")
        barChart.html("");
        var panel = d3.select("#sample-metadata")
        panel.html("");
    }
}









