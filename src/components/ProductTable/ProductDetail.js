import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';

// Custom switch style
const switchStyle = {
  width: 40,
  height: 22,
  background: '#e0e0e0',
  borderRadius: 12,
  position: 'relative',
  display: 'inline-block',
  marginLeft: 8,
  marginRight: 8,
  verticalAlign: 'middle',
};
const sliderStyle = (checked) => ({
  position: 'absolute',
  left: checked ? 20 : 2,
  top: 2,
  width: 18,
  height: 18,
  background: checked ? '#00bfff' : '#fff',
  borderRadius: '50%',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  transition: 'left 0.2s',
});

function Switch({ checked, onChange, name }) {
  return (
    <span
      style={switchStyle}
      onClick={() => onChange({ target: { name, value: !checked } })}
    >
      <span style={sliderStyle(checked)} />
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange({ target: { name, value: e.target.checked } })
        }
        name={name}
        style={{
          opacity: 0,
          width: 40,
          height: 22,
          position: 'absolute',
          left: 0,
          top: 0,
          margin: 0,
          cursor: 'pointer',
        }}
        tabIndex={-1}
      />
    </span>
  );
}

Switch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default function ProductDetail({
  productDetails,
  handleInputs,
  categorydropdown,
  departmentdropdown,
  subcategorydropdown,
  branddropdown,
  supplierdropdown,
}) {
  if (!productDetails) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        No product data available.
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Form>
       
          {/* Product Code/Name at top */}
          {/* Two-column grid for product details */}
          <Row>
            <Col md="6">
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Department *
                </Label>
                <Col sm={7}>
                  <Input
                    type="select"
                    name="department"
                    value={productDetails.department || ''}
                    onChange={handleInputs}
                  >
                    <option value="">Select</option>
                    {departmentdropdown.map((d) => (
                      <option
                        key={d.department_cli_id}
                        value={d.department_name}
                      >
                        {d.department_name}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Sub Category
                </Label>
                <Col sm={7}>
                  <Input
                    type="select"
                    name="sub_category"
                    value={productDetails.sub_category || ''}
                    onChange={handleInputs}
                  >
                    <option value="">Select</option>
                    {subcategorydropdown.map((s) => (
                      <option key={s.sub_category_id} value={s.sub_category_title}>
                        {s.sub_category_title}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Supplier
                </Label>
                <Col sm={7}>
                  <Input
                    type="select"
                    name="supplier"
                    value={productDetails.supplier || ''}
                    onChange={handleInputs}
                  >
                    <option value="">Select</option>
                    {supplierdropdown.map((s) => (
                      <option key={s.supplier_id} value={s.company_name}>
                        {s.company_name}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Tax Percentage
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="tax_percentage"
                    value={productDetails.tax_percentage || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Purchase UOM
                </Label>
                <Col sm={7}>
                  <Input
                    type="text"
                    name="purchase_uom"
                    value={productDetails.purchase_uom || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Pcs/Carton
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="pcs_carton"
                    value={productDetails.pcs_carton || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Purchase Unit Cost
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="purchase_unit_cost"
                    value={productDetails.purchase_unit_cost || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Retail Price
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="retail_price"
                    value={productDetails.retail_price || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  WholeSale Price
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="wholesale_price"
                    value={productDetails.wholesale_price || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Carton Price
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="carton_price"
                    value={productDetails.carton_price || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Style/Fabric
                </Label>
                <Col sm={7}>
                  <Input
                    type="text"
                    name="style_fabric"
                    value={productDetails.style_fabric || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Carton Weight
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="carton_weight"
                    value={productDetails.carton_weight || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Bin
                </Label>
                <Col sm={7}>
                  <Input
                    type="text"
                    name="bin"
                    value={productDetails.bin || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Category *
                </Label>
                <Col sm={7}>
                  <Input
                    type="select"
                    name="category"
                    value={productDetails.category || ''}
                    onChange={handleInputs}
                  >
                    <option value="">Select</option>
                    {categorydropdown.map((c) => (
                      <option key={c.category_id} value={c.category_title}>
                        {c.category_title}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Brand *
                </Label>
                <Col sm={7}>
                  <Input
                    type="select"
                    name="brand"
                    value={productDetails.brand || ''}
                    onChange={handleInputs}
                  >
                    <option value="">Select</option>
                    {branddropdown.map((b) => (
                      <option key={b.brand_id} value={b.brand_name}>
                        {b.brand_name}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Product Type
                </Label>
                <Col sm={7}>
                  <Input
                    type="text"
                    name="product_type"
                    value={productDetails.product_type || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Display Order
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="display_order"
                    value={productDetails.display_order || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Sales UOM *
                </Label>
                <Col sm={7}>
                  <Input
                    type="text"
                    name="sales_uom"
                    value={productDetails.sales_uom || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Weight
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="weight"
                    value={productDetails.weight || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Operation Cost
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="operation_cost"
                    value={productDetails.operation_cost || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Min Retail Price
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="min_retail_price"
                    value={productDetails.min_retail_price || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Min WholeSale Price
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="min_wholesale_price"
                    value={productDetails.min_wholesale_price || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Min Car Price
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="min_car_price"
                    value={productDetails.min_car_price || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Model No
                </Label>
                <Col sm={7}>
                  <Input
                    type="text"
                    name="model_no"
                    value={productDetails.model_no || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  M3 Per Carton
                </Label>
                <Col sm={7}>
                  <Input
                    type="number"
                    name="m3_per_carton"
                    value={productDetails.m3_per_carton || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-2">
                <Label sm={5} className="col-form-label">
                  Remarks/Other Name
                </Label>
                <Col sm={7}>
                  <Input
                    type="text"
                    name="remarks"
                    value={productDetails.remarks || ''}
                    onChange={handleInputs}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>

          {/* Switches: first row left-aligned, second row centered */}
          <div style={{ marginLeft: 0, marginTop: 16, marginBottom: 8 }}>
            {/* First row: distributed left, center, right */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 180 }}>
                 <Label className="mb-0 ms-2">Show On Purchase</Label>
                <Switch
                  name="show_on_purchase"
                  checked={!!productDetails.show_on_purchase}
                  onChange={handleInputs}
                />
               
              </div>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 180, justifyContent: 'center' }}>
                <Label className="mb-0 ms-2">Show On Sales</Label>
                <Switch
                  name="show_on_sales"
                  checked={!!productDetails.show_on_sales}
                  onChange={handleInputs}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 180, justifyContent: 'flex-end' }}>
                 <Label className="mb-0 ms-2">IsActive</Label>
                <Switch
                  name="is_active"
                  checked={!!productDetails.is_active}
                  onChange={handleInputs}
                />             
              </div>
            </div>
            {/* Second row: centered */}
            <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 180 }}>
                <Switch
                  name="eprocurement"
                  checked={!!productDetails.eprocurement}
                  onChange={handleInputs}
                />
                <Label className="mb-0 ms-2">EProcurement</Label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 180 }}>
                <Switch
                  name="ecommerce"
                  checked={!!productDetails.ecommerce}
                  onChange={handleInputs}
                />
                <Label className="mb-0 ms-2">ECommerce</Label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 180 }}>
                <Switch
                  name="show_on_pos"
                  checked={!!productDetails.show_on_pos}
                  onChange={handleInputs}
                />
                <Label className="mb-0 ms-2">Show On POS</Label>
              </div>
            </div>
          </div>

          {/* Product Image with delete icon and size, left-aligned below switches */}
          {productDetails.image_url && (
            <div className="d-flex flex-column align-items-start mt-4" style={{ marginLeft: 0 }}>
              <div style={{ position: 'relative', border: '1px solid #ddd', borderRadius: 4, padding: 16, background: '#fff', minWidth: 220 }}>
                {/* Delete icon (trash) in bottom left */}
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    left: 8,
                    bottom: 8,
                    background: '#fff',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                  aria-label="Delete image"
                  // onClick={handleDeleteImage} // Uncomment and implement if needed
                >
                  <span role="img" aria-label="delete" style={{ fontSize: 22 }}>&#128465;</span>
                </button>
                <img
                  src={productDetails.image_url}
                  alt="Product"
                  style={{ maxWidth: 180, maxHeight: 180, display: 'block' }}
                />
              </div>
              <div className="mt-2" style={{ fontSize: 16, color: '#333', marginLeft: 8 }}>
                ({productDetails.image_size})
              </div>
            </div>
          )}
      </Form>
    </>
  );
}

ProductDetail.propTypes = {
  productDetails: PropTypes.shape({
    product_code: PropTypes.string,
    product_name: PropTypes.string,
    department: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sub_category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    supplier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tax_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    purchase_uom: PropTypes.string,
    pcs_carton: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    purchase_unit_cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    retail_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    wholesale_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    carton_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style_fabric: PropTypes.string,
    carton_weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bin: PropTypes.string,
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    brand: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    product_type: PropTypes.string,
    display_order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sales_uom: PropTypes.string,
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    operation_cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min_retail_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min_wholesale_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min_car_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    model_no: PropTypes.string,
    m3_per_carton: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    remarks: PropTypes.string,
    show_on_purchase: PropTypes.bool,
    show_on_sales: PropTypes.bool,
    is_active: PropTypes.bool,
    eprocurement: PropTypes.bool,
    ecommerce: PropTypes.bool,
    show_on_pos: PropTypes.bool,
    image_url: PropTypes.string,
    image_size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  handleInputs: PropTypes.func.isRequired,
  categorydropdown: PropTypes.arrayOf(PropTypes.object).isRequired,
  departmentdropdown: PropTypes.arrayOf(PropTypes.object).isRequired,
  subcategorydropdown: PropTypes.arrayOf(PropTypes.object).isRequired,
  branddropdown: PropTypes.arrayOf(PropTypes.object).isRequired,
  supplierdropdown: PropTypes.arrayOf(PropTypes.object).isRequired,
};
