import renderer from 'react-test-renderer';
import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';







import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
import Flag from '../../components/Flag';
import message from '../../components/Message';
import Clients from './Client';

jest.mock('react-feather');
jest.mock('reactstrap');
jest.mock('bootstrap/dist/css/bootstrap.min.css');
jest.mock('datatables.net-dt/js/dataTables.dataTables');
jest.mock('datatables.net-dt/css/jquery.dataTables.min.css');
jest.mock('datatables.net-buttons/js/buttons.colVis');
jest.mock('datatables.net-buttons/js/buttons.flash');
jest.mock('datatables.net-buttons/js/buttons.html5');
jest.mock('datatables.net-buttons/js/buttons.print');
jest.mock('react-router-dom');
jest.mock('react-toastify');
jest.mock('../../constants/api');
jest.mock('../../layouts/breadcrumbs/BreadCrumbs');
jest.mock('../../components/CommonTable');
jest.mock('../../components/Flag');
jest.mock('../../components/Message');

const renderTree = tree => renderer.create(tree);
describe('<Clients>', () => {
  it('should render component', () => {
    expect(renderTree(<Clients 
    />).toJSON()).toMatchSnapshot();
  });
  
});