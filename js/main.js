// script.js

document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const countryList = document.getElementById('country-list');
    const searchInput = document.getElementById('search');
    const regionFilter = document.getElementById('region-filter');
    const searchIcon = document.querySelector('.search-icon');


    let countries = [];

    // Fetch countries data from REST Countries API
    console.log('Fetching data from API...');
    fetch('https://restcountries.com/v3.1/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched successfully:', data);
            countries = data;
            displayCountries(countries);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            countryList.innerHTML = '<p>Failed to fetch country data. Please try again later.</p>';
        });

    function displayCountries(countries) {
        console.log('Displaying countries:', countries);
        countryList.innerHTML = '';
        countries.forEach(country => {
            const countryElement = document.createElement('div');
            countryElement.classList.add('country');
            countryElement.classList.add('country-element')
                // countryElement.style.backgroundImage = `url(${country.flags.png})`;
            countryElement.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="country-flag">
                <h2>${country.name.common}</h2>
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Region: ${country.region}</p>
                <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
            `;
            countryElement.addEventListener('click', () => {
                showCountryDetails(country);
            });
            countryList.appendChild(countryElement);
        });
    }

    function showCountryDetails(country) {
        const countryDetail = document.createElement('div');
        // countryDetail.classList.add('country-detail', 'flex-column');
        // countryDetail.innerHTML = `
        //     <h2>${country.name.common}</h2>
        //     <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
        //     <p>Population: ${country.population.toLocaleString()}</p>
        //     <p>Region: ${country.region}</p>
        //     <p>Subregion: ${country.subregion}</p>
        //     <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
        //     <p>Border Countries: ${country.borders ? country.borders.join(', ') : 'None'}</p>
        //     <button id="back"><i class="fas fa-arrow-left"></i>Back</button>
        // `;

        countryDetail.classList.add('country-detail', 'flex-row');
        countryDetail.innerHTML = `
            <div class="left-column">
            <button id="back"><i class="fas fa-arrow-left"></i>Back</button>
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
            </div>
            <div class="right-column">
                <h2>${country.name.common}</h2>
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Region: ${country.region}</p>
                <p>Subregion: ${country.subregion}</p>
                <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p>Border Countries: ${country.borders ? country.borders.join(', ') : 'None'}</p>
            </div>
        `;


        countryDetail.querySelector('#back').addEventListener('click', () => {
            countryList.style.display = 'flex';
            countryDetail.remove();
        });
        countryList.style.display = 'none';
        document.body.appendChild(countryDetail);
    }

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const filteredCountries = countries.filter(country =>
            country.name.common.toLowerCase().includes(searchText)
        );
        displayCountries(filteredCountries);
    });

    regionFilter.addEventListener('change', () => {
        const region = regionFilter.value;
        const filteredCountries = region === 'all' ? countries : countries.filter(country => country.region === region);
        displayCountries(filteredCountries);
    });

    // Theme switcher
    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            themeSwitcher.innerHTML = '<i class="fas fa-adjust"></i>Dark mode';
        } else {
            themeSwitcher.innerHTML = '<i class="fas fa-adjust"></i>Light mode';
        }
    });

    // Search box
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            searchIcon.style.opacity = 0;
        } else {
            searchIcon.style.opacity = 1;
        }
    });
});