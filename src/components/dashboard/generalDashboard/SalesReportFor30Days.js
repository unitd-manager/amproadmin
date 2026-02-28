// ./src/components/dashboard/DashboardTab/SalesReportFor30Days.js
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardBody } from "reactstrap";
import { FaChartBar } from "react-icons/fa";
import "chart.js"; // v2.9.4
import api from "../../../constants/api";


// Reuse dashboard styles
const cardStyle = {
  height: "450px",
  display: "flex",
  flexDirection: "column",
};
const cardBodyStyle = {
  flex: "1 1 auto",
  overflowY: "auto",
};

const SalesReportFor30Days = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    api
      .get("/product/last30daysSalesReport")
      .then((res) => setSalesData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const labels = salesData.map((item) => {
    const date = new Date(item.sale_date);
    const day = date.toLocaleDateString("en-GB", { weekday: "short" });
    const formattedDate = date.toLocaleDateString("en-GB");
    return `${day} ${formattedDate}`;
  });

  const values = salesData.map((item) => item.total_sales);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Day Sales",
        backgroundColor: "#2962ff",
        borderColor: "#2962ff",
        borderWidth: 1,
        hoverBackgroundColor: "#1e4bd8",
        hoverBorderColor: "#1e4bd8",
        data: values,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    legend: {
      display: true,
      labels: { fontFamily: "Nunito Sans, sans-serif", fontColor: "#8898aa" },
    },
    tooltips: {
      callbacks: {
        title: (tooltipItems) => labels[tooltipItems[0].index],
        label: (tooltipItem) => `Day Sales: ${tooltipItem.yLabel}`,
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
            maxRotation: 45,
            minRotation: 45,
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
        <FaChartBar className="me-2 text-primary" />
        <h5 className="mb-0">Sales Report (Last 30 Days)</h5>
      </CardHeader> 
      <CardBody style={cardBodyStyle}>
        <div style={{ width: "100%", height: 350 }}>
          <Bar data={chartData} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default SalesReportFor30Days;
