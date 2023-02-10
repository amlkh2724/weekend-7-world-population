
let countriesButtons = document.querySelector(".countriesButtons");
let continentsButtons = document.querySelector(".continentsButtons");

continentsButtons.addEventListener("click", getContinent);
countriesButtons.addEventListener("click", getCountriesCitiesData);

async function getContinent(e) {
    countriesButtons.innerHTML = "";
    let continentData = await fetch(
        `https://restcountries.com/v3.1/region/${e.target.value}`
    );
    let continentDataApi = await continentData.json();
    console.log(continentDataApi);

    continentDataApi.forEach((countryNames) => {
        let btnOfCountry = document.createElement("button");
        btnOfCountry.classList.add("btnContinent");
        btnOfCountry.innerText = `${countryNames.name.common}`;
        btnOfCountry.value = `${countryNames.name.common}`;
        countriesButtons.append(btnOfCountry);
    });
    let ctx = document.getElementById("myChart").getContext("2d");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: continentDataApi.map(country => country.name.common),
            datasets: [
                {
                    label: "Population (in thousands)",
                    data: continentDataApi.map(country => country.population / 1000),
                },
            ],
        },
        options: {
            responsive: false
        }
    });
}
let citiesNamesArr = [];
let citiesPopulationArr = [];
async function getCountriesCitiesData(e) {
    try {
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
      let data = await response.json();
      citiesNamesArr = [];
      citiesPopulationArr = [];
      if (!response.ok) throw Error("ERROR!!");
      data.data.forEach(cityName => {
        citiesNamesArr.push(cityName.city);
        citiesPopulationArr.push(cityName.populationCounts[0].value);
      });
      console.log(citiesPopulationArr);
      console.log(citiesNamesArr);
      let ctx = document.getElementById("myChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: citiesNamesArr,
          datasets: [
            {
              label: "Population (in thousands)",
              data: citiesPopulationArr.map(population => population / 1000),
              backgroundColor: "#3e95cd",
              borderColor: "#3e95cd"
            }
          ]
        },
        options: {
          responsive: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: function(value) {
                    return value + "k";
                  }
                }
              }
            ]
          },
          title: {
            display: true,
            text: `Population of Cities in ${e.target.innerText}`,
            fontSize: 50
          }
        }
      });
    } catch (error) {
      console.log(error);
      alert(`No cities data available for ${e.target.innerText}`);
    }
  }
