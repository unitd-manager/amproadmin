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
      .get("/product/DepartmentwiseProductReport")
      .then((res) => {
        // Use only department name for labels
        const departments = res.data.map(
          (item) => item.department_with_percentage.split(' (')[0]
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
                "#FF6F61", // coral red
                "#FFA07A", // light salmon
                "#FFD700", // golden yellow
                "#90EE90", // light green
                "#40E0D0", // turquoise
                "#6495ED", // cornflower blue
                "#BA55D3", // medium orchid
                "#FF8C00", // dark orange
                "#FF69B4", // hot pink
                "#6A5ACD", // slate blue
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
          const percent = percentages[index] ? `${percentages[index]}%` : '';
          return `${label} (${percent}): ${value.toFixed(2)}`;
        },
      },
    },
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <h5 className="mb-0">Product Department Sales</h5>
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
