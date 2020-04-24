import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_LEDGER_BASE_URL}`
});

export const authenticationService = {
  login,
  currentUser: () => JSON.parse(localStorage.getItem("currentUser"))
};

function login(userName, password) {
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }

  instance
    .post('/login', { userName, password }, config)
    .then(response => {
      localStorage.setItem("currentUser", JSON.stringify(response.data.data));
    });
}