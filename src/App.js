import React, {useEffect, useState, useRef }from "react"
import {FormControl, TextField} from "@material-ui/core";
import axios from 'axios';
import './App.css';


const CurrencyConverter = () => {
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [currencyList1, setCurrencyList1] = useState([]);
  const [currencyList2, setCurrencyList2] = useState([]);
  const [exchangeRate1, setExchangeRate1] = useState(1);
  const [exchangeRate2, setExchangeRate2] = useState(1);
  const [error, setError] = useState("");
  const [fullName1, setFullName1] = useState("Australian Dollar");
  const [fullName2, setFullName2] = useState("Australian Dollar");
  const [fullNameList1, setFullNameList1] = useState([])
  const [fullNameList2, setFullNameList2] = useState([])
  const text1InputRef = useRef();
  const text2InputRef = useRef();
  

  useEffect(() => {
    getRates();
    getSymbols();
  }, []);

  async function getRates() {
    const result = await axios.get(
      "http://data.fixer.io/api/latest?access_key=0f7c8e1fedee5b8a93f74f27e87f7c6c&symbols=AUD,BGN,BTC,BYN,CAD,CHF,CNY,EUR,MDL,RON,RUB,SEK,TRY,UAH,USD"
    );
    setCurrencyList1(result.data.rates);
    setCurrencyList2(result.data.rates);
  }

  async function getSymbols() {
    const symbols = await axios.get(
      "http://data.fixer.io/api/symbols?access_key=0f7c8e1fedee5b8a93f74f27e87f7c6c&symbols=AUD,BGN,BTC,BYN,CAD,CHF,CNY,EUR,MDL,RON,RUB,SEK,TRY,UAH,USD"
    );
    setFullNameList1(symbols.data.symbols);
    setFullNameList2(symbols.data.symbols);
  }

  const convert1 = () => {
    const textPassed1 = text1InputRef.current.value;
    let num = (exchangeRate2 / exchangeRate1) * textPassed1;
    let n = num.toFixed(2);
    setAmount2(n);
  };

  const convert2 = () => {
    const textPassed2 = text2InputRef.current.value;
    let num = (exchangeRate1 / exchangeRate2) * textPassed2;
    let n = num.toFixed(2);
    setAmount1(n);
  };

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] == value);
  }  

  return (
    <div className="Screen">
      <h2> Currency Converter </h2>
      <div>
        <div className="text1"> From: </div>
        <div className="fullName1">
          {fullName1}
        </div>
        <TextField
          className="amount"
          inputRef={text1InputRef}
          placeholder="Enter amount"
          variant="outlined"
          inputProps={{
            maxLength: 6,
          }}
          value={amount1 || ""}
          onChange={(e) => {
            setAmount1(e.target.value);
            const value = e.target.value;
            if (!isNaN(+value) === false) {setError ("Input must be a number!");}
            else setError(" "); convert1();
          }}
          autoComplete="off"
        />
        <FormControl
          variant="outlined"
          className="dropdownMenu"
          onChange={(e) => {
            setExchangeRate1(e.target.value)
            let key = getKeyByValue(currencyList1, e.target.value)
            let trueFullNameList = new Map(Object.entries(fullNameList1))
            setFullName1(trueFullNameList.get(key))
          }}
        >
          <select className="dropdownMenu" native>
            {Object.keys(currencyList1).map((value, index) => (
              <option key={index} value={currencyList1[value]}>
                {value}
              </option>
            ))}
          </select>
        </FormControl>
      </div>
      <div className="text2"> To:  </div>
      <div>
         <div className="fullName2">
         {fullName2}
        </div>
        <TextField
          className="amount"
          inputRef={text2InputRef}
          placeholder="Enter amount"
          variant="outlined"
          inputProps={{
            maxLength: 6,
          }}
          value={amount2 || ""}
          onChange={(e) => {
            setAmount2(e.target.value);
            const value = e.target.value;
            if (!isNaN(+value) === false) {setError ("Input must be a number!");}
            else setError(" "); convert2();
          }}
          autoComplete="off"
        />
        <FormControl
          className="dropdownMenu"
          variant="outlined"
          onChange={(e) => {
            setExchangeRate2(e.target.value);
            let key = getKeyByValue(currencyList2, e.target.value)
            let trueFullNameList = new Map(Object.entries(fullNameList2))
            setFullName2(trueFullNameList.get(key))
            }}
        >
          <select className="dropdownMenu" native>
            {Object.keys(currencyList2).map((value, index) => (
              <option key={index} value={currencyList2[value]}>
                {value}
              </option>
            ))}
          </select>
        </FormControl>
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default CurrencyConverter;
