import { Outlet,useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Header from './header/Header';
import Customizer from './customizer/Customizer';
import Sidebar from './sidebars/vertical/Sidebar';
import HorizontalHeader from './header/HorizontalHeader';
import HorizontalSidebar from './sidebars/horizontal/HorizontalSidebar';

const FullLayout = () => {
  const customizerToggle = useSelector((state) => state.customizer.customizerSidebar);
  const toggleMiniSidebar = useSelector((state) => state.customizer.isMiniSidebar);
  const showMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);
  const topbarFixed = useSelector((state) => state.customizer.isTopbarFixed);
  const LayoutHorizontal = useSelector((state) => state.customizer.isLayoutHorizontal);
  const isFixedSidebar = useSelector((state) => state.customizer.isSidebarFixed);
  const location = useLocation();
  const isEditOrDetailPage = location.pathname.includes('Edit') || location.pathname.includes('Details');

  return (
    <main>
      <div
        className={`pageWrapper d-md-block d-lg-flex ${toggleMiniSidebar ? 'isMiniSidebar' : ''} ${isEditOrDetailPage ? 'hide-sidebar-space' : ''}`} 
      >
        {/******** Sidebar *********/
        LayoutHorizontal || isEditOrDetailPage ? (
          ''
        ) : (
          <aside className={`sidebarArea ${showMobileSidebar ? 'showSidebar' : ''}`}>
            <Sidebar />
          </aside>
        )}
        {/********Content Area**********/}

        <div className={`contentArea ${topbarFixed ? 'fixedTopbar' : ''} ${isEditOrDetailPage ? 'hide-topbar-space' : ''}`}>
          {/********header**********/}
          {isEditOrDetailPage ? '' : (LayoutHorizontal ? <HorizontalHeader /> : <Header />)}
          {LayoutHorizontal ? <HorizontalSidebar /> : ''}
          {/********Middle Content**********/}
          <Container fluid className="p-4 boxContainer">
            <div className={isFixedSidebar && LayoutHorizontal ? 'HsidebarFixed' : ''}>
              <Outlet />
            </div>
            <Customizer className={customizerToggle ? 'showCustomizer' : ''} />
            {showMobileSidebar || customizerToggle ? <div className="sidebarOverlay" /> : ''}
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
