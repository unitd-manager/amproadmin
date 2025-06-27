import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import ComponentCard from '../ComponentCard';



export default function ProductDetail({ productDetails, handleInputs,categorydropdown, departmentdropdown, subcategorydropdown, branddropdown, supplierdropdown }) {
    ProductDetail.propTypes = {
    productDetails: PropTypes.object,
    handleInputs: PropTypes.func,
    categorydropdown: PropTypes.array,
    departmentdropdown: PropTypes.array,
    subcategorydropdown: PropTypes.array,
    branddropdown: PropTypes.array,
    supplierdropdown: PropTypes.array,
  };
  return (
    <>
      <Form>
        <FormGroup>
        <ComponentCard title="Product Details" creationModificationDate={productDetails}>
            <ToastContainer></ToastContainer>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label> Product code </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.product_code}
                    name="product_code"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Product Name </Label><span className="required"> *</span>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.title}
                    name="title"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  {/* Category title from Category table */}
                  <Label>Department</Label>
                  <Input
                    type="select"
                    name="department_cli_id"
                    value={productDetails && productDetails.department_id}
                    onChange={handleInputs}
                  >
                    <option defaultValue="selected">Please Select</option>
                    {departmentdropdown &&
                      departmentdropdown.map((ele) => {
                        return (
                          <option key={ele.department_cli_id} value={ele.department_cli_id}>
                            {ele.department_name}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  {/* Category title from Category table */}
                  <Label>Category</Label>
                  <Input
                    type="select"
                    name="category_id"
                    value={productDetails && productDetails.category_id}
                    onChange={handleInputs}
                  >
                    <option defaultValue="selected">Please Select</option>
                    {categorydropdown &&
                      categorydropdown.map((ele) => {
                        return (
                          <option key={ele.category_id} value={ele.category_id}>
                            {ele.category_title}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  {/* Category title from Category table */}
                  <Label>Sub Category</Label>
                  <Input
                    type="select"
                    name="sub_category_id"
                    value={productDetails && productDetails.sub_category_id}
                    onChange={handleInputs}
                  >
                    <option defaultValue="selected">Please Select</option>
                    {subcategorydropdown &&
                      subcategorydropdown.map((ele) => {
                        return (
                          <option key={ele.sub_category_id} value={ele.sub_category_id}>
                            {ele.sub_category_title}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  {/* Category title from Category table */}
                  <Label>Brand</Label>
                  <Input
                    type="select"
                    name="brand_id"
                    value={productDetails && productDetails.brand_id}
                    onChange={handleInputs}
                  >
                    <option defaultValue="selected">Please Select</option>
                    {branddropdown &&
                      branddropdown.map((ele) => {
                        return (
                          <option key={ele.brand_id} value={ele.brand_id}>
                            {ele.brand_name}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  {/* Category title from Category table */}
                  <Label>Supplier</Label>
                  <Input
                    type="select"
                    name="supplier_id"
                    value={productDetails && productDetails.supplier_id}
                    onChange={handleInputs}
                  >
                    <option defaultValue="selected">Please Select</option>
                    {supplierdropdown &&
                      supplierdropdown.map((ele) => {
                        return (
                          <option key={ele.supplier_id} value={ele.supplier_id}>
                            {ele.company_name}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md="3">
                <FormGroup>
                  <Label>Product Type</Label>
                  <Input
                    type="select"
                    onChange={handleInputs}
                    value={productDetails && productDetails.product_type}
                    name="product_type"
                  >
                    <option defaultValue="selected"> Please Select </option>
                    <option value="Stock Item">Stock Item</option>
                    <option value="Non Stock Item">Non Stock Item</option>
                    <option value="Service Item">Service Item</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label> Tax Percentage </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.tax_percentage}
                    name="tax_percentage"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Display Order </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.display_order}
                    name="display_order"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Purchase UOM </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.purchase_uom}
                    name="purchase_uom"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Sales UOM </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.sales_uom}
                    name="sales_uom"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Pcs/Carton</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.pcs_per_carton}
                    name="pcs_per_carton"
                  />
                </FormGroup>
              </Col>
              {/* <Col md="3">
                <FormGroup>
                  <Label>Unit</Label>
                  <Input
                    type="select"
                    value={productDetails && productDetails.unit}
                    name="unit"
                    onChange={handleInputs}
                  >
                    <option defaultValue="selected">Please Select</option>
                    <option value="Box">Box</option>
                    <option value="Piece">Piece</option>
                    <option value="Kg">Kg</option>
                  </Input>
                </FormGroup>
              </Col> */}
 
              <Col md="3">
                <FormGroup>
                  <Label> Weight </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.product_weight}
                    name="product_weight"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Purchase Unit Cost </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.purchase_unit_cost}
                    name="purchase_unit_cost"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Operation Cost</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.operation_cost}
                    name="operation_cost"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Retail Price </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.retail_price}
                    name="retail_price"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Min Retail Price</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.min_retail_price}
                    name="min_retail_price"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> WholeSale Price </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.wholesale_price}
                    name="wholesale_price"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Min WholeSale Price </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.min_wholesale_price}
                    name="min_wholesale_price"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Carton Price </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.carton_price}
                    name="carton_price"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Min Carton Price </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.min_carton_price}
                    name="min_carton_price"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Style/Fabric </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.style_fabric}
                    name="style_fabric"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Model No </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.model_no}
                    name="model_no"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Carton Weight </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.carton_weight}
                    name="carton_weight"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> M3 Per Carton  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.m3_per_carton}
                    name="m3_per_carton"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Bin </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.bin}
                    name="bin"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> Remarks/Other Name </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={productDetails && productDetails.remarks}
                    name="remarks"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <Label>Show On Purchase</Label>
                <FormGroup>
                  <Label>Yes</Label>
                  &nbsp;
                  <Input
                    name="show_on_purchase"
                    value="1"
                    type="radio"
                    defaultChecked={productDetails && productDetails.show_on_purchase === 1 && true}
                    onChange={handleInputs}
                  />
                  &nbsp; &nbsp;
                  <Label>No</Label>
                  &nbsp;
                  <Input
                    name="show_on_purchase"
                    value="0"
                    type="radio"
                    defaultChecked={productDetails && productDetails.show_on_purchase === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <Label>Show On Sales</Label>
                <FormGroup>
                  <Label>Yes</Label>
                  &nbsp;
                  <Input
                    name="show_on_sales"
                    value="1"
                    type="radio"
                    defaultChecked={productDetails && productDetails.show_on_sales === 1 && true}
                    onChange={handleInputs}
                  />
                  &nbsp; &nbsp;
                  <Label>No</Label>
                  &nbsp;
                  <Input
                    name="show_on_sales"
                    value="0"
                    type="radio"
                    defaultChecked={productDetails && productDetails.show_on_sales === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <Label>Is Ative</Label>
                <FormGroup>
                  <Label>Yes</Label>
                  &nbsp;
                  <Input
                    name="is_active"
                    value="1"
                    type="radio"
                    defaultChecked={productDetails && productDetails.is_active === 1 && true}
                    onChange={handleInputs}
                  />
                  &nbsp; &nbsp;
                  <Label>No</Label>
                  &nbsp;
                  <Input
                    name="is_active"
                    value="0"
                    type="radio"
                    defaultChecked={productDetails && productDetails.is_active === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <Label>EProcurement</Label>
                <FormGroup>
                  <Label>Yes</Label>
                  &nbsp;
                  <Input
                    name="eprocurement"
                    value="1"
                    type="radio"
                    defaultChecked={productDetails && productDetails.eprocurement === 1 && true}
                    onChange={handleInputs}
                  />
                  &nbsp; &nbsp;
                  <Label>No</Label>
                  &nbsp;
                  <Input
                    name="eprocurement"
                    value="0"
                    type="radio"
                    defaultChecked={productDetails && productDetails.eprocurement === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              
              <Col md="3">
                <Label>Ecommerce</Label>
                <FormGroup>
                  <Label>Yes</Label>
                  &nbsp;
                  <Input
                    name="ecommerce"
                    value="1"
                    type="radio"
                    defaultChecked={productDetails && productDetails.ecommerce === 1 && true}
                    onChange={handleInputs}
                  />
                  &nbsp; &nbsp;
                  <Label>No</Label>
                  &nbsp;
                  <Input
                    name="ecommerce"
                    value="0"
                    type="radio"
                    defaultChecked={productDetails && productDetails.ecommerce === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <Label>Show On POS</Label>
                <FormGroup>
                  <Label>Yes</Label>
                  &nbsp;
                  <Input
                    name="show_on_pos"
                    value="1"
                    type="radio"
                    defaultChecked={productDetails && productDetails.show_on_pos === 1 && true}
                    onChange={handleInputs}
                  />
                  &nbsp; &nbsp;
                  <Label>No</Label>
                  &nbsp;
                  <Input
                    name="show_on_pos"
                    value="0"
                    type="radio"
                    defaultChecked={productDetails && productDetails.show_on_pos === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
       
        </FormGroup>
      </Form>
     
     
    </>
  );
}
