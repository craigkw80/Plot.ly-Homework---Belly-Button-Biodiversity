



function getPlots(id) {
    //Read in samples.json
        d3.json("static/js/samples.json").then (sampledata =>{
  
          var wfreq;
          var sampleValues;
          var labels;
          var OTU_top;
          var OTU_id;
          var OTU_ids;
          var sampleValuesAll;
          var labelsAll;
          
          console.log(id);
  
          var sams = sampledata.samples
  
          for ( i in sampledata.samples) {
                sample = sampledata.samples[i];
                if (sample.id == id){
                    sampleValues =  sample.sample_values.slice(0,10).reverse();
                    console.log(sampleValues);
                    sampleValuesAll = sample.sample_values;
                    labels =  sample.otu_labels.slice(0,10);
                    console.log(labels);
                    labelsAll = sample.otu_labels;
                    OTU_top = (sample.otu_ids.slice(0, 10)).reverse();
                    console.log(OTU_top);
                    OTU_ids = sample.otu_ids
                    OTU_id = OTU_top.map(d => "OTU " + d);
                    console.log(OTU_id);
                }
            }
          
            console.log(sampledata.metadata);
            for (i in sampledata.metadata){
                metasample = sampledata.metadata[i];
                if (metasample.id == id){
                  wfreq = metasample.wfreq;
                  console.log("WFREQ: " +wfreq);
                }
            }
  
            var trace = {
                x: sampleValues,
                y: OTU_id,
                text: labels,
                marker: {
                color: 'rgba(43,135,166,1)'},
                type:"bar",
                orientation: "h",
            };
            //  data variable
            var data = [trace];
    
            // variable to set plots layout
            var layout = {
                title: "Top 10 OTU",
                yaxis:{
                    tickmode:"linear",
                },
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 30
                }
            };
    
            //  bar plot
        Plotly.newPlot("bar", data, layout);
            // bubble chart
            var trace1 = {
                x: OTU_ids,
                y: sampleValuesAll,
                mode: "markers",
                marker: {
                    size: sampleValuesAll,
                    color: OTU_ids
                },
                text:  labelsAll
    
            };
    
            // layout for the bubble plot
            var layout_2 = {
                xaxis:{title: "OTU ID"},
                height: 600,
                width: 1000
            };
    
            // data variable 
            var data1 = [trace1];
    
        // the bubble plot
        Plotly.newPlot("bubble", data1, layout_2); 
        
        buildGauge(wfreq);
  
        });
    }  
    // function for necessary data
    function getDemoInfo(id) {
    // read in json file for data
        d3.json("static/js/samples.json").then((data)=> {
    // metadata info for demographic panel
            var metadata = data.metadata;
    
            console.log(metadata)
    
          // filter meta data info 
           var result = metadata.filter(meta => meta.id.toString() === id)[0];
          // demographic panel to put data
           var demographicInfo = d3.select("#sample-metadata");
            
         // empty the demographic info panel for new info
           demographicInfo.html("");
    
         // getting demographic data for the id to append the info to the panel
            Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
            });
        });
    }
    // function for the change event
    function optionChanged(id) {
        getPlots(id);
        getDemoInfo(id);
    }
    
    // function for the initial data rendering
    function init() {
        // dropdown menu 
        var dropdown = d3.select("#selDataset");
    
        // read in the data 
        d3.json("static/js/samples.json").then((data)=> {
            console.log(data)
    
            // geting data to the dropdwown menu
            data.names.forEach(function(name) {
                dropdown.append("option").text(name).property("value");
            });
    
            // call the functions to display the data and the plots on page
            getPlots(data.names[0]);
            getDemoInfo(data.names[0]);
        });
    }
    
    init();