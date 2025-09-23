import SalesReportFor30Days from "../generalDashboard/SalesReportFor30Days";
import DepartmentWiseProduct from "../generalDashboard/DepartmentWiseProduct";
import CategoryWiseProduct from "../generalDashboard/CatagoryWiseProduct";
import SalesReportForLast12Months from "../generalDashboard/SalesReportForLast12Months";
import RecentSalesInvoices from "../generalDashboard/RecentSalesInvoices";

const SalesTab = () => {
 

  return (
    <div>
      <RecentSalesInvoices />
        <SalesReportFor30Days />
        <DepartmentWiseProduct />
        <CategoryWiseProduct />
        <SalesReportForLast12Months />
    </div>
  );
};

export default SalesTab;
