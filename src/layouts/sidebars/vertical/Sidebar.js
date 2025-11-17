/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import Logo from '../../logo/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';
import { ChevronDown, ChevronRight } from 'lucide-react'; // icons
import api from '../../../constants/api';

const Sidebar = () => {
  const [menuData, setMenuData] = useState({});
  const [openSection, setOpenSection] = useState(null); // only one section open
  const [openCategory, setOpenCategory] = useState(null); // only one category open
  const isMobileSidebarOpen = useSelector(
    (state) => state.customizer.isMobileSidebarOpen
  );
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get('/section/getSectionForSidemenu')
      .then((res) => {
        if (res.data && res.data.data) {
          setMenuData(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching menu data:', err));
  }, []);

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
    setOpenCategory(null); // close categories when switching section
  };

  const toggleCategory = (key) => {
    setOpenCategory((prev) => (prev === key ? null : key));
  };

  return (
    <aside
      className={`sidebar bg-white border-end ${
        isMobileSidebarOpen ? 'sidebar-open' : ''
      }`}
    >
      <div className="d-flex align-items-center p-3">
        <Logo />
        <button
          className="ms-auto btn btn-sm btn-light d-lg-none"
          onClick={() => dispatch(ToggleMobileSidebar())}
        >
          ✕
        </button>
      </div>

      <SimpleBar className="h-100">
        <nav className="p-2">
              <div className="mb-3">
                <NavLink
                  to="/#/dashboard"
                  className="d-flex align-items-center w-100 btn btn-sm btn-outline-secondary text-start"
                  activeClassName="active"
                >
                  Dashboard
                </NavLink>
              </div>
          {Object.keys(menuData).map((sectionTitle) => (
            <div key={sectionTitle} className="mb-3">
              {/* Section Header */}
              
              <button
                className="d-flex align-items-center w-100 btn btn-sm btn-outline-secondary text-start"
                onClick={() => toggleSection(sectionTitle)}
              >
                {openSection === sectionTitle ? (
                  <ChevronDown size={16} className="me-2" />
                ) : (
                  <ChevronRight size={16} className="me-2" />
                )}
                {sectionTitle}
              </button>

              {/* Expandable Categories */}
              {openSection === sectionTitle && (
                <div className="ms-3 mt-2">
                  {Object.keys(menuData[sectionTitle]).map((categoryTitle) => (
                    <div key={categoryTitle} className="mb-2">
                      <button
                        className="d-flex align-items-center w-100 btn btn-sm btn-light text-start"
                        onClick={() =>
                          toggleCategory(`${sectionTitle}-${categoryTitle}`)
                        }
                      >
                        {openCategory ===
                        `${sectionTitle}-${categoryTitle}` ? (
                          <ChevronDown size={14} className="me-2" />
                        ) : (
                          <ChevronRight size={14} className="me-2" />
                        )}
                        {categoryTitle}
                      </button>

                      {/* Expandable Sub-Categories */}
                      {openCategory ===
                        `${sectionTitle}-${categoryTitle}` && (
                        <ul className="list-unstyled ms-4 mt-1">
                          {menuData[sectionTitle][categoryTitle].map((item) =>
                            item.sub_category_title ? (
                              <li key={item.id} className="mb-1">
                                <NavLink
                                  to={item.internal_link || '#'}
                                  className="text-decoration-none"
                                >
                                  {item.sub_category_title}
                                </NavLink>
                              </li>
                            ) : null
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SimpleBar>
    </aside>
  );
};

export default Sidebar;
