import React, { useEffect, useState, useContext } from 'react';
import { Row, TabContent, TabPane, Form, FormGroup } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import TabPassTypeTab from '../../components/EmployeeTable/TabPassTypeTab';
import EducationalQualificationTab from '../../components/EmployeeTable/EducationalQualificationTab';
import ContactInformationTab from '../../components/EmployeeTable/ContactInformationTab';
import EmergencyContactTab from '../../components/EmployeeTable/EmergencyContactTab';
import EmployeePart from '../../components/EmployeeTable/EmployeePart';
import AttachmentPortalsTab from '../../components/EmployeeTable/AttachmentPortalsTab';
import LinkedPortalsTab from '../../components/EmployeeTable/LinkedPortalsTab';
import LoginDetailsTab from '../../components/EmployeeTable/LoginDetailsTab';
//import EmployeeButtons from '../../components/Employee/EmployeeButtons';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import message from '../../components/Message';
import Tab from '../../components/ProjectTabs/Tab';
import ApiButton from '../../components/ApiButton';
import creationdatetime from '../../constants/creationdatetime';

const EmployeeEdit = () => {
  //state variables
  const [activeTab, setActiveTab] = useState('1');
  const [employeeDetails, setEmployeeDetails] = useState();
  const [contactInformationDetails, setContactInformationDetails] = useState({
    employee_id: '',
    address_area: '',
    address_street: '',
    address_po_code: '',
    address_country1: '',
    mobile: '',
    phone: '',
    email: '',
    foreign_addrs_area: '',
    foreign_addrs_street: '',
    foreign_addrs_country: '',
    foreign_addrs_postal_code: '',
    foreign_mobile: '',
    foreign_email: '',
    phone_direct: '',
  });

  const [emergencyContactDetails, setEmergencyContactDetails] = useState({
    employee_id: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_phone2: '',
    emergency_contact_address: '',
  });
  const [educationalQualificationDetails, setEducationalQualificationDetails] = useState({
    employee_id: '',
    degree1: '',
    educational_qualitifcation1: '',
    year_of_completion1: '',
    degree2: '',
    educational_qualitifcation2: '',
    year_of_completion2: '',
    degree3: '',
    educational_qualitifcation3: '',
    year_of_completion3: '',
  });
  const [tabPassTypeDetails, setTabPassTypeDetails] = useState({
    citizen: '',
    nric_no: '',
    employee_id: '',
    fin_no: '',
    fin_no_expiry_date: '',
    work_permit: '',
    work_permit_expiry_date: '',
    spr_year: '',
  });
  const [allCountries, setallCountries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  const [pictureData, setDataForPicture] = useState({
    modelType: '',
  });

  //params and routing
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  // Route Change
  // const applyChanges = () => {};
  // const saveChanges = () => {
  //   setTimeout(()=>{
  //     navigate('/Employee');
  //   },1800)

  // };
  const backToList = () => {
    navigate('/Employee');
  };
  //handle inputs and set data
  const handleInputChange = (e) => {
    setEmployeeDetails({ ...employeeDetails, [e.target.name]: e.target.value });
  };
  const handlePassTypeInputs = (e) => {
    setTabPassTypeDetails({ ...tabPassTypeDetails, [e.target.name]: e.target.value });
  };
  const handleCiInputs = (e) => {
    setContactInformationDetails({ ...contactInformationDetails, [e.target.name]: e.target.value });
  };
  const handleEcInputs = (e) => {
    setEmergencyContactDetails({ ...emergencyContactDetails, [e.target.name]: e.target.value });
  };
  const handleEduInputs = (e) => {
    setEducationalQualificationDetails({
      ...educationalQualificationDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Start for tab refresh navigation #Renuka 1-06-23
  const tabs = [
    { id: '1', name: 'Login Details' },
    { id: '2', name: 'Pass Type' },
    { id: '3', name: 'Educational Qualification' },
    { id: '4', name: 'Contact Information' },
    { id: '5', name: 'Emergency Contact' },
    { id: '6', name: 'Attachment Portals' },
    { id: '7', name: 'Linked Portals' },
  ];
  const toggle = (tab) => {
    setActiveTab(tab);
  };
  // End for tab refresh navigation #Renuka 1-06-23

  //get apis
  // Get Employee data By Employee id
  const getEmployeeById = () => {
    api
      .post('/employeeModule/getEmployeeById', { employee_id: id })
      .then((res) => {
        setEmployeeDetails(res.data.data[0]);
      })
      .catch(() => {
        // message('Employee Data Not Found', 'info');
      });
  };
  //get Contact Information data
  const getContactInformationById = () => {
    api
      .post('/employeeModule/TabContactInformationById', { employee_id: id })
      .then((res) => {
        setContactInformationDetails(res.data.data[0]);
      })
      .catch(() => {
        //message('contact info Data Not Found', 'info');
      });
  };
  //get EmergencyContact data
  const getEmergencyContactById = () => {
    api
      .post('/employeeModule/TabEmergencyContactById', { employee_id: id })
      .then((res) => {
        setEmergencyContactDetails(res.data.data[0]);
      })
      .catch(() => {
        // message('Emergency contact info Data Not Found', 'info');
      });
  };

  //get EducationalQualification data
  const getEducationalQualificationById = () => {
    api
      .post('/employeeModule/TabEducationalQualificationById', { employee_id: id })
      .then((res) => {
        setEducationalQualificationDetails(res.data.data[0]);
      })
      .catch(() => {
        // message('Educational Qualification Data Not Found', 'info');
      });
  };
  //get tabPassType data
  const getTabPassTypeById = () => {
    api
      .post('/employeeModule/getTabPassTypeByID', { employee_id: id })
      .then((res) => {
        setTabPassTypeDetails(res.data.data[0]);
      })
      .catch(() => {
        //message('TabPass Type Data Not Found', 'info');
      });
  };
  //Api for getting all countries
  const getAllCountries = () => {
    api
      .get('/geocountry/getCountry')
      .then((res) => {
        setallCountries(res.data.data);
      })
      .catch(() => {
        //message('Country Data Not Found', 'info');
      });
  };
  //Api for getting all countries
  const getAllCompanies = () => {
    api
      .get('/company/getCompany')
      .then((res) => {
        setCompanies(res.data.data);
      })
      .catch(() => {
        //message('Country Data Not Found', 'info');
      });
  };
  //Api for getting Qualification
  const getQualifications = () => {
    api
      .get('/employeeModule/getQualification')
      .then((res) => {
        setQualifications(res.data.data);
      })
      .catch(() => {
        //message('qualification Data Not Found', 'info');
      });
  };

  // Api calls for Editing
  //edit employeedata
  const editEmployeeData = () => {
      employeeDetails.modified_by = loggedInuser.first_name;
      employeeDetails.modification_date = creationdatetime;
      api
        .post('/employeeModule/edit-Employee', employeeDetails)
        .then(() => {
           message('Record editted successfully', 'success');
           console.log('message details', employeeDetails)
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
  };

  //update tab data
  const editCIData = () => {
    api
      .post('/employeeModule/edit-ContactInformation', contactInformationDetails)
      .then(() => {
        // message('Record editted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
  //update tab data
  const editECData = () => {
    api
      .post('/employeeModule/edit-EmergencyContact', emergencyContactDetails)
      .then(() => {
        // message('Record editted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
  //update tab data
  const editEQData = () => {
   
      api
        .post('/employeeModule/edit-EducationalQualification', educationalQualificationDetails)
        .then(() => {
          //message('Record editted successfully', 'success');
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });

}
  //update tabpasstype data
  const editTabPassTypeData = () => {
    api
    .post('/employeeModule/edit-TabPassType', tabPassTypeDetails)
    .then(() => {
      //message('Record editted successfully', 'success');
    })
    .catch(() => {
      message('Unable to edit record.', 'error');
    });
  };
  //update all data
  // const updateData = async () => {
  //   if (
  //     employeeDetails.employee_name !== '' &&
  //     employeeDetails.date_of_birth !== '' &&
  //     employeeDetails.gender !== '' &&
  //     employeeDetails.nationality !== ''
  //     // Check if nationality is not "Please Select"
  //   ) {
  //     if (tabPassTypeDetails.citizen === 'Citizen' ) {
  //       if (tabPassTypeDetails.nric_no !== '') {
  //         await editEmployeeData();
  //         await editTabPassTypeData();
  //         await editEQData();
  //         await editECData();
  //         await editCIData();
  //       } else {
  //         message('Please fill the nricno fields', 'warning');
  //       }
  //     } else if (
        
  //       tabPassTypeDetails.citizen === 'DP' ||
  //       tabPassTypeDetails.citizen === 'EP' ||
  //       tabPassTypeDetails.citizen === 'SP'
  //     ) {
  //       if (tabPassTypeDetails.fin_no !== '') {
  //         await editEmployeeData();
  //   await editTabPassTypeData();
  //   await editEQData();
  //   await editECData();
  //   await editCIData();
  //       } else {
  //         message('Please fill the fin no field', 'warning');
  //       }
  //     } else if (tabPassTypeDetails.citizen === 'WP') {
  //       if (tabPassTypeDetails.fin_no !== '' && tabPassTypeDetails.work_permit !== '') {
  //         await editEmployeeData();
  //   await editTabPassTypeData();
  //   await editEQData();
  //   await editECData();
  //   await editCIData();
  //       } else {
  //         message('Please fill the Fin no and Work permit No field', 'warning');
  //       }
  //     } else if ( tabPassTypeDetails.citizen === 'PR') {
  //       if (tabPassTypeDetails.nric_no !== '' && tabPassTypeDetails.spr_year !== '') {
  //         await editEmployeeData();
  //         await editTabPassTypeData();
  //         await editEQData();
  //         await editECData();
  //         await editCIData();
  //       } else {
  //         message('Please fill the Nric No and Spryear field', 'warning');
  //       }
  //     } else {
  //       message('Please fill the PassType', 'warning');
  //     }
   
  // } else {
  //   message('Please fill the required fields', 'warning');
  // }
  // };
  
  const [isNricAlreadyInserted, setIsNricAlreadyInserted] = useState(false);
  const [isFinAlreadyInserted, setIsFinAlreadyInserted] = useState(false);

  const updateData = async () => {
    // Check if essential employee details are filled out
    if (
      employeeDetails.employee_name !== '' &&
      employeeDetails.date_of_birth !== '' &&
      employeeDetails.gender !== '' &&
      employeeDetails.nationality !== '' &&
      employeeDetails.nationality !== 'Please Select'
    ) {
      // Check if NRIC is not empty
      if (
        (tabPassTypeDetails.citizen === 'Citizen' || tabPassTypeDetails.citizen === 'PR') &&
        tabPassTypeDetails.nric_no === ''
      ) {
        message('Please enter the NRIC number.', 'warning');
        return; // Stop further execution
      }
  
      // Check if Fin number is empty for specific citizenship types
      if (['DP', 'EP', 'SP'].includes(tabPassTypeDetails.citizen) && tabPassTypeDetails.fin_no === '') {
        message('Please enter the Fin number.', 'warning');
        return; // Stop further execution
      }
  
      try {
        // Additional validation for NRIC
        if (
          (tabPassTypeDetails.citizen === 'Citizen' || tabPassTypeDetails.citizen === 'PR') &&
          tabPassTypeDetails.nric_no !== ''
        ) {
          const responseNric = await api.get('/employeemodule/CheckNricNo1');
          const existingNricNumbers = responseNric.data.data.filter((nric) => nric !== null);
          const isNricAlreadyExists = existingNricNumbers.some(
            (nric) =>
              nric.nric_no === tabPassTypeDetails.nric_no.toLowerCase() &&
              nric.employee_id !== employeeDetails.employee_id
          );
  
          if (isNricAlreadyExists) {
            setIsNricAlreadyInserted(true);
            message('NRIC is already inserted. Please provide a different number.', 'warning');
            return; // Stop further execution
          }
        }
  
        // Additional validation for Fin
        if (['DP', 'EP', 'SP'].includes(tabPassTypeDetails.citizen) && tabPassTypeDetails.fin_no !== '') {
          const responseFin = await api.get('/employeemodule/CheckFinNo1');
          const existingFinNumbers = responseFin.data.data.filter((fin) => fin !== null);
          const isFinAlreadyExists = existingFinNumbers.some(
            (fin) =>
              fin.fin_no === tabPassTypeDetails.fin_no.toLowerCase() &&
              fin.employee_id !== employeeDetails.employee_id
          );
  
          if (isFinAlreadyExists) {
            setIsFinAlreadyInserted(true);
            message('Fin is already inserted. Please provide a different number.', 'warning');
            return; // Stop further execution
          }
        }
  
        // If both NRIC and Fin validations pass, proceed with updating data
        setIsNricAlreadyInserted(false);
        setIsFinAlreadyInserted(false);
        await editEmployeeData();
        await editTabPassTypeData();
        await editEQData();
        await editECData();
        await editCIData();
        message('Success', 'success');
      } catch (error) {
        console.error('Error fetching existing NRIC/FIN numbers:', error);
        message('Unable to check for duplicate NRIC/FIN numbers. Please try again later.', 'error');
      }
    } else {
      message('Please fill the required fields', 'warning');
    }
  };
  

  // const updateData = async () => {
  //   // Check if essential employee details are filled out
  //   if (
  //     employeeDetails.employee_name !== '' &&
  //     employeeDetails.date_of_birth !== '' &&
  //     employeeDetails.gender !== '' &&
  //     employeeDetails.nationality !== '' &&
  //     employeeDetails.nationality !== 'Please Select' 
  //   ) 
  //     {
  //       // Check if NRIC is not empty
  //       if ((tabPassTypeDetails.citizen === 'Citizen' || tabPassTypeDetails.citizen === 'PR') && tabPassTypeDetails.nric_no === '') {
  //         message('Please enter the NRIC number.', 'warning');
  //         return; // Stop further execution
  //       }
  //     try {    
  //       const response = await api.get('/employeemodule/CheckNricNo1');
  //       const existingNricNumbers = response.data.data.filter(nric => nric !== null);
  //       //const isNricAlreadyExists = existingNricNumbers.some(nric => nric.toLowerCase() === tabPassTypeDetails.nric_no.toLowerCase());
  //       const isNricAlreadyExists = existingNricNumbers.some(
  //         (nric) =>
  //           nric.nric_no === tabPassTypeDetails.nric_no.toLowerCase() &&
  //           nric.employee_id !== employeeDetails.employee_id
  //       );
  
  //       if (isNricAlreadyExists) {
  //         setIsNricAlreadyInserted(true);
  //         message('NRIC is already inserted. Please provide a different number.', 'warning');
  //       } else {
  //         setIsNricAlreadyInserted(false);
  //         await editEmployeeData();
  //         await editTabPassTypeData();
  //         await editEQData();
  //         await editECData();
  //         await editCIData();
  //         message('Success', 'success');
  //       }
      
  //     } catch (error) {
  //       console.error('Error fetching existing NRIC numbers:', error);
  //       message('Unable to check for duplicate NRIC numbers. Please try again later.', 'error');
  //     }
  //   } else if ((tabPassTypeDetails.citizen === 'SP' ) && tabPassTypeDetails.fin_no === '') {
  //     // Additional checks for specific citizenship types
     
  //       try {
  //         const response = await api.get('/employeemodule/CheckFinNo1');
  //         const existingFinNumbers = response.data.data.filter(fin => fin!== null);
  //         //const isNricAlreadyExists = existingNricNumbers.some(nric => nric.toLowerCase() === tabPassTypeDetails.nric_no.toLowerCase());
  //         const isFinAlreadyExists = existingFinNumbers.some(
  //           (fin) =>
  //             fin.fin_no === tabPassTypeDetails.fin_no.toLowerCase() &&
  //             fin.employee_id !== employeeDetails.employee_id
  //         );
  //         if (isFinAlreadyExists) {
  //           setIsFinAlreadyInserted(true);
  //           message('Fin is already inserted. Please provide a different number.', 'warning');
  //         } else {
  //           setIsFinAlreadyInserted(false);
  //           await editEmployeeData();
  //           await editTabPassTypeData();
  //           await editEQData();
  //           await editECData();
  //           await editCIData();
  //           message('Success', 'success');
  //         }
  //       } catch (error) {
  //         console.error('Error fetching existing Fin numbers:', error);
  //         message('Unable to check for duplicate Fin numbers. Please try again later.', 'error');
  //       }
    
  //   } else if (tabPassTypeDetails.citizen === 'WP') {
  //     if (tabPassTypeDetails.fin_no !== '' && tabPassTypeDetails.work_permit !== '') {
  //       await editEmployeeData();
  //       await editTabPassTypeData();
  //       await editEQData();
  //       await editECData();
  //       await editCIData();
  //     } else {
  //       message('Please fill the Fin no and Work permit No field', 'warning');
  //     }
  //   } else if (tabPassTypeDetails.citizen === 'PR') {
  //     if (tabPassTypeDetails.nric_no !== '' && tabPassTypeDetails.spr_year !== '') {
  //       await editEmployeeData();
  //       await editTabPassTypeData();
  //       await editEQData();
  //       await editECData();
  //       await editCIData();
  //     } else {
  //       message('Please fill the Nric No and Spryear field', 'warning');
  //     }
  //   } else {
  //     message('Please fill the PassType', 'warning');
  //   }
  // };
  

  //Attachments
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };

  //Pictures
  const dataForPicture = () => {
    setDataForPicture({
      modelType: 'picture',
    });
  };
  const deleteEmployeeData = () => {
    Swal.fire({
      title: `Are you sure? ${id}`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api.post('/employeeModule/deleteEmployee', { employee_id: id }).then(() => {
          Swal.fire('Deleted!', 'Your Employee has been deleted.', 'success');
          window.location.reload();
        });
      }
    });
  };
  useEffect(() => {
    const getAlldata = async () => {
      await getEmployeeById();
      await getTabPassTypeById();
      await getContactInformationById();
      await getEducationalQualificationById();
      await getEmergencyContactById();
      await getAllCountries();
      await getQualifications();
      await getAllCompanies();
    };
    getAlldata();
  }, [id]);

  return (
    <>
      <BreadCrumbs />
      {/* <EmployeeButtons
        applyChanges={applyChanges}
        saveChanges={saveChanges}
        backToList={backToList}
        deleteEmployeeData={deleteEmployeeData}
        editEmployeeData={updateData}
      /> */}
      <Form>
        <FormGroup>
          <ToastContainer></ToastContainer>

          {/* Button */}
          <ApiButton
            editData={updateData}
            navigate={navigate}
            //applyChanges={updateData}
            backToList={backToList}
            deleteData={deleteEmployeeData}
            module="Employee"
          ></ApiButton>
        </FormGroup>
      </Form>
      <Row>
        <EmployeePart
          employeeDetails={employeeDetails}
          handleInputChange={handleInputChange}
          allCountries={allCountries}
          companies={companies}
        />
      </Row>
      <ComponentCard title="More Details">
        <Tab toggle={toggle} tabs={tabs} />
        <TabContent className="p-4" activeTab={activeTab}>
          <TabPane tabId="1">
            <LoginDetailsTab
              employeeDetails={employeeDetails}
              handleInputChange={handleInputChange}
            />
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <TabPassTypeTab
                tabPassTypeDetails={tabPassTypeDetails}
                handlePassTypeInputs={handlePassTypeInputs}
                isNricAlreadyInserted={isNricAlreadyInserted}
                isFinAlreadyInserted={isFinAlreadyInserted}
              />
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <EducationalQualificationTab
                educationalQualificationDetails={educationalQualificationDetails}
                qualifications={qualifications}
                handleEduInputs={handleEduInputs}
              />
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <ContactInformationTab
                contactInformationDetails={contactInformationDetails}
                handleCiInputs={handleCiInputs}
              />
            </Row>
          </TabPane>
          <TabPane tabId="5">
            <Row>
              <EmergencyContactTab
                emergencyContactDetails={emergencyContactDetails}
                handleEcInputs={handleEcInputs}
              />
            </Row>
          </TabPane>
          <TabPane tabId="6">
            {/* Picture and Attachments Form */}
            <Row>
              <AttachmentPortalsTab
                dataForPicture={dataForPicture}
                dataForAttachment={dataForAttachment}
                id={id}
                attachmentModal={attachmentModal}
                setAttachmentModal={setAttachmentModal}
                pictureData={pictureData}
                attachmentData={attachmentData}
              />
            </Row>
          </TabPane>
          <TabPane tabId="7">
            <Row>
              <LinkedPortalsTab
                id={id}
                employeeDetails={employeeDetails}
                handleInputChange={handleInputChange}
              />
            </Row>
          </TabPane>
        </TabContent>
      </ComponentCard>
    </>
  );
};

export default EmployeeEdit;
