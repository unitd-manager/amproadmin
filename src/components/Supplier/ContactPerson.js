import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Table,
} from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message';

export default function ContactPerson({ contactId }) {
  const [newContact, setNewContact] = useState({
    first_name: '',
    email: '',
    mobile: '',
    phone: '',
    fax: '',
    designation: '',
    company_id: contactId,
  });

  const [contactList, setContactList] = useState([]);

  const getContact = () => {
    api
      .post('/contact/getContactByContactId', { company_id: contactId })
      .then((res) => {
        setContactList(res.data.data);
      })
      .catch(() => {
        message('Contact not found', 'error');
      });
  };

  useEffect(() => {
    if (contactId) {
      getContact();
    }
  }, [contactId]);

  const handleNewContactInputs = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const addContact = () => {
    if (newContact.first_name && newContact.email) {
      const contactData = {
        ...newContact,
        contact_id: contactId,
      };
      api
        .post('/contact/insertContact', contactData)
        .then((res) => {
          setContactList([...contactList, res.data.data]);
          setNewContact({
            first_name: '',
            email: '',
            mobile: '',
            phone: '',
            fax: '',
            designation: '',
            company_id: contactId,
          });
          message('Contact added successfully', 'success');
          getContact(); // Refresh the list
        })
        .catch(() => {
          message('Failed to add contact', 'error');
        });
    } else {
      message('Please fill at least Contact Person and Email.', 'warning');
    }
  };

  const deleteContact = (contactIdToDelete) => {
    api
      .post('/contact/deleteContactss', { contact_id: contactIdToDelete })
      .then(() => {
        message('Contact deleted successfully', 'success');
        getContact(); // Refresh the list
      })
      .catch(() => {
        message('Failed to delete contact', 'error');
      });
  };

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Contact Person</h5>
        </div>
        <div className="card-body">
          <Row>
            {/* Left Column */}
            <Col sm={6}>
              <Row className="mb-3">
                <Col sm={6} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Contact Person</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewContactInputs}
                    value={newContact.first_name}
                    name="first_name"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={6} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Email</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="email"
                    className="form-control-sm"
                    onChange={handleNewContactInputs}
                    value={newContact.email}
                    name="email"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={6} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Phone No</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewContactInputs}
                    value={newContact.mobile}
                    name="mobile"
                  />
                </Col>
              </Row>
            </Col>

            {/* Right Column */}
            <Col sm={6}>
              <Row className="mb-3">
                <Col sm={6} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">HandPhone No</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewContactInputs}
                    value={newContact.phone}
                    name="phone"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={6} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Fax No</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewContactInputs}
                    value={newContact.fax}
                    name="fax"
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={6} className="d-flex align-items-center">
                  <Label className="mb-0 fw-bold">Designation</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="text"
                    className="form-control-sm"
                    onChange={handleNewContactInputs}
                    value={newContact.designation}
                    name="designation"
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button color="primary" size="sm" onClick={addContact}>
              Add Contact
            </Button>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Existing Contacts</h5>
        </div>
        <div className="card-body">
          {contactList.length > 0 ? (
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Contact Person</th>
                  <th>Email</th>
                  <th>Phone No</th>
                  <th>HandPhone No</th>
                  <th>Fax No</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactList.map((contact, index) => (
                  <tr key={contact.contact_id}>
                    <td>{index + 1}</td>
                    <td>{contact.first_name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.mobile}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.fax}</td>
                    <td>{contact.designation}</td>
                    <td>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => deleteContact(contact.contact_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-3">No contacts added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

ContactPerson.propTypes = {
  contactId: PropTypes.string.isRequired,
};