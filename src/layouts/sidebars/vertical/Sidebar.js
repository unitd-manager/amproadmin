/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Nav } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import Logo from '../../logo/Logo';
import { ToggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';
import NavSubMenu from './NavSubMenu';
import api from '../../../constants/api';

const Sidebar = () => {
  const [menu, setMenu] = useState({});
  const activeBg = useSelector((state) => state.customizer.sidebarBg);
  const isFixed = useSelector((state) => state.customizer.isSidebarFixed);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    api.get('/section/getSectionForSidemenu').then((res) => {
      setMenu(res.data.data || {});
    });
  }, []);

  const isEditOrDetailPage = location.pathname.includes('Edit') || location.pathname.includes('Details');

  if (isEditOrDetailPage) {
    return null; // Do not render sidebar on edit or detail pages
  }

  return (
    <div className={`sidebarBox shadow bg-${activeBg} ${isFixed ? 'fixedSidebar' : ''}`}>
      <SimpleBar style={{ height: '100%' }}>
        {/* Logo */}
        <div className="d-flex p-3 align-items-center">
          <div style={{ flex: 0.6 }}>
            <Logo />
          </div>
          <div style={{ flex: 0.4, textAlign: 'right' }}>
            <Button
              close
              size="sm"
              className="d-sm-block d-lg-none"
              onClick={() => dispatch(ToggleMobileSidebar())}
            />
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="p-3 pt-1 mt-2">
          <Nav vertical className={activeBg === 'white' ? '' : 'lightText'}>
            {Object.entries(menu).map(([sectionName, categories]) => (
              <NavSubMenu
                key={sectionName}
                title={sectionName}   // Section
                items={Object.entries(categories).map(([categoryName, subCategories]) => ({
                  type: 'category',
                  title: categoryName,
                  items: subCategories.map((subCat) => ({
                    type: 'link',
                    title: subCat.sub_category_title,
                    internal_link: subCat.internal_link,
                  })),
                }))}
              />
            ))}
          </Nav>
        </div>
      </SimpleBar>
    </div>
  );
};

export default Sidebar;
