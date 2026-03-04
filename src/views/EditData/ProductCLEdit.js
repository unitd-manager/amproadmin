import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Form, FormGroup, Button, TabContent, TabPane, Label, Input } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import * as Icon from 'react-feather';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import Tab from '../../components/ProjectTabs/Tab';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import ProductEditButtons from '../../components/Product/ProductCLEditButtons';
import ProductUOM from '../../components/Product/ProductUom';
import ProductVariation from '../../components/Product/ProductVariation';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import ProductDetail from '../../components/ProductTable/ProductDetail';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';
import ProductAnalysis from '../../components/ProductTable/ProductAnalysis';
import EcommerceSetting from '../../components/ProductTable/EcommerceSetting';
import Stock from '../../components/ProductTable/Stock';
import ProductStockMovement from '../../components/Product/ProductStockMovement';
import ContactPriceButton from '../../components/ProductTable/ContactPriceButton';
import BarCode from '../../components/ProductTable/BarCode';

const ProductUpdate = () => {
  // All state variables
  const [productDetails, setProductDetails] = useState();
  const [categorydropdown, setCategoryDropdown] = useState([]);
  const [departmentdropdown, setDepartmentDropdown] = useState([]);
  const [subcategorydropdown, setSubCategoryDropdown] = useState([]);
  const [branddropdown, setBrandDropdown] = useState([]);
  const [supplierdropdown, setSupplierDropdown] = useState([]);
  const [productDescription, setProductDescription] = useState('');
  const [RoomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState('');
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [barcodeModal, setBarcodeModal] = useState(false);
  const [ecommerceModal, setEcommerceModal] = useState(false);
  const [contactPriceModal, setContactPriceModal] = useState(false);

  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  const [activeTab, setActiveTab] = useState('1');
  // Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);

  //Setting data in productDetails
  const handleInputs = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };
  //setting data in Description Modal productDetails
  const handleDataEditor = (e, type) => {
    setProductDetails({
      ...productDetails,
      [type]: draftToHtml(convertToRaw(e.getCurrentContent())),
    });
  };

  const tabs = [
     { id: '1', name: 'Product Description'},
    
    { id: '2', name: 'Image'},
    { id: '3', name: 'BarCode'},
    { id: '4', name: 'Product UOM'},
    { id: '5', name: 'Product Variation'},
    { id: '6', name: 'Analysis'},
     { id: '7', name: 'Ecommerce Settings'},
     { id: '8', name: 'Contact Price'},
     { id: '9', name: 'Product Stock Movement'},

  ];
  const toggle = (tab) => {
    if (tab === '8') {
      setContactPriceModal(true);
      return;
    }
    if (activeTab !== tab) setActiveTab(tab);
  };
  const toggletype = () => {
    setBarcodeModal(!barcodeModal);
  };
  const toggletypess = () => {
    setEcommerceModal(!ecommerceModal);
  };
  //Description Modal
  const convertHtmlToDraft = (existingQuoteformal) => {
    const contentBlock = htmlToDraft(existingQuoteformal && existingQuoteformal);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setProductDescription(editorState);
    }
  };

  // Get Product data By product id
  const getProductById = () => {
    api
      .post('/product/getProduct', { product_id: id })
      .then((res) => {
        setProductDetails(res.data.data[0]);
        convertHtmlToDraft(res.data.data[0].product_description);
      })
       .catch(() => {});
  };
  
  //Edit Product
  const editProductData = () => {
    if (productDetails.title !== '') {
      productDetails.modification_date = creationdatetime;
      productDetails.modified_by = loggedInuser.first_name;
      api
        .post('/product/edit-Product', productDetails)
        .then(() => {
          message('Record edited successfully', 'success');
        
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  // getting data from Category
  const getCategory = () => {
    api
      .get('/product/getCategory')
      .then((res) => {
        setCategoryDropdown(res.data.data);
      })
      .catch(() => {
        message('Unable to get categories', 'error');
      });
  };

  // getting data from SubCategory
  const getSubCategory = () => {
    api
      .get('/product/getSubCategory')
      .then((res) => {
        setSubCategoryDropdown(res.data.data);
      })
      .catch(() => {
        message('Unable to get Subcategories', 'error');
      });
  };

  // getting data from Category
  const getBrand = () => {
    api
      .get('/product/getBrand')
      .then((res) => {
        setBrandDropdown(res.data.data);
      })
      .catch(() => {
        message('Unable to get Brand', 'error');
      });
  };

  // getting data from Department
  const getDepartment = () => {
    api
      .get('/product/getDepartmentCli')
      .then((res) => {
        setDepartmentDropdown(res.data.data);
      })
      .catch(() => {
        message('Unable to get Department', 'error');
      });
  };
// getting data from SubCategory
const getSupplier = () => {
  api
    .get('/product/getSupplier')
    .then((res) => {
      setSupplierDropdown(res.data.data);
    })
    .catch(() => {
      message('Unable to get supplier', 'error');
    });
};

  //Attachments
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
    console.log('inside DataForAttachment');
  };

  
  useEffect(() => {
    getCategory();
    getProductById();
    getDepartment();
    getSubCategory();
    getBrand();
    getSupplier();
  }, [id]);

  return (
    <>
      <BreadCrumbs heading={productDetails && productDetails.title} />
      <Form>
        <FormGroup>
           
          <ProductEditButtons id={id} editProductData={editProductData} navigate={navigate} />
          {/* Product Details Form */}
          
     
      </FormGroup>
      </Form>
      {/* New Card with Tabs for Product and Stock */}
      <ComponentCard>
        {/* Product Code and Product Name at the top of the card */}
        <div className="d-flex mb-3 gap-3">
          <div style={{ flex: 1 }}>
            <FormGroup>
              <Label for="product_code">Product Code</Label>
              <Input
                id="product_code"
                name="product_code"
                type="text"
                value={productDetails?.product_code || ''}
                onChange={handleInputs}
                disabled
              />
            </FormGroup>
          </div>
          <div style={{ flex: 2 }}>
            <FormGroup>
              <Label for="product_title">Product Name</Label>
              <Input
                id="product_title"
                name="title"
                type="text"
                value={productDetails?.title || ''}
                onChange={handleInputs}
                required
              />
            </FormGroup>
          </div>
        </div>
        <Tab
          tabs={[{ id: 'product', name: 'Product' }, { id: 'stock', name: 'Stock' }]}
          toggle={setActiveTab}
          activeTab={activeTab}
        />
        <TabContent activeTab={activeTab} className="p-3">
          <TabPane tabId="product">
            <ProductDetail
              productDetails={productDetails}
              handleInputs={handleInputs}
              categorydropdown={categorydropdown}
              departmentdropdown={departmentdropdown}
              subcategorydropdown={subcategorydropdown}
              branddropdown={branddropdown}
              supplierdropdown={supplierdropdown}
            />
          </TabPane>
          <TabPane tabId="stock">
            <Stock
              ProductId={id}
              getProductById={getProductById}
              productDetails={productDetails}
            />
          </TabPane>
        </TabContent>
      </ComponentCard>
        {/* Delivery address Form */}
        <ComponentCard title="More Details">
        <Tab toggle={toggle} tabs={tabs} />
         <TabContent className="p-4" activeTab={activeTab}>
          <TabPane tabId="1">
                <Editor
                  editorState={productDescription}
                  wrapperClassName="demo-wrapper mb-0"
                  editorClassName="demo-editor border mb-4 edi-height"
                  onEditorStateChange={(e) => {
                    handleDataEditor(e, 'product_description');
                    setProductDescription(e);
                  }}
                />
        </TabPane>


        {/* Customer Details Form */}
        {/* <TabPane tabId="2">
          <ComponentCard title="Product Color">
          <ProductColor
           projectId={id}
          ></ProductColor>
          </ComponentCard>
        </TabPane>
        <TabPane tabId="3">
          <ComponentCard title="Product Size">
          <ProductSize
            projectId={id}
          ></ProductSize>
          </ComponentCard>
        </TabPane> */}
        <TabPane tabId="2">
            <Row>
              <Col xs="12" md="3" className="mb-3">
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={() => {
                    setRoomName('Product');
                    setFileTypes(['JPG', 'PNG', 'GIF', 'PDF']);
                    dataForAttachment();
                    setAttachmentModal(true);
                  }}
                >
                  <Icon.File className="rounded-circle" width="20" />
                </Button>
              </Col>
            </Row>
            <AttachmentModalV2
              moduleId={id}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              roomName={RoomName}
              fileTypes={fileTypes}
              altTagData="ProductRelated Data"
              desc="ProductRelated Data"
              recordType="RelatedPicture"
              mediaType={attachmentData.modelType}
            />
            <ViewFileComponentV2 moduleId={id} roomName="Product" recordType="RelatedPicture" />
        </TabPane>
         <TabPane tabId="3">
        <Col md="3" className="addNew">
                    <Button color="primary" className="shadow-none" onClick={toggletype.bind(null)}>
                        Add New
                    </Button>
                  </Col>
              <BarCode
                ProductId={id}
                addPurchaseOrderModal={barcodeModal}
                setAddPurchaseOrderModal={setBarcodeModal}
                productDetails={productDetails}
              ></BarCode> 
        </TabPane> 
        <TabPane tabId="4">
    <ProductUOM productId={id} />
</TabPane>
<TabPane tabId="5">
 
    <ProductVariation productId={id} />
</TabPane>

        <TabPane tabId="6">
 
    <ProductAnalysis productId={id} />
</TabPane>
 <TabPane tabId="7">
 
     <Col md="3" className="addNew">
                    <Button color="primary" className="shadow-none" onClick={toggletypess.bind(null)}>
                        Add New
                    </Button>
                  </Col>
              <EcommerceSetting
                ProductId={id}
                addPurchaseOrderModal={ecommerceModal}
                setAddPurchaseOrderModal={setEcommerceModal}
                productDetails={productDetails}
              ></EcommerceSetting> 
        </TabPane>
        <TabPane tabId="9">
          
            <ProductStockMovement productId={id} />
        </TabPane>
      </TabContent>
      </ComponentCard>
      <ContactPriceButton
        productId={id}
        isOpen={contactPriceModal}
        onClose={() => setContactPriceModal(false)}
        productName={productDetails?.title || ''}
      />
    </>

  );
};
export default ProductUpdate;
