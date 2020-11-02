// APIs
const PRIMARY_GEOIP_API = 'https://geoip-db.com/json/';
const CITY_BY_IP_API = 'https://ipapi.co/';

//DOM elements
const introContainer = document.querySelector('.intro');
const loader = introContainer.querySelector('.loader');
const introTitle = introContainer.querySelector('.intro__title');
const cityTitle = introContainer.querySelector('.intro__city');
const dynamicLine = introContainer.querySelector('.intro__line')


/**
 * Connects to the primary API to retrieve the city,
 * in case it fails to determine the city, IPv4 from the response is used
 * to detect the user city by IP address.
 *
 * @returns {Promise<string>}
 */
const getUserCity = async () => {
    try {
        const primaryResponse = await fetch(PRIMARY_GEOIP_API);
        if (primaryResponse.status === 200) {
            const {city, IPv4} = await primaryResponse.json();
            if (city) {
                return city;
            }
            return getUserCityByIpAddress(IPv4);
        }
    } catch (e) {
        console.error("Failed to find user city. Reason: " + e)
        throw new Error("Failed to find user city");
    }
}

/**
 * Returns the city by IP address.
 *
 * @param ip address of user
 * @returns {Promise<string>}
 */
const getUserCityByIpAddress = async (ip) => {
    const response = await fetch(`${CITY_BY_IP_API}/${ip}/json`);
    if (response.status === 200) {
        const {city} = await response.json();
        if (city) {
            return city;
        }
    }
    throw new Error("Failed to find city by ip address");
}

getUserCity()
    .then(city => {
        loader.classList.add('hidden');
        cityTitle.textContent = city;
        dynamicLine.classList.remove('hidden')
    })
    .catch(() => {
        loader.classList.add('hidden');
        dynamicLine.classList.remove('add');
        introTitle.textContent = 'We cannot find your city';
    });

