import React, { useState, useContext, useEffect } from 'react';
import {
  Row, Col, FormGroup, Input, Button, Modal, ModalFooter,
  ModalBody, NavItem, NavLink, Nav, TabPane, TabContent, Label,
} from 'reactstrap';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import PropTypes from 'prop-types';
import message from '../Message';
import ComponentCard from '../ComponentCard';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

export default function EcommerceSetting({ ProductId, addPurchaseOrderModal, setAddPurchaseOrderModal }) {
  EcommerceSetting.propTypes = {
    ProductId: PropTypes.any,
    addPurchaseOrderModal: PropTypes.bool,
    setAddPurchaseOrderModal: PropTypes.func,
  };

  const [activeTab, setActiveTab] = useState('1');
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [clientForms, setClientForms] = useState({});
  const [isExisting, setIsExisting] = useState(false);
  const { loggedInuser } = useContext(AppContext);

  const handleClientForms = (e) => {
    const { name, value } = e.target;
    setClientForms((prev) => ({ ...prev, [name]: value }));
  };

  const handleDataEditor = (e, type) => {
    setClientForms((prev) => ({
      ...prev,
      [type]: draftToHtml(convertToRaw(e.getCurrentContent())),
    }));
  };

  const convertHtmlToDraft = (html) => {
    const contentBlock = htmlToDraft(html || '');
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setDescription(editorState);
    }
  };

  const saveClientForm = () => {
    if (clientForms.product_label && ProductId) {
      const payload = {
        ...clientForms,
        product_id: ProductId,
        specification: clientForms.specification || draftToHtml(convertToRaw(description.getCurrentContent())),
        modified_by: loggedInuser.first_name,
        modification_date: creationdatetime,
      };

      if (isExisting) {
        // Update
        api.post('/product/editEcommerceData', payload)
          .then(() => {
            message('Ecommerce data updated successfully.', 'success');
            setAddPurchaseOrderModal(false);
          })
          .catch(() => message('Update failed.', 'error'));
      } else {
        // Insert only if no existing record
        payload.created_by = loggedInuser.first_name;
        payload.creation_date = creationdatetime;

        api.post('/product/insertEcommerceSettingDatas', payload)
          .then(() => {
            message('Ecommerce data inserted successfully.', 'success');
            setIsExisting(true); // Set to true so future inserts do not happen again
            setAddPurchaseOrderModal(false);
          })
          .catch(() => message('Insert failed.', 'error'));
      }
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  const loadEcommerceData = () => {
    if (!ProductId) return;

    api.post('/product/EcommerceDataByProductId', { product_id: ProductId })
      .then((res) => {
        if (res.data.data.length > 0) {
          const data = res.data.data[0];
          setClientForms(data);
          convertHtmlToDraft(data.specification);
          setIsExisting(true);
        } else {
          setClientForms({});
          setIsExisting(false);
        }
      })
      .catch(() => message('Error loading ecommerce data', 'error'));
  };

  useEffect(() => {
    if (ProductId) loadEcommerceData();
  }, [ProductId]);

  return (
    <Modal size="xl" isOpen={addPurchaseOrderModal} toggle={() => setAddPurchaseOrderModal(false)}>
      <ModalBody>
        <ComponentCard>
          <Nav tabs>
            <NavItem>
              <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
                Ecommerce Setting
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
                Specification
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}>
                Related Products
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-3">
            <TabPane tabId="1">
              <Row>
                <Col md="3"><FormGroup><Label>Product Label</Label><Input type="text" name="product_label" value={clientForms.product_label || ''} onChange={handleClientForms} /></FormGroup></Col>
                <Col md="3"><FormGroup><Label>Description</Label><Input type="textarea" name="description" value={clientForms.description || ''} onChange={handleClientForms} /></FormGroup></Col>
                <Col md="3"><FormGroup><Label>Price</Label><Input type="text" name="price" value={clientForms.price || ''} onChange={handleClientForms} /></FormGroup></Col>
                <Col md="3"><FormGroup><Label>Available Qty</Label><Input type="text" name="available_qty" value={clientForms.available_qty || ''} onChange={handleClientForms} /></FormGroup></Col>
                <Col md="3"><FormGroup><Label>Meat Slug</Label><Input type="text" name="meat_slug" value={clientForms.meat_slug || ''} onChange={handleClientForms} /></FormGroup></Col>
                <Col md="3"><FormGroup><Label>Meat Description</Label><Input type="textarea" name="meat_description" value={clientForms.meat_description || ''} onChange={handleClientForms} /></FormGroup></Col>
                <Col md="3"><FormGroup><Label>Meat Keywords</Label><Input type="text" name="meat_keywords" value={clientForms.meat_keywords || ''} onChange={handleClientForms} /></FormGroup></Col>

                <Col md="3">
                  <Label>Stock Not Available</Label>
                  <FormGroup>
                    <Label>Yes</Label>
                    <Input name="stock_not_available" type="radio" value="1" checked={clientForms.stock_not_available === '1' || clientForms.stock_not_available === 1} onChange={handleClientForms} />
                    &nbsp;&nbsp;
                    <Label>No</Label>
                    <Input name="stock_not_available" type="radio" value="0" checked={clientForms.stock_not_available === '0' || clientForms.stock_not_available === 0} onChange={handleClientForms} />
                  </FormGroup>
                </Col>

                <Col md="3">
                  <Label>Check Available Stock</Label>
                  <FormGroup>
                    <Label>Yes</Label>
                    <Input name="check_available_stock" type="radio" value="1" checked={clientForms.check_available_stock === '1' || clientForms.check_available_stock === 1} onChange={handleClientForms} />
                    &nbsp;&nbsp;
                    <Label>No</Label>
                    <Input name="check_available_stock" type="radio" value="0" checked={clientForms.check_available_stock === '0' || clientForms.check_available_stock === 0} onChange={handleClientForms} />
                  </FormGroup>
                </Col>
              </Row>
              <ModalFooter>
                <Button color="primary" onClick={saveClientForm}>Save</Button>
              </ModalFooter>
            </TabPane>

            <TabPane tabId="2">
              <ComponentCard title="Specification">
                <Editor
                  editorState={description}
                  wrapperClassName="demo-wrapper mb-0"
                  editorClassName="demo-editor border mb-4 edi-height"
                  onEditorStateChange={(e) => {
                    handleDataEditor(e, 'specification');
                    setDescription(e);
                  }}
                />
              </ComponentCard>
              <ModalFooter>
                <Button color="primary" onClick={saveClientForm}>Save</Button>
              </ModalFooter>
            </TabPane>

            <TabPane tabId="3">
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label>Group Name</Label>
                    <Input type="text" name="group_name" value={clientForms.group_name || ''} onChange={handleClientForms} />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Group Description</Label>
                    <Input type="text" name="group_description" value={clientForms.group_description || ''} onChange={handleClientForms} />
                  </FormGroup>
                </Col>
              </Row>
              <ModalFooter>
                <Button color="primary" onClick={saveClientForm}>Save</Button>
              </ModalFooter>
            </TabPane>
          </TabContent>
        </ComponentCard>
      </ModalBody>
    </Modal>
  );
}
