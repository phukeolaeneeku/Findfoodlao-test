import React, { useState, useEffect } from "react";
import "./currency.css";
import AdminMenu from "../adminMenu/AdminMenu";

const Currency = () => {
  const [amount, setAmount] = useState(1);
  const [amountKIP, setAmountKIP] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [toCurrencyKIP, setToCurrencyKIP] = useState("LAK");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [exchangeRates, setExchangeRates] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const currenciesKRW = 0;
  const currenciesKIP = 0;

  useEffect(() => {
    // Fetch the list of currencies and exchange rates from an API
    const getCurrencies = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        const uniqueCurrencies = Array.from(
          new Set([data.base, ...Object.keys(data.rates)])
        );
        setCurrencies(uniqueCurrencies);
        setExchangeRate(data.rates[toCurrency]);
        setExchangeRates(data.rates[toCurrencyKIP]);
      } catch (error) {
        console.error("Error fetching the currencies:", error);
      }
    };

    getCurrencies();
  }, []);

  useEffect(() => {
    const getExchangeRate = async () => {
      if (fromCurrency !== toCurrency) {
        try {
          const response = await fetch(
            `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
          );
          const data = await response.json();
          setExchangeRate(data.rates[toCurrency] + currenciesKRW);
        } catch (error) {
          console.error("Error fetching the exchange rate:", error);
        }
      }
    };

    getExchangeRate();
  }, [fromCurrency, toCurrency]);


  useEffect(() => {
    const getExchangeRates = async () => {
      if (fromCurrency !== toCurrencyKIP) {
        try {
          const response = await fetch(
            `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
          );
          const data = await response.json();
          setExchangeRates(data.rates[toCurrencyKIP] + currenciesKIP);
        } catch (error) {
          console.error("Error fetching the exchange rate:", error);
        }
      }
    };

    getExchangeRates();
  }, [fromCurrency, toCurrencyKIP]);

  const convertCurrency = () => {
    return (amount * exchangeRate).toFixed(2);
  };
  const convertCurrencyKIP = () => {
    return (amountKIP * exchangeRates).toFixed(2);
  };

  return (
    <>
      <AdminMenu />
      <div className="container_currency">
        <div className="box_currency">
          <h2>Currency Converter</h2>

          <div className="box_currency_input">
            <input
              className="input_number"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              className="input_number"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <span className="span"> to </span>
            <select
              className="input_number"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="box_currency_input">
            <input
              className="input_number"
              type="number"
              value={amountKIP}
              onChange={(e) => setAmountKIP(e.target.value)}
            />
            <select
              className="input_number"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map((toCurrencyKIP) => (
                <option key={toCurrencyKIP} value={toCurrencyKIP}>
                  {toCurrencyKIP}
                </option>
              ))}
            </select>
            <span className="span"> to </span>
            <select
              className="input_number"
              value={toCurrencyKIP}
              onChange={(e) => setToCurrencyKIP(e.target.value)}
            >
              {currencies.map((toCurrencyKIP) => (
                <option key={toCurrencyKIP} value={toCurrencyKIP}>
                  {toCurrencyKIP}
                </option>
              ))}
            </select>
          </div>

            <div className="container_toCurrency_toCurrencyKIP">
                {fromCurrency} to KRW: USD {amount} = {convertCurrency()} {toCurrency}
            </div>
            <div className="container_toCurrency_toCurrencyKIP">
                {fromCurrency} to KIP: USD {amountKIP} = {convertCurrencyKIP()} {toCurrencyKIP}
            </div>
        </div>
      </div>
    </>
  );
};

export default Currency;
