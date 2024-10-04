import axios from 'axios';
import React, { useState } from 'react'
import "../css/ChangeCurrency.css";

function ChangeCurrency({ onChange }) {
    const handleChange = async (e) => {
        const response = await axios.get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/nzd.json");
        onChange(response.data.nzd[e.target.value], e.target.value.toUpperCase());
    }
    return (
        <div className='curr-div'>
            <h4>Change currency</h4>
            <div>
                <select onChange={handleChange}>
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

export default ChangeCurrency
