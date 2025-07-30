// pages/PriceGroup/PriceGroupList.js

import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'reactstrap';
import { useNavigate ,Link} from 'react-router-dom';
import api from '../../constants/api';
import message from '../../components/Message';

const PriceGroupList = () => {
  const [priceGroups, setPriceGroups] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const getPriceGroups = () => {
    api
      .get('/pricegroup/getAll')
      .then((res) => {
        setPriceGroups(res.data.data);
      })
      .catch(() => {
        message('Unable to fetch Price Groups', 'error');
      });
  };

  // const deletePriceGroup = (id) => {
  //   api
  //     .post('/pricegroup/delete', { id })
  //     .then(() => {
  //       message('Deleted successfully', 'success');
  //       getPriceGroups();
  //     })
  //     .catch(() => message('Delete failed', 'error'));
  // };

  useEffect(() => {
    getPriceGroups();
  }, []);

  return (
    <>
      <h3>Price Group Management</h3>
      <Button color="primary" onClick={() => navigate('/pricegroupDetails')}>
        Add New(+)
      </Button>
      <Input
        placeholder="Search Price Group..."
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
        className="my-3"
      />
      <Table bordered responsive>
        <thead>
          <tr>
            <th>Action</th>
            <th>Group Name</th>
            <th>Status</th>
            <th>Modified On</th>
          </tr>
        </thead>
        <tbody>
          {priceGroups
            .filter((pg) => pg.price_group_name.toLowerCase().includes(search))
            .map((pg) => (
              <tr key={pg.id}>
                <td>
                <Link to={`/PriceGroupEdit/${pg.price_group_id}`}>
                                      <Button color="primary" className="shadow-none btn-sm">
                                       Edit
                                      </Button>
                                    </Link>
                  {/* <Button size="sm" color="danger" onClick={() => deletePriceGroup(pg.price_group_id)}>Delete</Button> */}
                </td>
                <td>{pg.price_group_name}</td>
                
                  <td>
                  <span style={{ color: pg.status === 1 ? 'green' : 'red', fontWeight: 'bold' }}>
                    {pg.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{pg.created_by}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default PriceGroupList;
