const introContainer = document.querySelector('.intro');
const loader = introContainer.querySelector('.loader');
const cityTitle = introContainer.querySelector('.intro__city');
const dynamicLine = introContainer.querySelector('.intro__line-reveal')

const PRIMARY_GEOIP_API = 'https://geoip-db.com/json/';

const CITY_BY_IP_API = 'https://ipapi.co/';



const getUserCity = async () => {

    try {
        const primaryResponse = await fetch(PRIMARY_GEOIP_API);
        if (primaryResponse.status === 200) {
            const {city, IPv4} = await primaryResponse.json();
            if (city) {
                return city;
            }
            return findCityByIpAddress(IPv4);
        }
    } catch (e) {
        console.error("Failed to find user city. Reason: " + e)
        throw new Error("Failed to find user city");
    }
}

const findCityByIpAddress = async (ip) => {
    const response = await fetch(`${CITY_BY_IP_API}/${ip}/json`);
    if (response.status === 200) {
        const {city} = await response.json();
        return city;
    }
}

getUserCity()
    .then(city => {
        loader.classList.add('hidden');
        cityTitle.textContent = city;
        dynamicLine.classList.remove('hidden')
    });

