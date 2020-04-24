import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from 'axios';
import { authenticationService } from "../authentication.service";
import {Bar} from 'react-chartjs-2';

const http = axios.create({
  baseURL: process.env.REACT_APP_LEDGER_BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

const PostingsChart = function({ accountId }) {
  const [monthlyTotal, setMonthlyTotal] = useState([]);

  // Note: the empty deps array [] means this useEffect will run once similar to componentDidMount()
  useEffect(() => {
    if (authenticationService.currentUser() != null && accountId != null)
    {
      http
        .get(`account/${accountId}/posting/monthly`, {
          headers: {
            "Authorization": "Bearer " + authenticationService.currentUser().token
          }
        })
        .then(
          (result) => {
            setMonthlyTotal(result.data.data.aggregates)
          }
        );
    }
  }, [ accountId ]);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ]

  const formatDate = function(date) {
    return `${months[date.getMonth()]} ${date.getUTCFullYear()}`;
  };

  const data = {
    labels: monthlyTotal.map((value) => formatDate(new Date(value.date))),
    datasets: [
      {
        label: 'Amount',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: monthlyTotal.map((value) => value.amount)
      }
    ]
  };

  const amountFormatter = new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' });

  return (
    <div>
      <Bar
          data={data}
          options={{
            legend: {
              display: false
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  return amountFormatter.format(tooltipItem.yLabel);
                }
              }
            },
            scales: {
              yAxes: [{
                ticks: {
                  // Include a dollar sign in the ticks
                  callback: function(value, index, values) {
                    return amountFormatter.format(value);
                  }
                }
              }]
            }
          }}
        />
    </div>
  );
}

export default PostingsChart;