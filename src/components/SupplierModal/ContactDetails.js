import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Table, Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa'; // Imported add icon
import {  useParams } from 'react-router-dom';
import ComponentCard from '../ComponentCard';
import api from '../../constants/api';
import message from '../Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const ContactDetails = () => { 
  // const [contactList, setContactList] = useState([
  //   {
  //     id: 1,
  //     contact_person: 'John Doe',
  //     email: 'john@example.com',
  //     phone: '1234567890',
  //     hand_phone_no: '9876543210',
  //     fax: '111222333',
  //   },
  //   {
  //     id: 2,
  //     contact_person: 'Jane Smith',
  //     email: 'jane@example.com',
  //     phone: '2233445566',
  //     hand_phone_no: '6655443322',
  //     fax: '444555666',
  //   },
  //   {
  //     id: 3,
  //     contact_person: 'Robert Brown',
  //     email: 'robert@example.com',
  //     phone: '3344556677',
  //     hand_phone_no: '7766554433',
  //     fax: '777888999',
  //   },
  // ]);

  // const [newContact, setNewContact] = useState({
  //   contact_person: '',
  //   phone: '',
  //   fax: '',
  //   email: '',
  //   hand_phone_no: '',
  // });

  const [contactList, setContactList] = useState([])
  const [newContact, setNewContact] = useState({})
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const { id } = useParams();
  const { loggedInuser } = useContext(AppContext);
  const toggleEditModal = () => setEditModalOpen(!editModalOpen);
  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const getContactDetails = () => {
    api
      .post('/supplier/getContactBySupplierId', { supplier_id: id })
      .then((res) => {
        setContactList(res.data.data);
      })
      .catch(() => {
        message('Contact Data Not Found', 'info');
      });
  };
  
 const insertContact = () => {
  const firstName = (newContact.first_name || '').trim();

  if (firstName !== '') {
    const contactToInsert = {
      ...newContact,
      creation_date: creationdatetime,
      created_by: loggedInuser.first_name,
      supplier_id: id,
    };

    api.post('/contact/insertContact', contactToInsert)
      .then((res) => {
        message('Contact inserted successfully.', 'success');

        const insertedContact = {
          ...contactToInsert,
          id: res.data.insertId || Math.random(),
        };

        setContactList(prevList => [...prevList, insertedContact]);

        setNewContact({
          first_name: '',
          phone: '',
          fax: '',
          email: '',
          hand_phone_no: '',
        });
      })
      .catch(() => {
        message('Network connection error.', 'error');
      });
  } else {
    console.log('First name is empty or invalid'); // Debug
    message('Please fill all required fields', 'warning');
  }
};

   
    const handleUpdateContact = () => {
      if (selectedContact.first_name) {
        api.post('/contact/editContact', {
  contact_id: selectedContact.contact_id,
  first_name: selectedContact.first_name,
  email: selectedContact.email,
  phone: selectedContact.phone,
  fax: selectedContact.fax,
  hand_phone_no: selectedContact.hand_phone_no,})
          .then(() => {
            message('Contact updated successfully.', 'success');
            toggleEditModal();
            getContactDetails(); // Refresh contact list
          })
          .catch(() => {
            message('Failed to update contact.', 'error');
          });
      } else {
        message('Please fill required fields', 'warning');
      }
    };

      const handleDelete = (ContactId) => {
    Swal.fire({
      title: `Are you sure? `,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('contact/deleteContact', { contact_id: ContactId })
          .then(() => {
            Swal.fire('Deleted!', 'Contact has been deleted.', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 300);
          })
          .catch(() => {
            message('Unable to Delete Contact', 'info');
          });
      }
    });
  };


useEffect(() => {
    getContactDetails();
  }, [id]);
  

  return (
    <Form>
      <ToastContainer />
      <FormGroup>
        <ComponentCard title="Contact Person Details">
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Contact Person Name</Label><span className="required"> *</span>
                <Input
                  type="text"
                  onChange={handleInputChange}
                  value={newContact.first_name}
                  name="first_name"
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
                //onClick={handleAddContact}
                onClick={() => {
                  insertContact();
                  setTimeout(() => {
                  
                }, 800);
                }}
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
                        <td>{c.first_name}</td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td>{c.hand_phone_no }</td>
                        <td>{c.fax}</td>
                        <td className="text-center">
                        <FaEdit
  style={{ cursor: 'pointer', marginRight: '10px', color: '#0d6efd' }}
  onClick={() => {
    setSelectedContact(c);
    setEditModalOpen(true);
  }}
/>
                          <FaTrash
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => handleDelete(c.contact_id)}
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
          <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
  <ModalHeader toggle={toggleEditModal}>Edit Contact</ModalHeader>
  <ModalBody>
    <Form>
      <FormGroup>
        <Label>Contact Person Name</Label><span className="required"> *</span>
        <Input
          type="text"
          name="first_name"
          value={selectedContact?.first_name || ''}
          onChange={(e) =>
            setSelectedContact({ ...selectedContact, first_name: e.target.value })
          }
        />
      </FormGroup>
      <FormGroup>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={selectedContact?.email || ''}
          onChange={(e) =>
            setSelectedContact({ ...selectedContact, email: e.target.value })
          }
        />
      </FormGroup>
      <FormGroup>
        <Label>Phone</Label>
        <Input
          type="text"
          name="phone"
          value={selectedContact?.phone || ''}
          onChange={(e) =>
            setSelectedContact({ ...selectedContact, phone: e.target.value })
          }
        />
      </FormGroup>
      <FormGroup>
        <Label>Hand Phone No</Label>
        <Input
          type="text"
          name="hand_phone_no"
          value={selectedContact?.hand_phone_no || ''}
          onChange={(e) =>
            setSelectedContact({ ...selectedContact, hand_phone_no: e.target.value })
          }
        />
      </FormGroup>
      <FormGroup>
        <Label>Fax</Label>
        <Input
          type="text"
          name="fax"
          value={selectedContact?.fax || ''}
          onChange={(e) =>
            setSelectedContact({ ...selectedContact, fax: e.target.value })
          }
        />
      </FormGroup>
    </Form>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onClick={handleUpdateContact}>
      Save Changes
    </Button>
    <Button color="secondary" onClick={toggleEditModal}>
      Cancel
    </Button>
  </ModalFooter>
</Modal>

        </ComponentCard>
      </FormGroup>
    </Form>
  );
}


export default ContactDetails;