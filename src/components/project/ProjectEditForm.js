import React, { useEffect, useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import ComponentCard from '../ComponentCard';

const ProjectEditForm = ({ projectDetail, setProjectDetail }) => {
  ProjectEditForm.propTypes = {
    projectDetail: PropTypes.any,
    setProjectDetail: PropTypes.any,
  };

  // Edit Project
  const handleInputs = (e) => {
    setProjectDetail({ ...projectDetail, [e.target.name]: e.target.value });
  };

  const [contact, setContact] = useState();

  const getContact = () => {
    api.post('/company/getContactByCompanyId', { company_id:projectDetail && projectDetail.company_id })
      .then((res) => {
        setContact(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching contact:", error);
      });
  };
  
  const [employee, setEmployee] = useState();

  const getEmployee = () => {
    api.get('/project/getProjectManager')
      .then((res) => {
        setEmployee(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching contact:", error);
      });
  };

  useEffect(() => {
    getContact();
    getEmployee();
  }, [projectDetail]); // Add projectDetail as a dependency
  

  return (
    <>
      <Form>
        <FormGroup>
          <ComponentCard
            title={`Project Details | Code: ${projectDetail && projectDetail.project_code} | 
            Category : ${projectDetail && projectDetail.category} | 
            Company :  ${projectDetail && projectDetail.company_name}  | 
            Status : ${projectDetail && projectDetail.status} `}
          >
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    name="title"
                    defaultValue={projectDetail && projectDetail.title}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>
                    Category <span className="required"> *</span>{' '}
                  </Label>
                  <Input
                    type="select"
                    name="category"
                    value={projectDetail && projectDetail.category}
                    onChange={handleInputs}
                  >
                    <option value="">Please Select</option>
                    <option value="Project">Project</option>
                    <option defaultValue="selected" value="Maintenance">
                      Maintenance
                    </option>
                    <option value="Tenancy Project">Tenancy Project</option>
                    <option value="Tenancy Work">Tenancy Work</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>Status </Label>
                  <Input
                    type="select"
                    name="status"
                    value={projectDetail && projectDetail.status}
                    onChange={handleInputs}
                  >
                    <option value="">Please Select</option>
                    <option defaultValue="selected" value="WIP">
                      WIP
                    </option>
                    <option value="Billable">Billable</option>
                    <option value="Billed">Billed</option>
                    <option value="Complete">Complete</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Latest">Latest</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Company</Label>
                  <Input
                    type="text"
                    disabled
                    name="company_name"
                    defaultValue={projectDetail && projectDetail.company_name}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
            <Col md="3">
                <FormGroup>
                  <Label>
                    Contact
                  </Label>
                  <Input
                    type="select"
                    onChange={handleInputs}
                    value={projectDetail && projectDetail.contact_id}
                    name="contact_id"
                  >
                    <option value="" selected>
                      Please Select
                    </option>
                    {contact &&
                      contact.map((e) => {
                        return (
                          <option key={e.contact_id} value={e.contact_id}>
                            {e.first_name}
                          </option>
                        );
                      })}
                
                  </Input>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="start_date"
                    defaultValue={projectDetail && projectDetail.start_date}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Estimated Finish Date</Label>
                  <Input
                    type="date"
                    name="estimated_finish_date"
                    defaultValue={projectDetail && projectDetail.estimated_finish_date}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    name="description"
                    defaultValue={projectDetail && projectDetail.description}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Project Manager</Label>
                  <Input
                    type="select"
                    name="project_manager_id"
                    value={projectDetail && projectDetail.project_manager_id}
                    onChange={handleInputs}
                  >
                      <option>Please Select</option>
                      {employee &&
                        employee.map((e) => {
                          return (
                            <option key={e.employee_id} value={e.employee_id}>
                              {e.employee_name}
                            </option>
                          );
                        })}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
    </>
  );
};

export default ProjectEditForm;
