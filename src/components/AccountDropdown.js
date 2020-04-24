import React, { useState, useEffect } from "react";
import { Button, InputGroup } from "react-bootstrap";
import axios from 'axios';
import { authenticationService } from "../authentication.service";

const http = axios.create({
  baseURL: process.env.REACT_APP_LEDGER_BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

const AccountDropdown = function ({ setAccountId }) {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    if (authenticationService.currentUser() != null)
    {
      http
        .get("/account", {
          headers: {
            "Authorization": "Bearer " + authenticationService.currentUser().token
          }
        })
        .then(
          (result) => {
            setAccounts(result.data.data.items)
          }
        );
    }
  }, []);

  const handleSelectAccount = function() {
    var e = document.getElementById("accountSelect");
    if (e != null)
    {
      setAccountId(e.value);
      console.log(e.value);
    }
  }

  return (
    <InputGroup>
      <InputGroup.Text>Account</InputGroup.Text>
      <select id="accountSelect" className="custom-select">
        {accounts.map((account) => (
          <option value={account.id} key={account.id}>{account.name}</option>
        ))}
      </select>
      <InputGroup.Append>
          <Button onClick={() => handleSelectAccount()}>Submit</Button>
      </InputGroup.Append>
    </InputGroup>
  );
}

export default AccountDropdown;