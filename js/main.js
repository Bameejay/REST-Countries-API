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
                countryDetail.classList.add('country-detail', 'flex-row');
                const currencyName = country.currencies ? country.currencies[Object.keys(country.currencies)[0]].name : 'N/A';
                const countryLanguage = country.languages ? country.languages[Object.keys(country.languages)[0]] : 'N/A';
                countryDetail.innerHTML = `
                    <div class="left-column">
                        <button id="back"><i class="fas fa-arrow-left"></i>Back</button>
                        <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
                    </div>
                    <div class="right-column-container">
                    <div class="right-column">
                        <h2>${country.name.common}</h2>
                        <p><span class="label">Native Name:</span> <span class="content">${country.name.official}</span></p>
                        <p><span class="label">Population:</span> <span class="content">${country.population.toLocaleString()}</span></p>
                        <p><span class="label">Region:</span> <span class="content">${country.region}</span></p>
                        <p><span class="label">Subregion:</span> <span class="content">${country.subregion}</span></p>
                        <p><span class="label">Capital:</span> <span class="content">${country.capital ? country.capital[0] : 'N/A'}</span></p>
                        <div class="border-countries"><p><span class="label">Border Countries:</span> ${
                            country.borders
                                ? country.borders.map(border => `<span class="border-country">${border}</span>`).join(' ')
                                : 'None'
                        }</p></div>
                    </div>
                    <div>
                        <p><span class="label">Top Level Domain:</span> <span class="content">${country.tld[0]}</span></p>
                        <p><span class="label">Currencies:</span> <span class="content">${currencyName}</span></p>
                        <p><span class="label">Languages:</span> <span class="content">${countryLanguage}</span></p>
                    </div>
                    </div>
                `;
            
                // Hide elements when showing country details
                countryList.style.display = 'none';
                searchInput.style.display = 'none';
                regionFilter.style.display = 'none';
                searchIcon.style.display = 'none';
            
                // Show elements when back button is clicked
                countryDetail.querySelector('#back').addEventListener('click', () => {
                    countryList.style.display = 'flex';
                    searchInput.style.display = 'block';
                    regionFilter.style.display = 'block';
                    searchIcon.style.display = 'block';
                    countryDetail.remove();
                });
            
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