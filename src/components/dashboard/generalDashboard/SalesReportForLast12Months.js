import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js"; // v2.9.4
import { Card, CardHeader, CardBody } from "reactstrap";
import { FaChartBar } from "react-icons/fa"; // ✅ add icon like 30 days sales
import api from "../../../constants/api";

// Reuse consistent dashboard card styles
const cardStyle = {
  height: "450px",
  display: "flex",
  flexDirection: "column",
};
const cardBodyStyle = {
  flex: "1 1 auto",
  overflowY: "auto",
};

const SalesReportForLast12Months = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    api
      .get("/product/last12MonthSalesReport")
      .then((res) => {
        setSalesData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const labels = salesData.map((item) => item.month_label); // e.g., "Sep 2024"
  const values = salesData.map((item) => item.total_sales);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Month Sales",
        backgroundColor: "#4caf50", // ✅ green
        borderColor: "#4caf50",
        borderWidth: 1,
        hoverBackgroundColor: "#388e3c",
        hoverBorderColor: "#388e3c",
        data: values,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    legend: {
      display: true,
      labels: {
        fontFamily: "Nunito Sans, sans-serif",
        fontColor: "#8898aa",
      },
    },
    tooltips: {
      callbacks: {
        title: (tooltipItems) => labels[tooltipItems[0].index],
        label: (tooltipItem) => `Month Sales: ${tooltipItem.yLabel}`,
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontFamily: "Nunito Sans, sans-serif",
            fontColor: "#8898aa",
          },
          gridLines: { display: true },
        },
      ],
      xAxes: [
        {
          ticks: {
            autoSkip: false,
            fontFamily: "Nunito Sans, sans-serif",
            fontColor: "#8898aa",
          },
          gridLines: { display: false },
        },
      ],
    },
  };

  return (
    <Card className="shadow-sm mb-4" style={cardStyle}>
      <CardHeader className="bg-white d-flex align-items-center">
        <FaChartBar className="me-2 text-success" /> {/* ✅ green icon */}
        <h5 className="mb-0">Sales Report (Last 12 Months)</h5>
      </CardHeader>
      <CardBody style={cardBodyStyle}>
        {salesData.length > 0 ? (
          <div style={{ width: "100%", height: 350 }}>
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </CardBody>
    </Card>
  );
};

export default SalesReportForLast12Months;
