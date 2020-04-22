import React, { useState } from "react";
import "./App.css";
import { Button, Form, Navbar, Nav, NavDropdown, Card, Collapse } from "react-bootstrap";

import { authenticationService } from "./authentication.service";
import AccountDropdown from "./components/AccountDropdown"
import PostingsList from "./components/PostingsList"
import PostingsChart from "./components/PostingsChart"


function LoginForm() {
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSubmit = function() {
    authenticationService.login(userName, password);
    setUserName("");
    setPassword("");
  }

  return (
    <Form className="mx-3 my-1">
      <Form.Group>
        <Form.Control type="text" value={userName} placeholder="Username" onChange={(event) => setUserName(event.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Control type="password" value={password} placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
      </Form.Group>
      <Button variant="primary" onClick={handleSubmit} block>
        Sign In
      </Button>
    </Form>
  );
}

function App() {
  const [accountId, setAccountId] = useState(null);
  const [chartIsOpen, setChartIsOpen] = useState(true);
  const [tableIsOpen, setTableIsOpen] = useState(true);

  return (
    <div>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Navbar.Brand>Ledger</Navbar.Brand>
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#reports">Reports</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <NavDropdown alignRight title="Login">
              <LoginForm />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="container my-2">
        <AccountDropdown setAccountId={setAccountId} />
        { accountId &&
          <div>
            <Card className="my-2">
              <Card.Header onClick={() => setChartIsOpen(!chartIsOpen)}>Monthly Aggregates</Card.Header>
              <Collapse in={chartIsOpen}>
                <Card.Body>
                  <PostingsChart accountId={accountId} />
                </Card.Body>
              </Collapse>
            </Card>
            <Card>
              <Card.Header onClick={() => setTableIsOpen(!tableIsOpen)}>Postings</Card.Header>
              <Collapse in={tableIsOpen}>
                <Card.Body>
                  <PostingsList accountId={accountId}/>
                </Card.Body>
              </Collapse>
            </Card>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
