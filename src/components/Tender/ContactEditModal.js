import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  ModalBody,
  ModalFooter,
  Modal,
  ModalHeader,
  Card,
} from 'reactstrap';
import PropTypes from 'prop-types';
//import ComponentCard from '../ComponentCard';
import message from '../Message';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../views/form-editor/editor.scss';

import api from '../../constants/api';

const ContactEditModal = ({ contactData, editContactEditModal, setEditContactEditModal }) => {
  ContactEditModal.propTypes = {
    contactData: PropTypes.object,
    editContactEditModal: PropTypes.bool,
    setEditContactEditModal: PropTypes.func,
  };

  const [contactinsert, setContactInsert] = useState(null);

  const handleInputs = (e) => {
    setContactInsert({ ...contactinsert, [e.target.name]: e.target.value });
  };

  const editContactsData = () => {
    api
      .post('/clients/editContact', contactinsert)
      .then(() => {
        message('Record edited successfully', 'success');
        window.location.reload();
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  useEffect(() => {
    setContactInsert(contactData);
  }, [contactData]);

  return (
    <Modal size="lg" isOpen={editContactEditModal}>
      <ModalHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
        <span className="fw-bold">Edit Contact Details</span>
        <Button
          color="white"
          className="btn-close btn-close-white"
          onClick={() => setEditContactEditModal(false)}
        />
      </ModalHeader>

      <ModalBody className="p-4">
        <Card className="shadow-none">
          <Row className="g-4">
            <Col md="3">
              <FormGroup>
                <Label className="fw-bold">Title</Label>
                <Input
                  type="select"
                  className="form-select"
                  onChange={handleInputs}
                  value={contactinsert?.salutation || ''}
                  name="salutation"
                >
                  <option value="">Please Select</option>
                  <option value="Ms">Ms</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label className="fw-bold">Name</Label>
                <Input
                  type="text"
                  className="form-control"
                  onChange={handleInputs}
                  value={contactinsert?.first_name || ''}
                  name="first_name"
                  placeholder="Enter name"
                />
              </FormGroup>
            </Col>
            <Col md="5">
              <FormGroup>
                <Label className="fw-bold">Email</Label>
                <Input
                  type="email"
                  className="form-control"
                  onChange={handleInputs}
                  value={contactinsert?.email || ''}
                  name="email"
                  placeholder="Enter email"
                />
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label className="fw-bold">Position</Label>
                <Input
                  type="text"
                  className="form-control"
                  onChange={handleInputs}
                  value={contactinsert?.position || ''}
                  name="position"
                  placeholder="Enter position"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label className="fw-bold">Department</Label>
                <Input
                  type="text"
                  className="form-control"
                  onChange={handleInputs}
                  value={contactinsert?.department || ''}
                  name="department"
                  placeholder="Enter department"
                />
              </FormGroup>
            </Col>

            <Col md="4">
              <FormGroup>
                <Label className="fw-bold">Phone (Direct)</Label>
                <Input
                  type="tel"
                  className="form-control"
                  onChange={handleInputs}
                  value={contactinsert?.phone_direct || ''}
                  name="phone_direct"
                  placeholder="Enter phone number"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label className="fw-bold">Mobile</Label>
                <Input
                  type="tel"
                  className="form-control"
                  onChange={handleInputs}
                  value={contactinsert?.mobile || ''}
                  name="mobile"
                  placeholder="Enter mobile number"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label className="fw-bold">Fax</Label>
                <Input
                  type="tel"
                  className="form-control"
                  onChange={handleInputs}
                  value={contactinsert?.fax || ''}
                  name="fax"
                  placeholder="Enter fax number"
                />
              </FormGroup>
            </Col>
          </Row>
        </Card>
      </ModalBody>

      <ModalFooter className="p-3">
        <Button
          color="primary"
          onClick={editContactsData}
          className="me-2"
        >
          Save Changes
        </Button>
        <Button
          color="secondary"
          onClick={() => setEditContactEditModal(false)}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ContactEditModal;
