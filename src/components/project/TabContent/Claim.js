import React, { useState, useEffect } from 'react';
import { CardTitle, Row, Col, Form, FormGroup, Label, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import moment from 'moment';
import ComponentCard from '../../ComponentCard';
import api from '../../../constants/api';
import message from '../../Message';
import NewPcModal from '../../ProjectModal/NewPcModal';
import ClaimItems from '../../ProjectModal/ClaimItems';
import EditClaimModal from '../../ProjectModal/EditClaimModal';
import EditPc from '../../ProjectModal/EditPc';
import AddLineItemModal from './AddLineItemModal';
import AttachmentModalV2 from '../../Tender/AttachmentModalV2';
import ViewFileComponentV2 from '../../ProjectModal/ViewFileComponentV2';

const Claim = ({
  projectDetail,
  projectId,
  checkId,
  deliveryData,
  editPo,
  POId,
  attachmentModal,
  setAttachmentModal,
  RoomName,
  setRoomName,
  fileTypes,
  setFileTypes,
  attachmentData,
  dataForAttachment,
}) => {
  Claim.propTypes = {
    projectDetail: PropTypes.any,
    projectId: PropTypes.any,
    checkId: PropTypes.any,
    deliveryData: PropTypes.any,
    editPo: PropTypes.any,
    POId: PropTypes.any,
    attachmentModal: PropTypes.any,
    setAttachmentModal: PropTypes.any,
    RoomName: PropTypes.any,
    setRoomName: PropTypes.any,
    fileTypes: PropTypes.any,
    setFileTypes: PropTypes.any,
    attachmentData: PropTypes.any,
    dataForAttachment: PropTypes.any,
  };

  const [newPcModal, setNewPcModal] = useState(false);
  const [editPcModal, setEditPcModal] = useState(false);
  const [pcItems, setPcItems] = useState(false);
  const [editClaimModal, setEditClaimModal] = useState(false);
  const [claimData, setClaimData] = useState({});
  const [claimData1, setClaimData1] = useState({});
  const [pcId, setPcId] = useState();
  const [pc, setPc] = useState();
  const [addLineItemModal, setAddLineItemModal] = useState(false);


  // Get ProjectClaim By ProjectId
  const getProjectClaimById = () => {
    api
      .post('/claim/TabClaimPortal', { project_id: projectId })
      .then((res) => {
        setClaimData(res.data.data[0]);
      })
      .catch(() => {
        message('Project claim not found', 'info');
      });
  };

    // Get ProjectClaim By ProjectId
    const getClaimById = () => {
      api
        .post('/claim/getamountclaim', { project_id: projectId })
        .then((res) => {
          setClaimData1(res.data.data[0]);
        })
        .catch(() => {
          message('Projsdect claim not found', 'info');
        });
    };
    console.log('or11111111111111dr',claimData1?.claimAmount)

  //insert project claim
  const insertProjectClaim = (code) => {
    const newclaim = {};
    newclaim.claim_date = new Date();
    newclaim.claim_no = code;
    newclaim.project_id = projectId;
    newclaim.status = 'In Progress';
    newclaim.amount = 0.0;
    newclaim.project_title = projectDetail.title;
    api.post('/claim/insertProjectClaim', newclaim).then(() => {
      message('Claim added successfully', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
  };
  const generateCodes = () => {
    api
      .post('/tender/getCodeValue', { type: 'claim' })
      .then((res) => {
        insertProjectClaim(res.data.data);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 900);
      })
      .catch(() => {
        insertProjectClaim('');
      });
  };
  useEffect(() => {
    getProjectClaimById();
    getClaimById();
  }, [projectId]);

  return (
    <>
      {newPcModal && (
        <NewPcModal
          pc={projectDetail}
          projectClaimId={pcId}
          newPcModal={newPcModal}
          setNewPcModal={setNewPcModal}
        />
      )}

      {!claimData && (
        <Row className="mb-4">
          <Col md="2">
            <Button
              color="primary"
              className="shadow-none"
              onClick={(e) => {
                if (window.confirm('Are you sure you want to add a claim? ')) {
                  generateCodes();
                } else {
                  e.preventDefault();
                }
              }}
            >
              Add Claim
            </Button>
          </Col>
        </Row>
      )}
      {claimData && (
        <>
          <Row className="mb-4">
            <Col md="2">
              <Button
                color="primary"
                className="shadow-none"
                onClick={() => {
                  setPcId(claimData.project_claim_id);
                  setNewPcModal(true);
                }}
              >
                New PC
              </Button>
            </Col>
          </Row>

          <Row>
            <CardTitle tag="h4" className="border-bottom bg-dark p-2 mb-0 text-white">
              Claim
            </CardTitle>
          </Row>

          <Form className="mt-4">
            <Row className="border-bottom mb-3">
              <Col>
                <FormGroup>
                  <Label>Code</Label>{' '}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Date</Label>{' '}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Title</Label>{' '}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Action</Label>{' '}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Status</Label>{' '}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Amount</Label>{' '}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Action</Label>{' '}
                </FormGroup>
              </Col>
              <Col></Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>{claimData.claim_no}</FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  {claimData.claim_date ? moment(claimData.claim_date).format('DD-MM-YYYY') : ''}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>{claimData.project_title}</Label>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>
                    <div className="anchor">
                      <span
                        onClick={() => {
                          setPcId(claimData.project_claim_id);
                          setPc(claimData);
                          setEditClaimModal(true);
                        }}
                      >
                        <Icon.Edit />
                      </span>
                      {' '}
                      
                      {claimData.amount === 0 && (  
              <span
                onClick={() => {
                  setPcId(claimData.project_claim_id);
                  setAddLineItemModal(true);
                }}
              >
                <Icon.PlusCircle />
              </span>
                            )}

                    </div>
                  </Label>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>{claimData.status}</Label>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>{claimData.amount}</Label>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>
                    <div className="anchor">
                      <span
                        onClick={() => {
                          setPcId(claimData.project_claim_id);
                          setPcItems(!pcItems);
                        }}
                      >
                        View Pc items
                      </span>
                    </div>
                  </Label>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>
                    <div className="anchor">
                      <span
                        onClick={() => {
                          setPcId(claimData.project_claim_id);
                          setEditPcModal(true);
                        }}
                      >
                        Edit Pc
                      </span>
                    </div>
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </>
      )}
      <AddLineItemModal
                  projectId={projectId}
                  projectDetail={projectDetail}
                  projectClaimId={pcId}
                  addLineItemModal={addLineItemModal}
                  setAddLineItemModal={setAddLineItemModal}
                ></AddLineItemModal>
      {editClaimModal && (
        <EditClaimModal
          projectId={projectId}
          projectClaimId={pcId}
          editClaimModal={editClaimModal}
          setEditClaimModal={setEditClaimModal}
          pc={pc}
        />
      )}
      {editPcModal && (
        <EditPc
          editPcModal={editPcModal}
          setEditPcModal={setEditPcModal}
          pc={projectDetail}
          projectClaimId={pcId}
        />
      )}
      {pcItems && (
        <ClaimItems
          projectId={projectId}
          projectClaimId={pcId}
          checkId={checkId}
          POId={POId}
          projectDetail={projectDetail}
          deliveryData={deliveryData}
          editPo={editPo}
        />
      )}
      <Col xs="12" md="10">
        <Form>
          <FormGroup>
            <ComponentCard title="Claim Attachment">
              <Row>
                <Col xs="12" md="4" className="mb-3">
                  <Button
                    className="shadow-none"
                    color="primary"
                    onClick={() => {
                      setRoomName('Claim');
                      setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF', 'PDF']);
                      dataForAttachment();
                      setAttachmentModal(true);
                    }}
                  >
                    <Icon.File className="rounded-circle" width="20" />
                  </Button>
                </Col>
              </Row>

              <AttachmentModalV2
                moduleId={projectId}
                attachmentModal={attachmentModal}
                setAttachmentModal={setAttachmentModal}
                roomName={RoomName}
                fileTypes={fileTypes}
                altTagData="Claim Data"
                desc="Claim Data"
                recordType="Picture"
                mediaType={attachmentData.modelType}
              />
              <ViewFileComponentV2
                moduleId={projectId}
                roomName="Claim"
                recordType="Picture"
              />
            </ComponentCard>
          </FormGroup>
        </Form>
      </Col>
    </>
  );
};

export default Claim;
