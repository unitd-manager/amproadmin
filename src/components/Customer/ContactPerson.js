import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  FormGroup,
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
    <div>
      <Row className="mb-4">
        <Col md="6">
          <FormGroup>
            <Label>Contact Person</Label>
            <Input
              type="text"
              onChange={handleNewContactInputs}
              value={newContact.first_name}
              name="first_name"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="text"
              onChange={handleNewContactInputs}
              value={newContact.email}
              name="email"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Phone No</Label>
            <Input
              type="text"
              onChange={handleNewContactInputs}
              value={newContact.mobile}
              name="mobile"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>HandPhone No</Label>
            <Input
              type="text"
              onChange={handleNewContactInputs}
              value={newContact.phone}
              name="phone"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Fax No</Label>
            <Input
              type="text"
              onChange={handleNewContactInputs}
              value={newContact.fax}
              name="fax"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Designation</Label>
            <Input
              type="text"
              onChange={handleNewContactInputs}
              value={newContact.designation}
              name="designation"
            />
          </FormGroup>
        </Col>
        <Col md="12" className="text-right mt-3">
          <Button color="success" onClick={addContact}>
            Add Contact
          </Button>
        </Col>
      </Row>

      <hr />

      <h4>Existing Contacts</h4>
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
        <p>No contacts added yet.</p>
      )}
    </div>
  );
}

ContactPerson.propTypes = {
  contactId: PropTypes.string.isRequired,
};