import './App.css';

import CountryService from "./services/CountryService";
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function App() {

    const [countries, setCountries] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [searchBy, setSearchBy] = useState('Name');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        getAllCountries()
    }, [])

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
        searchCountriesByFilter()
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
                    columnDefs={columnDefs}>
                </AgGridReact>
            </div> }
        </div>
    );
}

export default App;
