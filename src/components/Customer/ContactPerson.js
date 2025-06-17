import React, { useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Table // Import Table for displaying contacts
} from 'reactstrap';
// import PropTypes from 'prop-types';

export default function ContactPerson(
) {
  // State for a new contact being added
  const [newContact, setNewContact] = useState({
    contact_person: '',
    email: '',
    phone_no: '',
    handphone_no: '',
    fax_no: '',
    designation: '',
  });

  // State to hold the list of contacts for this customer
  // This will likely be an array of objects
  const [contactList, setContactList] = useState([]);

  // Assuming contentDetails might initially have a list of contacts
  // You might need to adjust this based on how your API provides contacts
//   useEffect(() => {
//     if (contentDetails.contacts &&  Array.isArray(contentDetails.contacts)) {
//       setContactList(contentDetails.contacts);
//     }
//   }, [contentDetails.contacts]);


  const handleNewContactInputs = (e) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value,
    });
  };

  const addContact = () => {
    if (newContact.contact_person && newContact.email) { // Basic validation
      setContactList([...contactList, { ...newContact, id: Date.now() }]); // Add unique ID
      setNewContact({ // Clear the form fields after adding
        contact_person: '',
        email: '',
        phone_no: '',
        handphone_no: '',
        fax_no: '',
        designation: '',
      });
      // You might also want to pass this updated contactList to the parent here
      // e.g., handleInputs({ target: { name: 'contacts', value: updatedList }});
      // or a dedicated prop like onContactsChange(updatedList);
    } else {
      alert('Please fill at least Contact Person and Email.');
    }
  };

  const deleteContact = (id) => {
    setContactList(contactList.filter(contact => contact.id !== id));
    // Again, potentially pass this updated list to the parent
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
              value={newContact.phone_no}
              name="phone_no"
            />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label>HandPhone No</Label>
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
            Add Contact
          </Button>
        </Col>
      </Row>

      <hr /> {/* Separator between form and table */}

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
              <tr key={contact.id}>
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
                  {/* You could add an Edit button here */}
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

// ContactPerson.propTypes = {
//   contentDetails: PropTypes.object // This prop is passed but not directly used in the current version of this component for individual contact updates. It would be used if you wanted to update contentDetails directly with the entire contactList.
// };