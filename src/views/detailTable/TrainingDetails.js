import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const TrainingDetails = () => {
  const [training, setTraining] = useState();
  const [trainingDetails, setTrainingDetails] = useState({
    title: '',
    training_id: '',
  });

  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  const getSelectedLocationFromLocalStorage = () => {
    const locations = localStorage.getItem('selectedLocation');
    const loc = JSON.parse(locations);
    return locations ? Number(loc) : null;
  };

  const selectedLocation = getSelectedLocationFromLocalStorage();

  const getTraining = () => {
    api
      .get('/training/getTraining')
      .then((res) => {
        setTraining(res.data.data);
      })
      .catch(() => {
        message('Training Data Not Found', 'info');
      });
  };
console.log(training);
  const handleInputs = (e) => {
    setTrainingDetails({ ...trainingDetails, [e.target.name]: e.target.value });
  };

  const insertTrainingDetailData = () => {
    if (trainingDetails.title !== '') {
      trainingDetails.creation_date = creationdatetime;
      trainingDetails.created_by = loggedInuser.first_name;
      trainingDetails.site_id = selectedLocation;
      api
        .post('/training/insertTraining', trainingDetails)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Training inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/TrainingEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields.', 'error');
    }
  };

  useEffect(() => {
    getTraining();
  }, []);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="6" xs="12">
          <ComponentCard title="Key Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <Label>
                      <span className="required">*</span> Title
                    </Label>
                    <Input
                      type="text"
                      onChange={handleInputs}
                      value={trainingDetails.title}
                      name="title"
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={insertTrainingDetailData}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => navigate(-1)}
                      type="button"
                      className="btn btn-dark shadow-none"
                    >
                      Go to List
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </>
  );
};

export default TrainingDetails;
