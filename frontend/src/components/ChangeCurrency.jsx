import axios from 'axios';
import React, { useState , useEffect } from 'react'
import "../css/ChangeCurrency.css";

function ChangeCurrency({ onChange }) {
    const [exchangeRates, setExchangeRates] = useState({});
    const [defaultCurrency, setDefaultCurrency] = useState("nzd"); //default is  New Zealand Dollar

    useEffect(() => {
        // Load the selected country from local storage
        const country = localStorage.getItem('selectedCountry');

        //  Set the default currency based on the country
        switch (country) {
            case 'AU':
                setDefaultCurrency('aud'); 
                break;
            case 'NZ':
            default:
                setDefaultCurrency('nzd'); 
                break;
        }
    }, []);

    const handleChange = async (e) => {
        const currency = e.target.value;
        const apiUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${defaultCurrency}.json`;
        console.log("API Request URL:", apiUrl);
        setDefaultCurrency(e.target.value);
        try {
            const response = await axios.get(apiUrl);
            onChange(response.data[defaultCurrency][currency], currency.toUpperCase());
        } catch (error) {
            console.error("API request failed:", error);
        }
    }
    return (
        <div className='curr-div'>
            <h4>Change currency</h4>
            <div>
                <select onChange={handleChange} value={defaultCurrency}>
                    <option value="nzd">New Zealand Dollar</option>
                    <option value="usd">United States Dollar</option>
                    <option value="aud">Australian Dollar</option>
                    <option value="cny">Chinese Yuan</option>
                    <option value="jpy">Japanese Yen</option>
                    <option value="isk">Icelandic Krona</option>
                    <option value="kgs">Kyrgyzstani Som</option>
                    <option value="luf">Luxembourg Franc</option>
                    <option value="btc">Bitcoin</option>
                    <option value="gbp">British Pound</option>
                    <option value="eur">Euro</option>
                    <option value="cad">Canadian Dollar</option>
                    <option value="doge">Dogecoin</option>
                    <option value="kpw">North Koren Won</option>
                </select>
            </div>
        </div>
    )
}

export default ChangeCurrency;
