import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';

export default function ContactPersonInsert({ setContactsData }) {
  const [newContact, setNewContact] = useState({
    contact_person: '',
    email: '',
    phone_no: '',
    handphone_no: '',
    fax_no: '',
    designation: '',
  });

  const [contactList, setContactList] = useState([]);

  // Use useEffect to send the current contactList array to the parent whenever it changes
  useEffect(() => {
    setContactsData(contactList);
  }, [contactList, setContactsData]); // Depend on contactList and the setter function

  const handleNewContactInputs = (e) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value,
    });
  };

  const addContact = () => {
    // Basic validation for new contact person
    if (newContact.contact_person.trim() === '' || newContact.email.trim() === '') {
      alert('Please fill at least Contact Person Name and Email for the new contact.');
      return;
    }
    // Add a unique ID for local list management (e.g., for `key` prop in map, and delete function)
    setContactList([...contactList, { ...newContact, id: Date.now() }]);
    setNewContact({ // Clear the form for the next entry
      contact_person: '',
      email: '',
      phone_no: '',
      handphone_no: '',
      fax_no: '',
      designation: '',
    });
  };

  const deleteContact = (idToDelete) => {
    setContactList(contactList.filter(contact => contact.id !== idToDelete));
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
              value={newContact.contact_person}
              name="contact_person"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
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
              value={newContact.phone_no}
              name="phone_no"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Handphone No</Label>
            <Input
              type="text"
              onChange={handleNewContactInputs}
              value={newContact.handphone_no}
              name="handphone_no"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>Fax No</Label>
            <Input
              type="text"
              onChange={handleNewContactInputs}
              value={newContact.fax_no}
              name="fax_no"
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
            Add Contact Person
          </Button>
        </Col>
      </Row>

      <hr />

      <h4>Associated Contact Persons (To be saved with customer)</h4>
      {contactList.length > 0 ? (
        <Table responsive bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Handphone No</th>
              <th>Fax No</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contactList.map((contact, index) => (
              <tr key={contact.id}> {/* Use the unique ID generated */}
                <td>{index + 1}</td>
                <td>{contact.contact_person}</td>
                <td>{contact.email}</td>
                <td>{contact.phone_no}</td>
                <td>{contact.handphone_no}</td>
                <td>{contact.fax_no}</td>
                <td>{contact.designation}</td>
                <td>
                  <Button color="danger" size="sm" onClick={() => deleteContact(contact.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No contact persons added yet.</p>
      )}
    </div>
  );
}

ContactPersonInsert.propTypes = {
  setContactsData: PropTypes.func.isRequired,
};