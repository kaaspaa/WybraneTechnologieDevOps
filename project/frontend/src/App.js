import React, { useState} from 'react';
import logo from './logo.svg';
import {  TextField, Button } from '@material-ui/core'
//import { makeStyles, ThemeProvider  } from '@material-ui/core/styles';//
import './App.css';
import axios from "axios";

function App() {
  const [decimal, setDecimal] = useState('');
  const [binar, setBinar] = useState('');
  const [error, setError] = useState('');
  const handleClick = async (event) => {
    event.preventDefault();
    axios.get(`/api/${decimal}`).then(res => {
      console.log(decimal);
      if (res.data.error) {
        setBinar('');
        setError(res.data.error);
      } else {
        setError('');
        setBinar(res.data.result);
      }
    })
  };



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Convert decimal number to binary:
        </p>
        <form onSubmit={handleClick}>
	<form noValidate autoComplete="off">
        <TextField id="txtf-decimal" label="Decimal" value={decimal} required variant="filled" color="primary" onInput={e => setDecimal(e.target.value)}/>
        </form>
	<Button variant="contained" color="primary" type="submit">
          Convert
        </Button>
        </form>
        <form>
        {error ? <h4>{error}</h4> : <h4>{binar ?  `Your number in binary is ${binar}.`  : 'Waiting for conversion'}</h4>}
        
        </form>
      </header>
    </div>
  );
}

export default App;
