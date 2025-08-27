/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Collapse, NavItem, NavLink } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HasAccess } from '@permify/react-role';

const NavSubMenu = ({ title, items }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const toggle = () => setCollapsed(!collapsed);

  // Remember expanded state
  useEffect(() => {
    const storedState = localStorage.getItem(`menuState-${title}`);
    if (storedState === 'open') setCollapsed(false);
  }, [title]);

  useEffect(() => {
    if (!collapsed) localStorage.setItem(`menuState-${title}`, 'open');
    else localStorage.removeItem(`menuState-${title}`);
  }, [collapsed, title]);

  return (

    <NavItem>
      {/* Parent Menu Title */}
      <NavLink className="cursor-pointer d-flex justify-content-between align-items-center" onClick={toggle}>
        <span>{title}</span>
         <span className="ms-auto">
              <i className={`bi fs-8 ${collapsed ? 'bi-chevron-right' : 'bi-chevron-down'}`} />
            </span>
      </NavLink>
      <Collapse isOpen={!collapsed} navbar tag="ul" className="subMenu">
        {items.map((item) =>
          item.type === 'category' ? (
            <NavSubMenu key={item.title} title={item.title} items={item.items} />
          ) : (
           
              <HasAccess
                roles={null}
                permissions={`${item.title}-list`}
                renderAuthFailed={<p className='mb-0'></p>}
                key={item.title}
              >
                <NavItem
                  key={item.title}
                  className={location.pathname === item.internal_link ? 'activeLink' : ''}
                  onClick={(e) => { if (!item.internal_link) e.preventDefault(); }}
                >
                  <NavLink tag={Link} to={item.internal_link || '#'}>
                    {item.title}
                     
                  </NavLink>
                </NavItem>
              </HasAccess>
         
          )
        )}
      </Collapse>
    </NavItem>

  );
};

NavSubMenu.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

export default NavSubMenu;
