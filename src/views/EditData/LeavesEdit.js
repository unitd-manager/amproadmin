import React, { useEffect, useState, useContext} from 'react';
import { Row, Col, Form, FormGroup, Button, TabPane, TabContent } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ToastContainer } from 'react-toastify';
import * as Icon from 'react-feather';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
import LeavePastHistory from '../../components/LeaveTable/LeavePastHistory';
import ComponentCard from '../../components/ComponentCard';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import message from '../../components/Message';
//import ComponentCardV2 from '../../components/ComponentCardV2';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../form-editor/editor.scss';
import AppContext from '../../context/AppContext';
import api from '../../constants/api';
import LeaveMainDetails from '../../components/LeaveTable/LeaveMainDetails';
import ApiButton from '../../components/ApiButton';
import Tab from '../../components/ProjectTabs/Tab';
import creationdatetime from '../../constants/creationdatetime';

const LeavesEdit = () => {
  //Const Variables
  const [activeTab, setActiveTab] = useState('1');
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [leavesDetails, setLeavesDetails] = useState({});
  const [PastleavesDetails, setPastLeavesDetails] = useState();
  const [RoomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState('');
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  const [difference, setDifference] = useState();
  const [update, setUpdate] = useState(false);

  // Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  // Button Save Apply Back List
  const applyChanges = () => {};
  const backToList = () => {
    navigate('/Leave');
  };

  // Start for tab refresh navigation #Renuka 1-06-23
  const tabs = [
    { id: '1', name: 'Attachment' },
    { id: '2', name: 'Past Leave History' },
  ];
  const toggle = (tab) => {
    setActiveTab(tab);
  };
  // End for tab refresh navigation #Renuka 1-06-23

  //  get Leave Past history
  const LeavePastHistoryById = (empId) => {
    api
      .post('/leave/getPastLeaveHistoryById', { employee_id: empId })
      .then((res) => {
        setPastLeavesDetails(res.data.data);
      })
      .catch(() => {
        message('leaves Data Not Found', 'info');
      });
  };

  // Get Leaves By Id
  const editLeavesById = () => {
    api
      .post('/leave/getLeaveByid', { leave_id: id })
      .then((res) => {
        setLeavesDetails(res.data.data[0]);
        LeavePastHistoryById(res.data.data[0].employee_id);
        const fromMonth = moment(res.data.data[0].from_date).format('MM');
        const toMonth = moment(res.data.data[0].to_date).format('MM');
        const diff = fromMonth - toMonth;

        setDifference(diff);
      })
      .catch(() => {
        message('leaves Data Not Found', 'info');
      });
  };
  //Leave Functions/Methods
  const handleInputs = (e) => {
    setLeavesDetails({ ...leavesDetails, [e.target.name]: e.target.value });
  };
  // Attachment
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };

  //Logic for edit data in db
  const editLeavesData = () => {
    if (!leavesDetails.no_of_days) {
      message('Please fill No of Days (Current Month)', 'warning');
      return; // Stop further processing
    }
    if (new Date(leavesDetails.to_date) >= new Date(leavesDetails.from_date)) {
      
      if (
        leavesDetails.from_date!=='' &&
        leavesDetails.to_date!=='' &&
        leavesDetails.leave_type!=='' 
       
      ) {
        
        leavesDetails.modification_date = creationdatetime;
        leavesDetails.modified_by = loggedInuser.first_name;
        api
          .post('/leave/editleave', leavesDetails)
          .then(() => {
            message('Record editted successfully', 'success');
          })
          .catch(() => {
            message('Unable to edit record.', 'error');
          });
      } else {
        message('Please fill all required fields', 'warning');
      }
    }else{
      message('The To date should be the future date of From date', 'error');
     
    }
    // } else {
    //   message('Please fill No Of Days(current Month)', 'warning');
    // }
  };

  useEffect(() => {
    editLeavesById();
  }, [id]);
  const deleteLeaveData = () => {
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
        api
          .post('/leave/deleteLeave', { leave_id: id })
          .then(() => {
            Swal.fire('Deleted!', 'Your Leave has been deleted.', 'success');
            window.location.reload();
          });
      }
    });
  };

  return (
    <>
      {/* BreadCrumbs */}
      <BreadCrumbs heading={leavesDetails && leavesDetails.employee_name} />
      {/* Button */}
      <Form>
        <FormGroup>
          <ToastContainer></ToastContainer>
          
            <ApiButton
              editData={editLeavesData}
              navigate={navigate}
              applyChanges={applyChanges}
              backToList={backToList}
              module="Leave"
              deleteData={deleteLeaveData}
            ></ApiButton>
          
        </FormGroup>
      </Form>

      {/* Main Details */}
      <LeaveMainDetails name='LeaveMainDetails'
        handleInputs={handleInputs}
        leavesDetails={leavesDetails}
        difference={difference}
      ></LeaveMainDetails>

      {/* Nav tab */}
      <ComponentCard title="More Details">
        <ToastContainer></ToastContainer>

        <Tab toggle={toggle} tabs={tabs} />

        <TabContent className="p-4" activeTab={activeTab}>
          {/* Attachment */}
          <TabPane tabId="1">
            <Form>
              <FormGroup>
                <Row>
                  <Col xs="12" md="3" className="mb-3">
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        setRoomName('Leave');
                        setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF', 'PDF']);
                        dataForAttachment();
                        setAttachmentModal(true);
                      }}
                    >
                      <Icon.File className="rounded-circle" width="20" />
                    </Button>
                  </Col>
                </Row>
                <AttachmentModalV2
                  moduleId={id}
                  attachmentModal={attachmentModal}
                  setAttachmentModal={setAttachmentModal}
                  roomName={RoomName}
                  fileTypes={fileTypes}
                  altTagData="LeaveRelated Data"
                  desc="LeaveRelated Data"
                  recordType="RelatedPicture"
                  mediaType={attachmentData.modelType}
                  update={update}
                  setUpdate={setUpdate}
                />
                <ViewFileComponentV2
                  moduleId={id}
                  roomName="Leave"
                  recordType="RelatedPicture"
                  update={update}
                  setUpdate={setUpdate}
                />
              </FormGroup>
            </Form>
          </TabPane>
          {/* Past Leave history */}
          <TabPane tabId="2">
            <LeavePastHistory
              PastleavesDetails={PastleavesDetails}
              leavesDetails={leavesDetails}
            ></LeavePastHistory>
          </TabPane>
        </TabContent>
      </ComponentCard>
    </>
  );
};
export default LeavesEdit;
