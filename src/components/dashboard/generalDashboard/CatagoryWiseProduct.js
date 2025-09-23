import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js"; // ✅ v2.9.4
import { Card, CardHeader, CardBody } from "reactstrap";
import api from "../../../constants/api";

const DepartmentWiseProduct = () => {
  const [chartData, setChartData] = useState({});
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    api
      .get("/product/CategorywiseProductReport")
      .then((res) => {
        const departments = res.data.map(
          (item) => item.department_with_percentage
        );
        const sales = res.data.map((item) => item.total_sales_value);

        // calculate percentage share
        const totalSales = sales.reduce((a, b) => a + b, 0);
        const percents = sales.map((val) =>
          ((val / totalSales) * 100).toFixed(2)
        );
        setPercentages(percents);

        setChartData({
          labels: departments,
          datasets: [
            {
              label: "Product Department Sales",
              data: sales,
              backgroundColor: [
                "#FF9999", // soft red
                "#FFB366", // light orange
                "#FFFF99", // soft yellow
                "#99FF99", // light green
                "#99CCFF", // sky blue
                "#CC99FF", // light purple
                "#FFCC99", // peach
                "#66CCCC", // teal
                "#FF99CC", // pink
                "#C2C2F0", // soft violet
              ],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        });
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // ✅ Clean tooltip config
  const options = {
    tooltips: {
      callbacks: {
        label(tooltipItem, data) {
          const { index } = tooltipItem;
          const value = data.datasets[0].data[index];
          const label = data.labels[index];
          const percentMatch = label.match(/\((.*?)\)/);
          const percent = percentMatch
            ? percentMatch[1]
            : `${percentages[index]}%`;
          return `${label.split(" (")[0]} ${percent}: ${value.toFixed(2)}`;
        },
      },
    },
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <h5 className="mb-0">Product Category Sales</h5>
      </CardHeader>
      <CardBody>
        {chartData.labels ? (
          <Pie data={chartData} options={options} />
        ) : (
          <p>Loading...</p>
        )}
      </CardBody>
    </Card>
  );
};

export default DepartmentWiseProduct;
