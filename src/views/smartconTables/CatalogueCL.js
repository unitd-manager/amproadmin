import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import message from '../../components/Message';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CataloguePrintWithCostPdf from '../../components/PDF/CataloguePrintWithCostPdf';
import CataloguePrintWithRetailPrice from '../../components/PDF/CataloguePrintWithRetailPricePdf';
import CataloguePrintWithoutPrice from '../../components/PDF/CataloguePrintWithoutPricePdf';
import CataloguePrintWithStock from '../../components/PDF/CataloguePrintWithStockPdf';

const CatalogueManagement = () => {
  const [catalogue, setCatalogue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCatalogue, setFilteredCatalogue] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedPrintOption, setSelectedPrintOption] = useState('');
  const [selectedCatalogueId, setSelectedCatalogueId] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  const togglePrintModal = () => {
    setPrintModalOpen((prev) => !prev);
    if (printModalOpen) {
      setSelectedPrintOption('');
    }
  };

  const toggleShowStatusFilter = () => {
    setShowStatusFilter((prev) => !prev);
    if (showStatusFilter) setStatusFilter('');
  };

  const getCatalogue = () => {
    setLoading(true);
    api
      .get('/catalogue/getCatalogue')
      .then((res) => {
        const data = res.data.data || [];
        setCatalogue(data);
        setFilteredCatalogue(data);
        setLoading(false);
      })
      .catch(() => {
        message('Unable to fetch catalogue data', 'error');
        setCatalogue([]);
        setFilteredCatalogue([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCatalogue();
  }, []);

  useEffect(() => {
    let filtered = catalogue;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        item.catalogue_name?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== '') {
      filtered = filtered.filter(
        (item) => item.status?.toString() === statusFilter
      );
    }
    setFilteredCatalogue(filtered);
  }, [searchTerm, statusFilter, catalogue]);

  const handleDelete = (catalogueId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/product/deleteCatalogue', { catalogue_id: catalogueId })
          .then(() => {
            Swal.fire('Deleted!', 'Catalogue item has been deleted.', 'success');
            getCatalogue();
          })
          .catch(() => {
            message('Unable to Delete Catalogue Item', 'error');
          });
      }
    });
  };

  const handlePrint = () => {
    if (!selectedPrintOption) {
      message('Please select a print option', 'info');
      return;
    }
    if (!selectedCatalogueId) {
      message('Please select a catalogue by checkbox', 'info');
      return;
    }
    setPrintModalOpen(false); // Close the modal
    setShowPdf(true);         // Show the PDF
  };

  const columns = [
    {
      name: '',
      cell: (row) => (
        <Input
          type="radio"
          name="selectedCatalogue"
          onChange={() => setSelectedCatalogueId(row.catalogue_id)}
          checked={selectedCatalogueId === row.catalogue_id}
        />
      ),
      width: '40px',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Catalogue Name',
      selector: (row) => row.catalogue_name,
      sortable: true,
      cell: (row) => (
        <Link to={`/CatalogueCLEdit/${row.catalogue_id}`}>{row.catalogue_name}</Link>
      ),
      width: '250px',
    },
    {
      name: 'Remarks',
      selector: (row) => row.remarks,
      sortable: true,
      width: '200px',
    },
    {
      name: 'SortOrder',
      selector: (row) => row.sort_order,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <Button
            color="danger"
            size="sm"
            onClick={() => handleDelete(row.catalogue_id)}
            className="me-1"
          >
            <Icon.Trash2 size={14} />
          </Button>
          <Link to={`/CatalogueAddProduct/${row.catalogue_id}`}>
            <Icon.Edit2 size={14} />
          </Link>
        </>
      ),
      width: '120px',
    },
  ];

  return (
    <div className="MainDiv">
      <BreadCrumbs />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0">Catalogue Management</h4>
        <div className="d-flex align-items-center">
          <Input
            type="text"
            placeholder="Search Catalogue..."
            className="form-control me-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '250px' }}
          />
          <Button color="light" onClick={toggleShowStatusFilter} className="shadow-none me-2">
            <Icon.Filter size={20} />
          </Button>
          <Button color="info" onClick={togglePrintModal} className="shadow-none me-2">
            <Icon.Printer size={20} /> Print
          </Button>
          <Button color="primary" tag={Link} to="/CatalogueDetailsCL" className="shadow-none">
            Add New(+)
          </Button>
        </div>
      </div>

      {showStatusFilter && (
        <div className="d-flex align-items-center mb-3">
          <Label className="me-2 mb-0">Filter (Active/Inactive):</Label>
          <Input
            type="select"
            className="form-select w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </Input>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredCatalogue}
        pagination
        progressPending={loading}
        highlightOnHover
        responsive
        striped
      />

      <Modal isOpen={printModalOpen} toggle={togglePrintModal} centered>
        <ModalHeader toggle={togglePrintModal}>Catalogue Print</ModalHeader>
        <ModalBody>
          {['Print With Price', 'Print With Retail Price', 'Print Without Price', 'Print With Stock'].map(
            (option) => (
              <FormGroup check className="mb-2" key={option}>
                <Input
                  type="radio"
                  name="printOption"
                  id={option}
                  value={option}
                  checked={selectedPrintOption === option}
                  onChange={(e) => setSelectedPrintOption(e.target.value)}
                />
                <Label check for={option}>{option}</Label>
              </FormGroup>
            )
          )}
          <Button color="primary" onClick={handlePrint} className="w-100">
            Print
          </Button>
        </ModalBody>
      </Modal>

      {/* Conditionally Render PDFs Based on Selected Option */}
      {showPdf && selectedPrintOption === 'Print With Price' && (
        <CataloguePrintWithCostPdf
          catalogueId={selectedCatalogueId}
          printOption={selectedPrintOption}
          onClose={() => {
            setShowPdf(false);
            setSelectedPrintOption('');
            setSelectedCatalogueId(null);
            getCatalogue();
          }}
        />
      )}

      {showPdf && selectedPrintOption === 'Print With Retail Price' && (
        <CataloguePrintWithRetailPrice
          catalogueId={selectedCatalogueId}
          printOption={selectedPrintOption}
          onClose={() => {
            setShowPdf(false);
            setSelectedPrintOption('');
            setSelectedCatalogueId(null);
            getCatalogue();
          }}
        />
      )}

      {showPdf && selectedPrintOption === 'Print Without Price' && (
        <CataloguePrintWithoutPrice
          catalogueId={selectedCatalogueId}
          printOption={selectedPrintOption}
          onClose={() => {
            setShowPdf(false);
            setSelectedPrintOption('');
            setSelectedCatalogueId(null);
            getCatalogue();
          }}
        />
      )}

      {showPdf && selectedPrintOption === 'Print With Stock' && (
        <CataloguePrintWithStock
          catalogueId={selectedCatalogueId}
          printOption={selectedPrintOption}
          onClose={() => {
            setShowPdf(false);
            setSelectedPrintOption('');
            setSelectedCatalogueId(null);
            getCatalogue();
          }}
        />
      )}
    </div>
  );
};

export default CatalogueManagement;
