import React, { useState, useContext } from 'react';
import {
  Row, Col, Form, FormGroup, Label, Input, Button,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
// import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const MemberTypeDetails = () => {
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  const [memberTypeDetails, setMemberTypeDetails] = useState({
    member_type_name: '',
    type: '',
    is_active: true,
  });

  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setMemberTypeDetails({ ...memberTypeDetails, [name]: newValue });
  };

  const insertMemberType = () => {
    if (memberTypeDetails.member_type_name !== '') {
      const payload = {
        ...memberTypeDetails,
        created_by: loggedInuser.first_name,
        creation_date: creationdatetime,
        is_active: memberTypeDetails.is_active ? 1 : 0,
      };

      api
        .post('/membertype/insertMemberType', payload)
        .then((res) => {
          const insertedId = res.data.data.insertId;
          message('Member Type inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/MemberTypeEdit/${insertedId}`);
          }, 500);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields.', 'error');
    }
  };

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="6">
          <ComponentCard title="Add/Edit Member Type">
            <Form>
              <FormGroup>
                <Label for="member_type_name">Member Type Name<span className="text-danger">*</span></Label>
                <Input
                  type="text"
                  id="member_type_name"
                  name="member_type_name"
                  placeholder="Enter Member Type Name"
                  value={memberTypeDetails.member_type_name}
                  onChange={handleInputs}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="type">Type</Label>
                <Input
                  type="select"
                  id="type"
                  name="type"
                  value={memberTypeDetails.type}
                  onChange={handleInputs}
                >
                  <option value="">Select a Type</option>
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  {/* Add more options as needed */}
                </Input>
              </FormGroup>
              <FormGroup check className="mb-3">
                <Label check>
                  <Input
                    type="checkbox"
                    name="is_active"
                    checked={memberTypeDetails.is_active}
                    onChange={handleInputs}
                  />
                  {' '}Is Active
                </Label>
              </FormGroup>
              <div className="d-flex gap-2">
                <Button color="primary" className="shadow-none" onClick={insertMemberType}>
                  Save
                </Button>
                <Button
                  color="danger"
                  className="shadow-none"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default MemberTypeDetails;
