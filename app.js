 // function for all the demographic info
function demoInfo(id){
    d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        // console.log(metadata);

        //filter demo info data by id
        var filterResult = metadata.filter(info => info.id.toString() === id)[0];
        var panelBody = d3.select("#sample-metadata");

        //clear the demo info panel before getting new data
        panelBody.html("");

        Object.entries(filterResult).forEach((key)=>{
            panelBody.append("p").text(key[0] + ":" + key[1]);
        });
    });
};

// function for bar and bubble plot
function plots(id) {
    // getting data from the json file
    d3.json("samples.json").then((data)=> {
        //console.log(data)
        
        //filter wfreq value by id
        var wfreq = data.metadata.filter(f => f.id.toString() === id)[0];
        wfreq = wfreq.wfreq;
        // console.log("Washing Freq: " + wfreq);
        
        // filter samples+ values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        //console.log("Samples: " + samples);
  
        // Getting the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        // console.log("top 10: " + samplevalues);
  
        // get only top 10 otu ids for the plot OTU and reversing it. 
        var OTU = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
        var OTU_id = OTU.map(d => "OTU " + d)
  
        // console.log("OTU IDS: " + OTU_id);
  
  
        // get the top 10 labels for the plot and reversing it.
        var labels = samples.otu_labels.slice(0, 10).reverse();
        console.log("labels: " + labels);
  
        // create trace variable for the plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'Red'},
            type:"bar",
            orientation: "h",


        };
  
        // create data variable
        var barData = [trace];
  
        // create layout variable for bar chart
        var barLayout = {
           title: `Top 10 OTU's for subject ${id}`,
          xaxis:{title: "Millions of Bacteria"},
          yaxis:{
            //   tickmode:"linear",
              title: "Top 10 OTU's",
            // Tried to get it to change color on hover, but couldn't make it work
            //  hovermode: {color: "blue"}
           },
        
       };
        // create the bar plot
        Plotly.newPlot("bar", barData, barLayout);
      
        // The bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // set the layout for the bubble plot
        var bubbleLayout = {
            xaxis:{title: "OTU ID"},
            yaxis:{title: "Icidence of OTU"},
            height: 600,
            width: 1200
        };
  
        // creating data variable 
        var bubbleData = [trace1];
  
        // create the bubble plot
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
      });
  }  

function init() {
    //read the data
    d3.json("samples.json").then((data)=> {
        //console.log(data);

        //get the name id to the dropdown menu
        data.names.forEach((name) => {
            d3.select("#selDataset")
            .append("option")
            .text(name)
            .property("value");
            console.log("init",name);
        });
        plots(data.names[0]);
        demoInfo(data.names[0]);
    });
};
init();

//change event function
function optionChanged(id){
    plots(id);
    demoInfo(id);
};
