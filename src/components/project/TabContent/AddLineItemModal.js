import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
} from 'reactstrap';
import moment from 'moment'
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import random from 'random';
import api from '../../../constants/api';
import message from '../../Message';

const AddLineItemModal = ({addLineItemModal, setAddLineItemModal, projectId,projectDetail
,projectClaimId,}) => {
  AddLineItemModal.propTypes = {
    addLineItemModal: PropTypes.bool,
    setAddLineItemModal: PropTypes.func,
    projectId: PropTypes.any,
    projectDetail: PropTypes.any,
    projectClaimId: PropTypes.any,

  };
  //All state Varible
  const [totalAmount, setTotalAmount] = useState(0);
  const [addLineItem, setAddLineItem] = useState([
    {
      id: random.int(1, 99),
      unit: '',
      cum_amount: '',
      current_month_amount: '',
      amount: '',
      remarks: '',
      title: '',
      description: '',
    },
  
  ]);
  
  //Insert Invoice Item
  const addLineItemApi = (obj) => {
    if (obj.title !== '' && obj.description !== '' && obj.amount !== '') {
   
    obj.project_id = projectId;
    obj.project_claim_id = projectClaimId;
    api
      .post('/claim/insertClaimLineItems', obj)
      .then(() => {
        message('Line Item Added Successfully', 'sucess');
       window.location.reload();
      })
      .catch(() => {
        message('Cannot Add Line Items', 'error');
      });
     } else {
        message('Please fill all required fields', 'warning');
      }
    
  };
  //Add new line item
  const AddNewLineItem = () => {
    setAddLineItem([
      ...addLineItem,
      {
       
        id: new Date().getTime().toString(),
        unit: '',
        cum_amount: '',
        current_month_amount: '',
        amount: '',
        remarks: '',
        title: '',
        description: '',
      },
    ]);
  };
  //Invoice item values
  const getAllValues = () => {
    const result = [];
    $('.lineitem tbody tr').each(function input() {
      const allValues = {};
      $(this)
        .find('input')
        .each(function output() {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
        });
        allValues.claim_seq = 'Progress Claim 01';
      result.push(allValues);
    });
    setTotalAmount(0);
    console.log(result);
    result.forEach((element) => {
      addLineItemApi(element);
    });
    console.log(result);
  };
  //Invoice Items Calculation
  // Invoice Items Calculation
const calculateTotal = () => {
  let totalValue = 0;
  let showAlert = false;

  const result = [];
  $('.lineitem tbody tr').each(function input() {
    const allValues = {};
    $(this)
      .find('input')
      .each(function output() {
        const fieldName = $(this).attr('name');
        allValues[fieldName] = $(this).val();
        allValues.cum_amount = allValues.current_month_amount;
      });

    // Check if current month amount exceeds contract amount
    if (parseFloat(allValues.current_month_amount) > parseFloat(allValues.amount)) {
      showAlert = true;
    }

    result.push(allValues);
  });

  if (showAlert) {
    alert('Please enter the current month claim amount less than or equal to the contract amount.');
    return;
  }

  result.forEach((e) => {
    if (e.amount) {
      totalValue += parseFloat(e.cum_amount);
    }
  });

  setAddLineItem(result);
  setTotalAmount(totalValue);
};

  // Clear row value
  const ClearValue = (ind) => {
    setAddLineItem((current) =>
      current.filter((obj) => {
        return obj.id !== ind.id;
      }),
    );
    if (ind.amount) {
      const finalTotal = totalAmount - parseFloat(ind.cum_amount);
      setTotalAmount(finalTotal);
    }
  };
  return (
    <>
      <Modal size="xl" isOpen={addLineItemModal}>
        <ModalHeader>
          Add Pc Items
          <Button
            className="shadow-none"
            color="secondary"
            onClick={() => {
              setAddLineItemModal(false);
            }}
          >
            X
          </Button>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <Form>
                <Row>
                  <Row>
                    <Col md="3">
                      <Button
                        className="shadow-none"
                        color="primary"
                        type="button"
                        onClick={() => {
                          AddNewLineItem();
                        }}
                      >
                        Add Line Item
                      </Button>
                    </Col>
                  </Row>
                  {/* Invoice Item */}
                  
                  <Card>
                  <Row>
                        <Col md="4">
                        <FormGroup>
                        <Label>Date</Label>
                        <Input type="date" name="date" value={moment(new Date()).format('YYYY-MM-DD')} />

                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                        <Label>Project</Label>
                        <Input name="project"  type="text" value={ projectDetail &&  projectDetail.title} disabled/>
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                        <Label>Claim Sequence</Label>
                        <Input name="claim_seq"  type="text" value='Progress Claim 01'/>
                        </FormGroup>
                    </Col>
                        </Row>
                    <table className="lineitem">
                      <thead>
                        <tr>
                          <th scope="col">Title </th>
                          <th scope="col">Description </th>
                          <th scope="col">Contract Amount </th>
                          <th scope="col">This Month Amount</th>
                          <th scope="col">Cum Amount</th>
                          <th scope="col">Remarks</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {addLineItem &&
                          addLineItem.map((item) => {
                            return (
                              <tr key={item.id}>
                                <td data-label="Title">
                                  <Input Value={item.title} type="text" name="title" style={{ width: '100%' }} />
                                </td>
                                <td data-label="Description">
                                  <Input Value={item.description} type="textArea" name="description"style={{ width: '100%' }} />
                                </td>
                               
                                <td data-label="Contract Amount">
                                  <Input
                                    value={item.amount}
                                    type="number"
                                    name="amount"
                                    style={{ width: '70%' }}
                                    onChange={(e) => {
                                      const enteredAmount = e.target.value;
                                      const calculatedCumAmount =  '0.00';

                                      setAddLineItem((prevItems) => {
                                        const updatedItems = prevItems.map((prevItem) =>
                                          prevItem.id === item.id ? { ...prevItem, amount: enteredAmount, cum_amount: calculatedCumAmount } : prevItem
                                        );
                                        return updatedItems;
                                      });
                                    }}
                                  />
                                </td>
                                <td data-label="This month Amount">
                                  <Input
                                    Value={item.current_month_amount}
                                    onBlur={() => {
                                      calculateTotal();
                                    }}
                                    type="number"
                                    name="current_month_amount"
                                    style={{ width: '70%' }}
                                  />
                                </td>
                                <td data-label="Amount">
                                  <Input Value={item.cum_amount} type="text" name="cum_amount" disabled style={{ width: '70%' }}/>
                                </td>
                                <td data-label="Remarks">
                                  <Input Value={item.remarks} type="text" name="remarks" style={{ width: '100%' }}/>
                                </td>
                                <td data-label="Action">
                                  
                                    <Input type="hidden" name="id" Value={item.id}></Input>
                                    <span className='addline'
                                      onClick={() => {
                                        ClearValue(item);
                                      }}
                                    >
                                      Clear
                                    </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </Card>
                  <ModalFooter>
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        getAllValues();
                      }}
                    >
                      {' '}
                      Submit{' '}
                    </Button>
                    <Button
                      className="shadow-none"
                      color="secondary"
                      onClick={() => {
                        setAddLineItemModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </Row>
              </Form>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};
export default AddLineItemModal;
