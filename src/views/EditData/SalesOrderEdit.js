import React, { useState, useEffect } from 'react';
import {  Form,  TabContent,TabPane, } from 'reactstrap';
// import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useNavigate } from 'react-router-dom';
import '../form-editor/editor.scss';
// import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
// import ComponentCardV2 from '../../components/ComponentCardV2';
import message from '../../components/Message';
import api from '../../constants/api';
import Tab from '../../components/ProjectTabs/Tab';
import ApiButton from '../../components/ApiButton';
import Customer from '../../components/SalesOrder/Customer';
import Currency from '../../components/SalesOrder/Currency';
import Shipping from '../../components/SalesOrder/Shipping';
import SalesMan from '../../components/SalesOrder/SalesMan';



const SalesOrderEdit = () => {
 
  const [supplierStatus, setSupplierStatus] = useState();
  const [activeTab, setActiveTab] = useState('1');


  //navigation and params
  // const { id } = useParams();
  const navigate = useNavigate();
  // const applyChanges = () => {};

  const getSupplierStatus = () => {
    api
      .get('/supplier/getValueList')
      .then((res) => {
        setSupplierStatus(res.data.data);
      })
      .catch(() => {
        message('Status Data Not Found', 'info');
      });
  };
  useEffect(() => {
      getSupplierStatus();
  }, []);

    // Start for tab refresh navigation #Renuka 1-06-23
    const tabs = [
      { id: '1', name: 'Customer' },
      { id: '2', name: 'Currency' },
      { id: '3', name: 'Shipping' },
      { id: '4', name: 'Sales Man' },
     
    ];
    const toggle = (tab) => {
      setActiveTab(tab);
    };
  // Navigate back to the list
  const backToList = () => {
    navigate('/SalesOrder');
  };


  return (
    <div>
      <Form>
      <ApiButton
              editData={supplierStatus}
              navigate={navigate}
              applyChanges={supplierStatus}
              backToList={backToList}
              module="SalesOrder"
            ></ApiButton>
      </Form>

      <ComponentCard title="More Details">
        {/* Replace toggle and tabs with your implementation */}
        <Tab toggle={toggle} tabs={tabs} />
            <TabContent className="p-4" activeTab={activeTab}>
              <TabPane tabId="1">
                <Customer></Customer>
       </TabPane>
          <TabPane tabId="2">
            <Currency></Currency>
     </TabPane>
          <TabPane tabId="3">
            <Shipping></Shipping>
          </TabPane>
          <TabPane tabId="4">
            <SalesMan></SalesMan>
          </TabPane>
         
        </TabContent>
      </ComponentCard>
    </div>
  );
};

export default SalesOrderEdit;
