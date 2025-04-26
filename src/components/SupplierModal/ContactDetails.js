import React, { useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa'; // Imported add icon
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';

export default function ContactDetails({
  handleEdit,
  handleDelete,
}) {
  const [contactList, setContactList] = useState([
    {
      id: 1,
      contact_person: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      hand_phone_no: '9876543210',
      fax: '111222333',
    },
    {
      id: 2,
      contact_person: 'Jane Smith',
      email: 'jane@example.com',
      phone: '2233445566',
      hand_phone_no: '6655443322',
      fax: '444555666',
    },
    {
      id: 3,
      contact_person: 'Robert Brown',
      email: 'robert@example.com',
      phone: '3344556677',
      hand_phone_no: '7766554433',
      fax: '777888999',
    },
  ]);

  const [newContact, setNewContact] = useState({
    contact_person: '',
    phone: '',
    fax: '',
    email: '',
    hand_phone_no: '',
  });

  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleAddContact = () => {
    if (!newContact.contact_person) {
      alert('Please enter Contact Person Name!');
      return;
    }
    const newEntry = { ...newContact, id: contactList.length + 1 };
    setContactList([...contactList, newEntry]);
    setNewContact({
      contact_person: '',
      phone: '',
      fax: '',
      email: '',
      hand_phone_no: '',
    });
  };

  ContactDetails.propTypes = {
    handleEdit: PropTypes.func,
    handleDelete: PropTypes.func,
  };

  return (
    <Form>
      <FormGroup>
        <ComponentCard title="Contact Person Details">
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Contact Person Name</Label>
                <Input
                  type="text"
                  onChange={handleInputChange}
                  value={newContact.contact_person}
                  name="contact_person"
                />
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  onChange={handleInputChange}
                  value={newContact.phone}
                  name="phone"
                />
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label>Fax Number</Label>
                <Input
                  type="text"
                  onChange={handleInputChange}
                  value={newContact.fax}
                  name="fax"
                />
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  onChange={handleInputChange}
                  value={newContact.email}
                  name="email"
                />
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label>Hand Phone Number</Label>
                <Input
                  type="text"
                  onChange={handleInputChange}
                  value={newContact.hand_phone_no}
                  name="hand_phone_no"
                />
              </FormGroup>
            </Col>
            <Col className="text-end">
              <FaPlusCircle
                onClick={handleAddContact}
                size={50} // ← Big size
                style={{ color: '#0d6efd', cursor: 'pointer' }}
                title="Add Contact"
              />
            </Col>
          </Row>


          {/* Table to show contact persons */}
          <Row className="mt-4">
            <Col md="12">
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Hand Phone Number</th>
                    <th>Fax Number</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactList.length > 0 ? (
                    contactList.map((c) => (
                      <tr key={c.id}>
                        <td>{c.contact_person}</td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>{c.hand_phone_no}</td>
                        <td>{c.fax}</td>
                        <td className="text-center">
                          <FaEdit
                            style={{ cursor: 'pointer', marginRight: '10px', color: '#0d6efd' }}
                            onClick={() => handleEdit(c)}
                          />
                          <FaTrash
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => handleDelete(c)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No contacts available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </ComponentCard>
      </FormGroup>
    </Form>
  );
}
