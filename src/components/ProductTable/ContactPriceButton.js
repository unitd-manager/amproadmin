import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Input,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  Label,
  FormFeedback,
} from 'reactstrap';
import * as Icon from 'react-feather';
import api from '../../constants/api';
import message from '../Message';

const TAB_CONFIG = [
  { key: 'customer', label: 'Customer' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'priceGroup', label: 'Price Group' },
];

const createEmptyRowState = () => ({
  customer: [],
  supplier: [],
  priceGroup: [],
});

const normaliseRecordType = (record) => {
  if (record?.type) return record.type;
  if (record?.contact_type) return record.contact_type;
  if (record?.customer === 1 || record?.customer === '1') return 'customer';
  if (record?.supplier === 1 || record?.supplier === '1') return 'supplier';
  if (
    record?.price_group === 1 ||
    record?.price_group === '1' ||
    record?.contact_group === 1
  )
    return 'priceGroup';
  return 'customer';
};

const normaliseRow = (record, fallbackType = 'customer') => {
  const derivedType = normaliseRecordType(record) || fallbackType;
  const contactIdCandidate =
    record?.contact_id ?? record?.contact_cli_id ?? record?.company_id ?? record?.company_cli_id ?? null;

  return {
    key: record?.cs_product_id
      ? `persist-${record.cs_product_id}`
      : `temp-${derivedType}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    cs_product_id: record?.cs_product_id || null,
    customer_supplier_price_id:
      record?.customer_supplier_price_id || record?.contact_price_id || record?.parent_id || null,
    contact_id: contactIdCandidate ? String(contactIdCandidate) : '',
    contact_code:
      record?.contact_code || record?.customer_code || record?.company_code || record?.code || '',
    contact_name: record?.contact_name || record?.company_name || record?.name || '',
    wholesale_price: record?.wholesale_price ?? '',
    carton_price: record?.carton_price ?? '',
    fixed_price: record?.fixed_price ?? '',
    type: derivedType,
    // UI-only fields
    error: null,
  };
};

const normaliseCollection = (collection, fallbackType) =>
  (Array.isArray(collection) ? collection : []).map((item) => normaliseRow(item, fallbackType));

const ContactPriceButton = ({ productId, isOpen, onClose, productName }) => {
  const [activeTab, setActiveTab] = useState('customer');
  const [rows, setRows] = useState(createEmptyRowState);
  const [deletedRowIds, setDeletedRowIds] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bulkValues, setBulkValues] = useState({ wholesale_price: '', carton_price: '' });
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);

  const filteredContactOptions = useMemo(() => {
    const supplierOptions = contactOptions.filter((item) => Number(item.supplier) === 1);
    const priceGroupOptions = contactOptions.filter(
      (item) =>
        Number(item.price_group) === 1 ||
        Number(item.contact_group) === 1 ||
        Number(item.is_group) === 1,
    );

    return {
      supplier: supplierOptions.length > 0 ? supplierOptions : contactOptions,
      priceGroup: priceGroupOptions.length > 0 ? priceGroupOptions : contactOptions,
    };
  }, [contactOptions]);

  const companyLookupByCode = useMemo(() => {
    const map = new Map();
    companyOptions.forEach((company) => {
      const codeCandidates = [company?.customer_code, company?.company_code, company?.contact_code];
      codeCandidates
        .filter((candidate) => candidate)
        .forEach((candidate) => map.set(String(candidate).toLowerCase(), company));
    });
    return map;
  }, [companyOptions]);

  const toNumberOrNull = useCallback((value) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }, []);

  const postWithFallback = useCallback(async (primaryUrl, fallbackUrl, payload) => {
    try {
      return await api.post(primaryUrl, payload);
    } catch (error) {
      if (!fallbackUrl) throw error;
      return api.post(fallbackUrl, payload);
    }
  }, []);

  const applyResponseData = useCallback((responseData) => {
    if (Array.isArray(responseData)) {
      const normalised = responseData.map((record) => normaliseRow(record));
      setRows({
        customer: normalised.filter((item) => item.type === 'customer'),
        supplier: normalised.filter((item) => item.type === 'supplier'),
        priceGroup: normalised.filter((item) => item.type === 'priceGroup'),
      });
      return;
    }
    if (responseData && typeof responseData === 'object') {
      setRows({
        customer: normaliseCollection(responseData.customer ?? responseData.customers, 'customer'),
        supplier: normaliseCollection(responseData.supplier ?? responseData.suppliers, 'supplier'),
        priceGroup: normaliseCollection(responseData.priceGroup ?? responseData.price_group, 'priceGroup'),
      });
      return;
    }
    setRows(createEmptyRowState());
  }, []);

  const fetchContactPrices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.post('/product/getCsProduct', { product_id: productId });
      const responseData = res.data?.data;
      if (!responseData || (Array.isArray(responseData) && responseData.length === 0)) {
        throw new Error('Empty product contact price data');
      }
      applyResponseData(responseData);
    } catch (err) {
      try {
        const legacyRes = await api.post('/customersupplierprice/getContactPricesByProduct', {
          product_id: productId,
        });
        applyResponseData(legacyRes.data?.data);
      } catch (legacyErr) {
        setRows(createEmptyRowState());
        message('Unable to load contact prices for this product', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [applyResponseData, productId]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('customer');
      setRows(createEmptyRowState());
      setDeletedRowIds([]);
      setBulkValues({ wholesale_price: '', carton_price: '' });
      setSaving(false);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !productId) return;

    if (!contactsLoaded) {
      api
        .get('/customersupplierprice/getContactclis')
        .then((res) => {
          setContactOptions(res.data?.data || []);
          setContactsLoaded(true);
        })
        .catch(() => {
          message('Unable to load contact list', 'error');
        });
    }

    if (isOpen && !companiesLoaded) {
      api
        .get('/company/getCompany')
        .then((res) => {
          setCompanyOptions(res.data?.data || []);
          setCompaniesLoaded(true);
        })
        .catch(() => {
          message('Unable to load company list', 'error');
        });
    }

    fetchContactPrices();
  }, [companiesLoaded, contactsLoaded, fetchContactPrices, isOpen, productId]);

  const getTabRows = (tabKey) => rows[tabKey] || [];

  const updateTabRows = (tabKey, updater) => {
    setRows((prev) => ({
      ...prev,
      [tabKey]: updater(prev[tabKey] || []),
    }));
  };

  const handleAddRow = (tabKey) => {
    updateTabRows(tabKey, (current) => [
      ...current,
      {
        key: `temp-${tabKey}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        cs_product_id: null,
        customer_supplier_price_id: null,
        contact_id: '',
        contact_code: '',
        contact_name: '',
        wholesale_price: '',
        carton_price: '',
        fixed_price: '',
        type: tabKey,
        error: null,
      },
    ]);
  };

  const handleContactChange = (tabKey, rowIndex, contactId) => {
    if (tabKey === 'customer') {
      const matchedCompany = companyOptions.find(
        (company) => String(company?.company_id) === String(contactId),
      );
      updateTabRows(tabKey, (current) => {
        const nextRows = [...current];
        const existingRow = nextRows[rowIndex] || {};
        nextRows[rowIndex] = {
          ...existingRow,
          contact_id: matchedCompany ? String(matchedCompany.company_id) : contactId,
          contact_code:
            matchedCompany?.customer_code ||
            matchedCompany?.company_code ||
            matchedCompany?.contact_code ||
            existingRow.contact_code ||
            '',
          contact_name: matchedCompany?.company_name || existingRow.contact_name || '',
          type: tabKey,
          error: null,
        };
        return nextRows;
      });
      return;
    }

    const selected = contactOptions.find((option) => String(option.contact_cli_id) === String(contactId));

    updateTabRows(tabKey, (current) => {
      const nextRows = [...current];
      const existingRow = nextRows[rowIndex] || {};
      nextRows[rowIndex] = {
        ...existingRow,
        contact_id: contactId,
        contact_code: selected?.contact_code || '',
        contact_name: selected?.contact_name || '',
        type: tabKey,
        error: null,
      };
      return nextRows;
    });
  };

  const handleCustomerCodeInput = (rowIndex, rawValue) => {
    const value = rawValue ?? '';
    const trimmedValue = value.trim();
    const lowerCaseValue = trimmedValue.toLowerCase();

    updateTabRows('customer', (current) => {
      const nextRows = [...current];
      const existingRow = nextRows[rowIndex] || {};

      // check duplicates by code OR name (case-insensitive)
      const duplicateCode = nextRows.some(
        (r, i) => i !== rowIndex && r.contact_code?.toLowerCase() === lowerCaseValue && lowerCaseValue !== '',
      );
      const duplicateName = nextRows.some(
        (r, i) => i !== rowIndex && r.contact_name?.toLowerCase() === lowerCaseValue && lowerCaseValue !== '',
      );

      if (duplicateCode || duplicateName) {
        nextRows[rowIndex] = { ...existingRow, contact_code: trimmedValue, error: 'duplicate' };
        message('Duplicate customer code or name not allowed', 'warning');
        return nextRows;
      }

      const matchedCompany =
        companyLookupByCode.get(lowerCaseValue) ||
        companyOptions.find(
          (company) =>
            String(company?.customer_code || '').toLowerCase() === lowerCaseValue ||
            String(company?.company_code || '').toLowerCase() === lowerCaseValue ||
            String(company?.contact_code || '').toLowerCase() === lowerCaseValue,
        );

      nextRows[rowIndex] = {
        ...existingRow,
        contact_code: trimmedValue,
        contact_name: matchedCompany?.company_name || (trimmedValue === '' ? '' : existingRow.contact_name || ''),
        contact_id: matchedCompany ? String(matchedCompany.company_id) : existingRow.contact_id || null,
        type: 'customer',
        error: null,
      };

      return nextRows;
    });
  };

  const handleCustomerNameChange = (rowIndex, rawValue) => {
    const value = rawValue ?? '';
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();

    updateTabRows('customer', (current) => {
      const nextRows = [...current];
      const existingRow = nextRows[rowIndex] || {};

      const duplicate = nextRows.some((r, i) => i !== rowIndex && r.contact_name?.toLowerCase() === lower && lower !== '');
      if (duplicate) {
        nextRows[rowIndex] = { ...existingRow, contact_name: trimmed, error: 'duplicate' };
        message('Duplicate customer code or name not allowed', 'warning');
        return nextRows;
      }

      nextRows[rowIndex] = { ...existingRow, contact_name: trimmed, error: null };
      return nextRows;
    });
  };

  const handleFieldChange = (tabKey, rowIndex, field, value) => {
    updateTabRows(tabKey, (current) => {
      const nextRows = [...current];
      const existingRow = nextRows[rowIndex] || {};
      nextRows[rowIndex] = { ...existingRow, [field]: value, error: null };
      return nextRows;
    });
  };

  const handleDeleteRow = (tabKey, rowIndex) => {
    updateTabRows(tabKey, (current) => {
      const nextRows = [...current];
      const removed = nextRows.splice(rowIndex, 1);
      const removedRow = removed[0];
      if (removedRow?.cs_product_id) {
        setDeletedRowIds((prev) => [...prev, removedRow.cs_product_id]);
      }
      return nextRows;
    });
  };

  const handleApplyAll = (tabKey, field) => {
    const valueToApply = bulkValues[field];
    if (valueToApply === '') {
      message('Enter a value before applying to all rows', 'warning');
      return;
    }

    updateTabRows(tabKey, (current) =>
      current.map((row) => ({ ...row, [field]: valueToApply })),
    );
  };

  const buildPayload = (targetRows) =>
    targetRows
      .filter((row) => row.contact_id || (row.contact_code && row.type === 'customer'))
      .map((row) => ({
        cs_product_id: row.cs_product_id || null,
        contact_id: Number(row.contact_id) || null,
        wholesale_price: toNumberOrNull(row.wholesale_price),
        carton_price: toNumberOrNull(row.carton_price),
        fixed_price: toNumberOrNull(row.fixed_price),
        type: row.type,
      }));

  const handleSave = async () => {
    if (!productId) {
      message('Missing product information', 'warning');
      return;
    }

    const allRows = [
      ...getTabRows('customer'),
      ...getTabRows('supplier'),
      ...getTabRows('priceGroup'),
    ];

    if (allRows.length === 0 && deletedRowIds.length === 0) {
      message('There are no contact prices to save', 'warning');
      return;
    }

    const customerRows = allRows.filter((row) => row.type === 'customer');
    const otherRows = allRows.filter((row) => row.type !== 'customer');

    // validation: ensure every customer row has code/name
    const invalidCustomerRows = customerRows.filter((row) => !row.contact_code && !row.contact_id);
    if (invalidCustomerRows.length > 0) {
      message('Each customer row must have a valid code or selected company', 'warning');
      return;
    }

    // check duplicate in final payload
const seenCodes = new Set();
const hasDuplicate = customerRows.some((r) => {
  const code = String(r.contact_code || '').toLowerCase();
  const name = String(r.contact_name || '').toLowerCase();

  if (code && seenCodes.has(code)) {
    message('Duplicate customer code found - resolve before saving', 'warning');
    return true;
  }
  if (name && seenCodes.has(name)) {
    message('Duplicate customer name found - resolve before saving', 'warning');
    return true;
  }

  if (code) seenCodes.add(code);
  if (name) seenCodes.add(name);
  return false;
});

if (hasDuplicate) return;


    const newCustomerRows = customerRows.filter((row) => !row.cs_product_id);
    const existingCustomerRows = customerRows.filter((row) => row.cs_product_id);

    if (
      newCustomerRows.length === 0 &&
      existingCustomerRows.length === 0 &&
      buildPayload(otherRows).length === 0 &&
      deletedRowIds.length === 0
    ) {
      message('No changes detected to save', 'warning');
      return;
    }

    setSaving(true);

    try {
      const operations = [];

      newCustomerRows.forEach((row) => {
        operations.push(
          api.post('/product/insertProductComp', {
            product_id: Number(productId),
            company_id: Number(row.contact_id) || null,
            wholesale_price: toNumberOrNull(row.wholesale_price),
            carton_price: toNumberOrNull(row.carton_price),
            fixed_price: toNumberOrNull(row.fixed_price),
          }),
        );
      });

      existingCustomerRows.forEach((row) => {
        operations.push(
          postWithFallback('/product/EditCSProductLineItems', '/EditCSProductLineItems', {
            cs_product_id: Number(row.cs_product_id),
            company_id: Number(row.contact_id) || null,
            wholesale_price: toNumberOrNull(row.wholesale_price),
            carton_price: toNumberOrNull(row.carton_price),
            fixed_price: toNumberOrNull(row.fixed_price),
          }),
        );
      });

      const legacyRows = buildPayload(otherRows);
      if (legacyRows.length > 0 || deletedRowIds.length > 0) {
        operations.push(
          api.post('/customersupplierprice/saveContactPricesByProduct', {
            product_id: productId,
            rows: legacyRows,
            deleted: deletedRowIds,
          }),
        );
      }

      if (operations.length === 0) {
        message('No changes detected to save', 'warning');
        setSaving(false);
        return;
      }

      await Promise.all(operations);
      message('Contact prices saved successfully', 'success');
      setDeletedRowIds([]);
      await fetchContactPrices();
    } catch (error) {
      message('Unable to save contact prices', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAll = () => {
    const rowsInTab = getTabRows(activeTab);
    const persistedIds = rowsInTab.map((row) => row.cs_product_id).filter(Boolean);
    if (!productId) {
      message('Missing product information', 'warning');
      return;
    }

    if (persistedIds.length === 0 && rowsInTab.length === 0) {
      message('There are no contact prices to delete', 'warning');
      return;
    }

    setSaving(true);
    api
      .post('/customersupplierprice/deleteContactPricesByIds', {
        product_id: productId,
        cs_product_ids: persistedIds,
        type: activeTab,
      })
      .then(() => {
        message('Contact prices deleted successfully', 'success');
        updateTabRows(activeTab, () => []);
      })
      .catch(() => {
        message('Unable to delete contact prices', 'error');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const renderRows = (tabKey) => {
    const tabRows = getTabRows(tabKey);
    const options = tabKey === 'customer' ? companyOptions : filteredContactOptions[tabKey] || [];

    if (tabRows.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center py-5">
            {loading ? <Spinner size="sm" /> : 'No contact prices found'}
          </td>
        </tr>
      );
    }

    return tabRows.map((row, index) => {
      const datalistId = `customer-code-options-${index}`;
      return (
        <tr key={row.key}>
          <td style={{ width: '18%' }}>
            {tabKey === 'customer' ? (
              <>
                <Input
                  value={row.contact_code}
                  list={datalistId}
                  onChange={(e) => handleCustomerCodeInput(index, e.target.value)}
                  placeholder="Enter customer code"
                  invalid={!!row.error}
                />
                <datalist id={datalistId}>
                  {options.map((option) => {
                    const optionCode = option?.customer_code || option?.company_code || option?.contact_code || '';
                    const optionLabel = optionCode
                      ? `${optionCode}${option?.company_name ? ` - ${option.company_name}` : ''}`
                      : option?.company_name || '';
                    return (
                      <option key={option?.company_id || optionCode} value={optionCode}>
                        {optionLabel}
                      </option>
                    );
                  })}
                </datalist>
              </>
            ) : (
              <Input
                type="select"
                value={row.contact_id || ''}
                onChange={(e) => handleContactChange(tabKey, index, e.target.value)}
              >
                <option value="">Select Code</option>
                {options.map((option) => (
                  <option key={option.contact_cli_id} value={option.contact_cli_id}>
                    {option.contact_code}
                  </option>
                ))}
              </Input>
            )}
            {row.error ? <FormFeedback>{row.error === 'duplicate' ? 'Duplicate code or name' : row.error}</FormFeedback> : null}
          </td>

          <td style={{ width: '22%' }}>
            {tabKey === 'customer' ? (
              <>
                <Input
                  value={row.contact_name}
                  onChange={(e) => handleCustomerNameChange(index, e.target.value)}
                  placeholder="Enter company name"
                  invalid={!!row.error}
                />
                {row.error ? <FormFeedback>{row.error === 'duplicate' ? 'Duplicate code or name' : row.error}</FormFeedback> : null}
              </>
            ) : (
              <Input value={row.contact_name} disabled />
            )}
          </td>

          <td style={{ width: '18%' }}>
            <Input
              type="number"
              value={row.wholesale_price}
              onChange={(e) => handleFieldChange(tabKey, index, 'wholesale_price', e.target.value)}
            />
          </td>

          <td style={{ width: '18%' }}>
            <Input
              type="number"
              value={row.carton_price}
              onChange={(e) => handleFieldChange(tabKey, index, 'carton_price', e.target.value)}
            />
          </td>

          <td style={{ width: '18%' }}>
            <Input
              type="number"
              value={row.fixed_price}
              onChange={(e) => handleFieldChange(tabKey, index, 'fixed_price', e.target.value)}
            />
          </td>

          <td className="text-center" style={{ width: '6%' }}>
            <Button color="danger" size="sm" onClick={() => handleDeleteRow(tabKey, index)}>
              <Icon.Trash2 size={16} />
            </Button>
          </td>
        </tr>
      );
    });
  };

  return (
    <Modal size="xl" isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Product Contact Price</ModalHeader>
      <ModalBody>
        <h5 className="mb-3">{productName || 'Selected Product'}</h5>

        <Nav tabs className="mb-3">
          {TAB_CONFIG.map((tab) => (
            <NavItem key={tab.key}>
              <NavLink
                className={activeTab === tab.key ? 'active' : ''}
                onClick={() => setActiveTab(tab.key)}
                style={{ cursor: 'pointer' }}
              >
                {tab.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        <div className="d-flex justify-content-end mb-3">
          <Button color="dark" onClick={() => handleAddRow(activeTab)}>
            <Icon.PlusCircle size={18} className="me-2" />
            Add Row
          </Button>
        </div>

        <Row className="align-items-end mb-3">
          <Col md="3">
            <Label>New Wholesale Price</Label>
            <Input
              type="number"
              value={bulkValues.wholesale_price}
              onChange={(e) => setBulkValues((prev) => ({ ...prev, wholesale_price: e.target.value }))}
            />
          </Col>
          <Col md="2" className="mt-2 mt-md-0">
            <Button color="primary" className="w-100" onClick={() => handleApplyAll(activeTab, 'wholesale_price')}>
              Apply All
            </Button>
          </Col>
          <Col md="3" className="mt-3 mt-md-0">
            <Label>New Carton Price</Label>
            <Input
              type="number"
              value={bulkValues.carton_price}
              onChange={(e) => setBulkValues((prev) => ({ ...prev, carton_price: e.target.value }))}
            />
          </Col>
          <Col md="2" className="mt-2 mt-md-0">
            <Button color="primary" className="w-100" onClick={() => handleApplyAll(activeTab, 'carton_price')}>
              Apply All
            </Button>
          </Col>
        </Row>

        <Table bordered responsive>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Wholesale Price</th>
              <th>Carton Price</th>
              <th>Fixed Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderRows(activeTab)}</tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave} disabled={saving}>
          {saving ? <Spinner size="sm" className="me-2" /> : null}
          Save
        </Button>
        <Button color="danger" onClick={handleDeleteAll} disabled={saving}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ContactPriceButton.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  productName: PropTypes.string,
};

ContactPriceButton.defaultProps = {
  productId: null,
  isOpen: false,
  onClose: () => {},
  productName: '',
};

export default ContactPriceButton;
