import './App.css';

import CountryService from "./services/CountryService";
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Modal from 'react-modal';

function App() {

    const [countries, setCountries] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [popupOpen, setPopupOpen] = useState(false);
    const [searchBy, setSearchBy] = useState('Name');
    const [errorMessage, setErrorMessage] = useState('');
    const [countryDetails, setCountryDetails] = useState(null);

    Modal.setAppElement('#root');

    useEffect(() => {
        getAllCountries()
    }, [])

    function onRowClicked(event) {
        setCountryDetails(event.data)
        setPopupOpen(true);
    }

    function handleClosePopup() {
        setPopupOpen(false);
        setCountryDetails(null)
    }


    const getAllCountries = () => {
        CountryService.getCountries()
            .then(resp => setCountries(resp.data))
            .catch(error => console.log(error));
    }

    const currencyFormatter = (params) => {
        if (params.value !== null) {
            let result = Object.keys(params.value)
            let curr = Object.keys(params.value)
            if (params.value[curr] !== undefined) {
                result += "(" + params.value[curr].symbol + ")"
            }
            return result
        }
        return "-"
    }

    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Country Name', field: 'name.common', filter: true, sortable: true},
        {
            field: 'currencies',
            filter: true,
            valueFormatter: currencyFormatter,
        },
        { field: 'capital', filter: true, sortable: true },
        { field: 'continents', filter: true, sortable: true },
        { field: 'region', filter: true, sortable: true },
        { field: 'area', sortable: true},
        { field: 'flag' },
        {
            field: 'maps.googleMaps',
            cellRenderer: params => (
                <a href={params.value} target={"_blank"} >open google maps</a>
            )
        },
        { field: 'population', sortable: true },
        { field: 'tld', filter: true }
    ])

    const validateSearchFilter = (newSearchFilter) => {
        if (newSearchFilter === '') {
            setSearchFilter('')
            getAllCountries()
            return false;
        }
        if (searchFilter === newSearchFilter)
            return false
        setSearchFilter(newSearchFilter)
        return true
    }

    const searchCountriesByFilter = (event) => {
        if (!validateSearchFilter(event.target.value))
            return

        let searchByFunction
        switch (searchBy) {
            case "Name":
                searchByFunction = CountryService.searchCountriesByName
                break
            case "Full Name":
                searchByFunction = CountryService.searchCountriesByFullName
                break
            case "Currency":
                searchByFunction = CountryService.searchCountriesByCurrency
                break
            case "Language":
                searchByFunction = CountryService.searchCountriesByLanguage
                break
            case "Capital":
                searchByFunction = CountryService.searchCountriesByCapital
                break
            case "Region":
                searchByFunction = CountryService.searchCountriesByRegion
                break
            case "Sub-Region":
                searchByFunction = CountryService.searchCountriesBySubRegion
                break
            default:
                return;
        }
        searchByFunction(event.target.value)
            .then((resp) => {
                setErrorMessage('')
                setCountries(resp.data)
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage("No data found for requested filter")
            });
    }

    const options = ['Name', 'Full Name', 'Currency', 'Language', 'Capital', 'Region', 'Sub-Region'];
    const onOptionChangeHandler = (event) => {
        console.log("User Selected Value - ", event.target.value)
        setSearchBy(event.target.value)
    }

    return (
        <div>
            <div style={{ marginTop: "50px", marginBottom: "50px" }}>
                <label  style={{ marginLeft: "100px" }}>Select Sort-By: </label>
                <select onChange={onOptionChangeHandler}  onFocus={() => setErrorMessage('')} style={{ marginLeft: "10px" }} >
                    {options.map((option, index) => {
                        return <option key={index} >
                            {option}
                        </option>
                    })}
                </select>
                <input type="text" placeholder="Filter" onFocus={() => setErrorMessage('')} onBlur={searchCountriesByFilter} style={{ marginLeft: "50px", marginRight: "10px" }}/>
                <label style={{ color: "red", fontSize:"12px" }}>{errorMessage}</label>
            </div>
            { countries.length !== 0 && <div className="ag-theme-alpine" style={{height: 2000, width: 100 + "%" }}>
                <AgGridReact
                    rowData={countries}
                    columnDefs={columnDefs}
                    onRowClicked={onRowClicked}
                />
                <PopupContent
                    contentStyle={{width: '100%'}}
                    isOpen={popupOpen}
                    onClose={handleClosePopup}
                    content="This is the content of the popup"
                />
            </div> }
        </div>
    );

    function PopupContent({ isOpen, onClose, content }) {
        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                contentLabel="Country Details"
            >
                <h2>Country Details</h2>
                <div>
                    { countryDetails !== null &&
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label>Country Name: </label>
                                        <label style={{ fontWeight: 700, marginRight: "200px", height: "100px", display: "inline-grid" }}>{countryDetails.name.common}</label>
                                    </td>
                                    <td>
                                        <label>Official Name: </label>
                                        <label style={{ fontWeight:700, height: "100px", marginRight: "200px", display: "inline-grid" }}>{countryDetails.name.official}</label>
                                    </td>
                                    <td>
                                        <label>Capital: </label>
                                        <label style={{ fontWeight:700, marginRight: "200px", height: "100px", display: "inline-grid"}}>{countryDetails.capital}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Flag: </label>
                                        <label style={{ fontWeight:700, height: "100px", display: "inline-grid" }}>{countryDetails.flag}</label>
                                    </td>
                                    <td>
                                        <label>Region: </label>
                                        <label style={{ fontWeight:700, height: "100px", display: "inline-grid" }}>{countryDetails.region}</label>
                                    </td>
                                    <td>
                                        <label>Sub-Region: </label>
                                        <label style={{ fontWeight:700, height: "100px", display: "inline-grid" }}>{countryDetails.subregion}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Land-Locked: </label>
                                        <label style={{ fontWeight:700, height: "100px", display: "inline-grid" }}>{countryDetails.landlocked ? "Yes" : "No"}</label>
                                    </td>
                                    <td>
                                        <label>Borders: </label>
                                        <label style={{ fontWeight:700, overflowWrap: "anywhere", width: "300px", height: "100px", display: "inline-grid" }}>{
                                                countryDetails.borders != null ? countryDetails.borders.join(",") : "-"
                                        }</label>
                                    </td>
                                    <td>
                                        <label>Continents: </label>
                                        <label style={{ fontWeight:700, overflowWrap: "anywhere", height: "100px", width: "300px", display: "inline-grid" }}>{
                                                countryDetails.continents != null ? countryDetails.continents.join(",") : "-"
                                        }</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Independent: </label>
                                        <label style={{ fontWeight:700, height: "100px", display: "inline-grid" }}>{countryDetails.independent ? "Yes" : "No"}</label>
                                    </td>
                                    <td>
                                        <label>Alt Spellings: </label>
                                        <label style={{ fontWeight:700, overflowWrap: "anywhere", height: "100px", width: "300px", display: "inline-grid" }}>{
                                            countryDetails.altSpellings != null ? countryDetails.altSpellings.join(",") : "-"
                                        }</label>
                                    </td>
                                    <td>
                                        <label>Timezones: </label>
                                        <label style={{ fontWeight:700, overflowWrap: "anywhere", width: "300px", height: "100px", display: "inline-grid" }}>
                                            {countryDetails.timezones != null ? countryDetails.timezones.join(",") : "-"}
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                     }
                </div>
                <button onClick={onClose}>Close</button>
            </Modal>
        );
    }
}

export default App;
