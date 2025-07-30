import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const MemberTypeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  const [memberTypeDetails, setMemberTypeDetails] = useState({
    member_type_name: '',
    type: '',
    is_active: true,
    modified_by: '',
    modified_on: '',
  });

  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setMemberTypeDetails((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const getMemberTypeById = () => {
    api
      .post('/membertype/getMemberTypeById', { member_type_id: id })
      .then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          const data = res.data.data[0];
          setMemberTypeDetails({
            member_type_name: data.member_type_name || '',
            type: data.type || '',
            is_active: data.is_active === 1,
            modified_by: data.modified_by || '',
            modified_on: data.modified_on || '',
          });
        } else {
          message('Member Type not found', 'info');
        }
      })
      .catch(() => {
        message('Unable to fetch Member Type data', 'error');
      });
  };

  const editMemberType = () => {
    if (memberTypeDetails.member_type_name !== '') {
      const payload = {
        ...memberTypeDetails,
        is_active: memberTypeDetails.is_active ? 1 : 0,
        modification_date: creationdatetime,
        modified_by: loggedInuser?.first_name || 'Admin',
        member_type_id: id,
      };

      api
        .post('/membertype/editMemberType', payload)
        .then(() => {
          message('Member Type updated successfully', 'success');
          // navigate('/MemberType'); // Uncomment if you want to redirect after update
        })
        .catch(() => {
          message('Unable to update Member Type', 'error');
        });
    } else {
      message('Please fill all required fields', 'error');
    }
  };

  useEffect(() => {
    if (id) {
      getMemberTypeById();
    }
  }, [id]);

  return (
    <>
      <BreadCrumbs heading="Edit Member Type" />
      <ToastContainer />
      <Form>
        <ComponentCard title="Edit Member Type">
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="member_type_name">
                  Member Type Name <span className="text-danger">*</span>
                </Label>
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
            </Col>
            <Col md="6">
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
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup check className="mb-3">
                <Label check>
                  <Input
                    type="checkbox"
                    name="is_active"
                    checked={memberTypeDetails.is_active}
                    onChange={handleInputs}
                  />{' '}
                  Is Active
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Button color="primary" onClick={editMemberType}>
                Save
              </Button>{' '}
              <Button color="secondary" onClick={() => navigate('/MemberType')}>
                Back to List
              </Button>
            </Col>
          </Row>
        </ComponentCard>
      </Form>
    </>
  );
};

export default MemberTypeEdit;
