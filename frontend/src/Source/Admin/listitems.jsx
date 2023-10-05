import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';


export const mainListItems = (
    <React.Fragment>
    <Link to="/dashboard" style={{textDecoration:'none', color:'inherit'}}>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    </Link>
            
    <Link to="/sales" style={{textDecoration:'none', color:'inherit'}}> 
    <ListItemButton>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Sales" />
    </ListItemButton>
    </Link>   

    <Link to="/customers" style={{textDecoration:'none', color:'inherit'}}>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItemButton>
    </Link>
        
    <Link to="/orders" style={{textDecoration:'none', color:'inherit'}}>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
        </ListItemButton>
    </Link>
            
    <Link to="/products" style={{textDecoration:'none', color:'inherit'}}>
    <ListItemButton>
      <ListItemIcon>
        <AddBoxIcon />
      </ListItemIcon>
      <ListItemText primary="Products" />
      </ListItemButton>
      </Link>

     <a
      href="/userinterface" // Replace with the correct URL for "userinterface"
      target="_blank" // This opens the link in a new tab
      rel="noopener noreferrer" // Required for security reasons
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <ListItemButton>
        <ListItemIcon>
          <AddCircleOutlineIcon/>
        </ListItemIcon>
        <ListItemText primary="Add order" />
      </ListItemButton>
    </a>
  </React.Fragment>
  
);
