
let chartOne;
let chartTwo;
let countriesButtons = document.querySelector(".countriesButtons");
let continentsButtons = document.querySelector(".continentsButtons");
let spinner = document.querySelector(".spinner");

  function randomColorsCharTwo() {
    let colors = [];
    for (let i = 0; i < citiesPopulationArr.length; i++) {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(color);
    }
    return colors;
}
let continentDataApi
function randomColorsChartOne() {
    let colors = [];
    for (let i = 0; i < continentDataApi.length; i++) {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(color);
    }
    return colors;
}
function randomBorderColorsChartOne() {
    let borderColors = [];
    for (let i = 0; i < continentDataApi.length; i++) {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        borderColors.push(color);
    }
    return borderColors;
}

continentsButtons.addEventListener("click", getContinent);
countriesButtons.addEventListener("click", getCountriesCitiesData);
spinner.style.display = "none";

async function getContinent(e) {
    countriesButtons.style.display = "block";
    spinner.style.display = "block";

    // Clears the previous chart instance
    if (chartTwo) chartTwo.destroy();
    if (chartOne) chartOne.destroy()
    
    countriesButtons.innerHTML = "";
    let continentData = await fetch(
        `https://restcountries.com/v3.1/region/${e.target.value}`
    );
     continentDataApi = await continentData.json();
    console.log(continentDataApi);

    continentDataApi.forEach((countryNames) => {
        let btnOfCountry = document.createElement("button");
        btnOfCountry.classList.add("btnContinent");
        btnOfCountry.innerText = `${countryNames.name.common}`;
        btnOfCountry.value = `${countryNames.name.common}`;
        countriesButtons.append(btnOfCountry);
    });
    let ctx = document.getElementById("myChart").getContext("2d");

    chartOne = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: continentDataApi.map(country => country.name.common),
            datasets: [
                {
                    label: "Population (in thousands)",
                    data: continentDataApi.map(country => country.population / 1000),
                    backgroundColor: randomColorsChartOne(),
                    borderColor: randomBorderColorsChartOne(),
                    borderWidth: 2
                  
                },
            ],
        },
        options: {
            beginAtZero: true,

        },

    });
    spinner.style.display = "none";
}

let citiesNamesArr = [];
let citiesPopulationArr = [];

async function getCountriesCitiesData(e) {
    // Show the spinner
    let spinner = document.querySelector(".spinner");
    spinner.style.display = "block";

    try {
        // Hides the country buttons
        countriesButtons.style.display = "none";

        // Clears the previous chart instance
        if (chartTwo) chartTwo.destroy();
        if (chartOne) {
            chartOne.destroy()
        }

        // Makes a fetch request to the API
        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    country: `${e.target.innerText}`
                })
            }
        );

        // Converts the response to JSON format
        let data = await response.json();

        // Empties the arrays for the cities names and populations
        citiesNamesArr = [];
        citiesPopulationArr = [];

        // Throws an error if the response is not ok or if no cities were found
        if (!response.ok || data.data.length === 0) throw Error("No cities found for the selected country");

        // Loops through the data and pushes the city names and populations to the arrays
        data.data.forEach(cityName => {
            citiesNamesArr.push(cityName.city);
            citiesPopulationArr.push(cityName.populationCounts[0].value);
        });

        // Gets the context of the chart
        let ctx = document.getElementById("myChart").getContext("2d");
        // Creates a new chart
        chartTwo = new Chart(ctx, {
            type: "bar",
            data: {
                labels: citiesNamesArr,
                datasets: [
                    {
                        label: "Population (in thousands)",
                        data: citiesPopulationArr.map(population => population / 1000),
                        backgroundColor: randomColorsCharTwo(),
                        
                        borderColor: randomColorsCharTwo(),
                        borderWidth: 5
                    }
                ]
            },
           

            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                title: {
                    display: true,
                    text: `Population of Cities in ${e.target.innerText}`,
                    fontSize: 20
                }
            }
        });
    
        // Hide the spinner
        spinner.style.display = "none";

    } catch (error) {
        console.error("Error:", error);
        // Hide the spinner
        spinner.style.display = "none";

        // Show an error message
        // alert(error);
    }
}





