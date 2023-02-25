import axios from 'axios';

const countryApisBaseUrl = "http://localhost:8080/countries";

class CountryService {

    getCountries(){
        return axios.get(countryApisBaseUrl);
        // return data;
    }

    searchCountriesBySubRegion(subRegion) {
        return axios.get(countryApisBaseUrl + '/subRegion/' + subRegion);
    }
    searchCountriesByRegion(region) {
        return axios.get(countryApisBaseUrl + '/region/' + region);
    }
    searchCountriesByCapital(capital) {
        return axios.get(countryApisBaseUrl + '/capital/' + capital);
    }
    searchCountriesByLanguage(language) {
        return axios.get(countryApisBaseUrl + '/language/' + language);
    }
    searchCountriesByCurrency(currency) {
        return axios.get(countryApisBaseUrl + '/currency/' + currency);
    }
    searchCountriesByName(name) {
        return axios.get(countryApisBaseUrl + '/name/' + name);
    }

    searchCountriesByFullName(name, fullText=true) {
        return axios.get(countryApisBaseUrl + '/name/' + name + "?fullText=" + fullText);
    }
}

export default new CountryService()