let countriesButtons = document.querySelector(".countriesButtons");
let continentsButtons = document.querySelector(".continentsButtons");

continentsButtons.addEventListener("click", getContinent);

async function getContinent(e) {
    countriesButtons.innerHTML = "";
    let continentData = await fetch(
        `https://restcountries.com/v3.1/region/${e.target.value}`
    );
    let objContinentData = await continentData.json();
    objContinentData.forEach((oCD) => {
        let btnOfCountry = document.createElement("button");
        btnOfCountry.classList.add("btnContinent");
        btnOfCountry.innerText = `${oCD.name.common}`;
        countriesButtons.append(btnOfCountry);
    });

 
}