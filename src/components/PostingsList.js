import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from 'axios';
import { authenticationService } from "../authentication.service";

const http = axios.create({
  baseURL: process.env.REACT_APP_LEDGER_BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

const Posting = function({ posting }) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ]

  const formatDate = function(date) {
    return months[date.getMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear()
  };

  const amountFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  const formatAmount = function(amount) {
    return amountFormatter.format(amount);
  }

  return (
    <tr>
      <td>{formatDate(new Date(posting.postedDate))}</td>
      <td>{posting.description}</td>
      <td align="right">{formatAmount(posting.amount)}</td>
    </tr>
  );
}
  
const PostingsList = function({ accountId }) {
  const [postings, setPostings] = useState([]);

  // Note: the empty deps array [] means this useEffect will run once similar to componentDidMount()
  useEffect(() => {
    if (authenticationService.currentUser() != null && accountId != null)
    {
      http
        .get(`account/${accountId}/posting`, {
          headers: {
            "Authorization": "Bearer " + authenticationService.currentUser().token
          }
        })
        .then(
          (result) => {
            setPostings(result.data.data.items)
          }
        );
    }
  }, [ accountId ]);

  return (
    <div className="posting-list">
      <Table striped bordered hover size="sm">
        <thead className="thead-dark">
          <tr>
            <th>Posted Date</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {postings.map((posting) => (
            <Posting key={posting.id} posting={posting} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PostingsList;