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
      {/* SECTION Title (e.g., Inventory) */}
      <NavLink
        className="cursor-pointer d-flex justify-content-between align-items-center fw-bold"
        onClick={toggle}
      >
        <span>{title}</span>
        <span className="ms-auto">
          <i className={`bi fs-8 ${collapsed ? 'bi-chevron-right' : 'bi-chevron-down'}`} />
        </span>
      </NavLink>

      {/* Categories inside Section */}
      <Collapse isOpen={!collapsed} navbar tag="ul" className="subMenu">
        {(items || []).map((category) => (
          <CategoryMenu key={category.title} category={category} location={location} />
        ))}
      </Collapse>
    </NavItem>
  );
};

/* Category component with its own expand/collapse */
const CategoryMenu = ({ category, location }) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggle = () => setCollapsed(!collapsed);

  return (
    <NavItem>
      {/* CATEGORY Title (e.g., Master, Product) */}
      <NavLink
        className="cursor-pointer d-flex justify-content-between align-items-center ps-3 fw-semibold"
        onClick={toggle}
      >
        <span>{category.title}</span>
        <span className="ms-auto">
          <i className={`bi fs-8 ${collapsed ? 'bi-chevron-right' : 'bi-chevron-down'}`} />
        </span>
      </NavLink>

      {/* Subcategories */}
      <Collapse isOpen={!collapsed} navbar tag="ul" className="ms-4">
        {(category.items || []).map(
          (subCat) =>
            subCat.title && ( // only render if valid
              <HasAccess
                roles={null}
                permissions={`${subCat.title}-list`}
                renderAuthFailed={<p className="mb-0"></p>}
                key={subCat.title}
              >
                <NavItem
                  className={location.pathname === subCat.internal_link ? 'activeLink' : ''}
                  onClick={(e) => {
                    if (!subCat.internal_link) e.preventDefault();
                  }}
                >
                  <NavLink tag={Link} to={subCat.internal_link || '#'} className="ps-3">
                    {subCat.title}
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
  items: PropTypes.array,
};

export default NavSubMenu;
