import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Row,
  Col
} from "reactstrap";
import { FaTrash, FaPlus } from "react-icons/fa";

const StockAdjustment = () => {
  const [rows, setRows] = useState([
    {
      product_code: "",
      product_name: "",
      stockInHand: { carton: "", loose: "", qty: "" },
      type: "+",
      stockAdjType: "",
      stockAdjust: { carton: 0, loose: 0, qty: 0 },
      newStock: { carton: 0, loose: 0, qty: 0 }
    }
  ]);

  // Add new row
  const addRow = () => {
    setRows([
      ...rows,
      {
        productCode: "",
        productName: "",
        stockInHand: { carton: "", loose: "", qty: "" },
        type: "+",
        stockAdjType: "",
        stockAdjust: { carton: 0, loose: 0, qty: 0 },
        newStock: { carton: 0, loose: 0, qty: 0 }
      }
    ]);
  };

  // Delete row
  const deleteRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  // Handle input change
  const handleChange = (index, field, value, section = null) => {
    const updated = [...rows];
    if (section) {
      updated[index][section][field] = value;
    } else {
      updated[index][field] = value;
    }
    setRows(updated);
  };

  return (
    <div className="p-3">
      <h5>Add/Edit Stock Adjustment</h5>
      <Form>
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label>StockAdj Date</Label>
              <Input type="date" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label>Location Name</Label>
              <Input type="select">
                <option>Head Office</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label>Remarks</Label>
              <Input type="text" />
            </FormGroup>
          </Col>
        </Row>

        <h6 className="mt-3">Products</h6>
        <Table bordered responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>ProductCode</th>
              <th>ProductName</th>
              <th colSpan="3">StockIn Hand</th>
              <th>Type</th>
              <th>StockAdj Type</th>
              <th colSpan="3">Stock Adjust</th>
              <th colSpan="3">New Stock</th>
              <th>Action</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th>Carton</th>
              <th>Loose</th>
              <th>Qty</th>
              <th></th>
              <th></th>
              <th>Carton</th>
              <th>Loose</th>
              <th>Qty</th>
              <th>Carton</th>
              <th>Loose</th>
              <th>Qty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.product_id}>
                <td>{i + 1}</td>
                <td>
                  <Input
                    value={row.product_code}
                    onChange={(e) =>
                      handleChange(i, "product_code", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Input
                    value={row.product_name}
                    onChange={(e) =>
                      handleChange(i, "product_name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Input
                    value={row.stockInHand.carton}
                    onChange={(e) =>
                      handleChange(i, "carton", e.target.value, "stockInHand")
                    }
                  />
                </td>
                <td>
                  <Input
                    value={row.stockInHand.loose}
                    onChange={(e) =>
                      handleChange(i, "loose", e.target.value, "stockInHand")
                    }
                  />
                </td>
                <td>
                  <Input
                    value={row.stockInHand.qty}
                    onChange={(e) =>
                      handleChange(i, "qty", e.target.value, "stockInHand")
                    }
                  />
                </td>
                <td>
                  <Input
                    type="select"
                    value={row.type}
                    onChange={(e) => handleChange(i, "type", e.target.value)}
                  >
                    <option>+</option>
                    <option>-</option>
                  </Input>
                </td>
                <td>
                  <Input
                    value={row.stockAdjType}
                    onChange={(e) =>
                      handleChange(i, "stockAdjType", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={row.stockAdjust.carton}
                    onChange={(e) =>
                      handleChange(i, "carton", e.target.value, "stockAdjust")
                    }
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={row.stockAdjust.loose}
                    onChange={(e) =>
                      handleChange(i, "loose", e.target.value, "stockAdjust")
                    }
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={row.stockAdjust.qty}
                    onChange={(e) =>
                      handleChange(i, "qty", e.target.value, "stockAdjust")
                    }
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={row.newStock.carton}
                    onChange={(e) =>
                      handleChange(i, "carton", e.target.value, "newStock")
                    }
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={row.newStock.loose}
                    onChange={(e) =>
                      handleChange(i, "loose", e.target.value, "newStock")
                    }
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={row.newStock.qty}
                    onChange={(e) =>
                      handleChange(i, "qty", e.target.value, "newStock")
                    }
                  />
                </td>
                <td>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => deleteRow(i)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button color="primary" onClick={addRow} className="mb-3">
          <FaPlus /> Add Product
        </Button>

        <div className="d-flex justify-content-between">
          <Button color="secondary">Cancel</Button>
          <Button color="success">Save</Button>
        </div>
      </Form>
    </div>
  );
};

export default StockAdjustment;
