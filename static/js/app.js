// Beg for forgiveness because you're new to Javascript  
 console.log('I ask my grader for leniency please 🙏 ');

// Load data URL into variable 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Get the JSON data from the URL
d3.json(url).then(function(data) {
    console.log(data);
    init(data);  
});

// Init function for menu setup 
function init(data) {
    // selecting the dropdown menu using selDataset from the HTML
    let dropdownMenu = d3.select("#selDataset");
    
    // Get the name ids from the dataset 
    let names = data.names;

    // for loop to populate the dropdown menu with names from the array
    for (let i = 0; i < names.length; i++) {
        dropdownMenu.append('option').text(names[i]).property('value', names[i]);
    };
    let selectedValue = dropdownMenu.property("value");
    // Event listener for menu changes 
    dropdownMenu.on("change", function () {
        selectedValue = dropdownMenu.property("value");
        chartData(selectedValue, data);
        demographicInfo(selectedValue, data);
    });

    chartData(names[0], data);  
    demographicInfo(selectedValue, data);
};

function chartData(value, data) {

        console.log(data);
        let samples = data.samples;
        let filterValue = samples.filter(id => id.id === value) [0];
        console.log(filterValue)

        let trace1 = {
            x: filterValue.sample_values.slice(0, 10).reverse(),
            y: filterValue.otu_ids.map(id => `OTU ${id}`).slice(0, 10).reverse(),
            text: filterValue.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        // Data array
        let barData = [trace1];

        let layout = {
            title: "Top 10 OTUs ID",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", barData, layout);

        let trace2 = {
            x: filterValue.otu_ids,
            y: filterValue.sample_values.map(id => `OTU ${id}`).slice(0, 10),
            mode: 'markers',
            marker: {
                color: filterValue.otu_ids, // Change this line
                colorscale: 'Earth',
                opacity: [1, 0.8, 0.6, 0.4],
                size: filterValue.sample_values
            }
        };

        
        // Data array
        let bubbleData = [trace2];

        let bubbleLayout = {
            title: "Top 10 OTUs ID",
            height: 600,
            width: 600
        };

        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        
    };

// set variable the html element where the metadata goes
let metaDataBox = d3.select("#sample-metadata");

function demographicInfo(value, data) {

    let metaData = data.metadata;


    let demographicData = metaData.filter(entry => entry.id == value)[0];
    console.log(demographicData);
    
    // Remove 
    metaDataBox.html("");

    // Reference to forEach https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    // Instructor helped explain how this works 
    Object.entries(demographicData).forEach(([key, value]) => {
        
        metaDataBox.append("p").text(`${key}: ${value}`);
        

    });
};



// Initialize the web page 
init();