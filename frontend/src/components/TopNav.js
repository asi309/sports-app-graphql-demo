import React, { useState, useContext } from 'react';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';

import { UserContext } from '../user-context';

const TopNav = () => {

    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);

    const logoutHandler = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
    }

  return isLoggedIn ? 
    <div>
      <Navbar color="faded" light>
        <NavbarToggler onClick={toggleNavbar} />
        <Link to='/login' onClick={ logoutHandler }>Logout</Link>
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <Link to='/'>Dashboard</Link>
            </NavItem>
            <NavItem>
              <Link to='/events'>Create Event</Link>
            </NavItem>
            <NavItem>
              <Link to='/registrations/requests'>Registration Request</Link>
            </NavItem>
            <NavItem>
              <Link to='/myregistrations'>My Registrations</Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
    : '';
}

export default TopNav;
