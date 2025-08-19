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

  // Log the ID received from URL params
  useEffect(() => {
    console.log('ID from URL params:', id);
  }, [id]);

  // Initialize state with default values to prevent errors on initial render.
  // This ensures memberTypeDetails is always an object, even before data is fetched.
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
    if (!id) {
      console.log('No ID found, skipping API call.');
      return;
    }
    console.log('Attempting to fetch member type with ID:', id);
    api
      .post('/membertype/getMemberTypeById', { member_type_id: id })
      .then((res) => {
        console.log('API Response Data:', res.data); // Log the full API response
        // Ensure data exists and is not empty before setting state.
        // This prevents errors if the API returns no data or an unexpected structure.
        if (res.data.data && res.data.data.length > 0) {
          const data = res.data.data[0];
          console.log('Member Type Data Found:', data); // Log the specific data object
          setMemberTypeDetails({
            member_type_name: data.member_type_name || '',
            // Trim any leading/trailing spaces from the 'type' value.
            // This ensures it matches the dropdown options exactly.
            type: (data.type || '').trim(),
            is_active: data.is_active === 1,
            modified_by: data.modified_by || '',
            modified_on: data.modified_on || '',
          });
        } else {
          console.log('API returned no data for this ID.');
          message('Member Type not found', 'info');
          // Optionally clear the form or set default values if no data is found
          setMemberTypeDetails({
            member_type_name: '',
            type: '',
            is_active: true,
            modified_by: '',
            modified_on: '',
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching Member Type data:', error); // Log the error object
        message('Unable to fetch Member Type data', 'error');
        // Handle error by setting default state or showing an error message
        setMemberTypeDetails({
          member_type_name: '',
          type: '',
          is_active: true,
          modified_by: '',
          modified_on: '',
        });
      });
  };

  const editMemberType = () => {
    // Ensure memberTypeDetails is not undefined and required fields are filled
    if (!memberTypeDetails || memberTypeDetails.member_type_name === '') {
      message('Please fill all required fields', 'error');
      return;
    }

    const payload = {
      ...memberTypeDetails,
      is_active: memberTypeDetails.is_active ? 1 : 0,
      modification_date: creationdatetime,
      modified_by: loggedInuser?.first_name || 'Admin',
      member_type_id: id,
    };
    console.log('Payload for editMemberType:', payload); // Log the payload before sending

    api
      .post('/membertype/editMemberType', payload)
      .then(() => {
        message('Member Type updated successfully', 'success');
        navigate('/MemberType'); // Uncomment if you want to redirect after update
      })
      .catch((error) => {
        console.error('Error updating Member Type:', error); // Log the error object
        message('Unable to update Member Type', 'error');
      });
  };

  useEffect(() => {
    if (id) {
      getMemberTypeById();
    }
  }, [id]);

  // Add this useEffect to verify the 'type' value in state after fetch.
  // This is a helpful debugging tool.
  useEffect(() => {
    console.log('Current memberTypeDetails.type in state:', memberTypeDetails.type);
  }, [memberTypeDetails.type]);


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
                  value={memberTypeDetails?.member_type_name || ''}
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
                  value={memberTypeDetails?.type || ''}
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
                    checked={memberTypeDetails?.is_active || false}
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
