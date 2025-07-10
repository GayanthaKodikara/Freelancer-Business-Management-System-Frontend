import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('logged out!');
    localStorage.removeItem('token'); 

    alert('logged out!'); 

    navigate('/'); 
  };

  return (
    <Button
      variant="danger"
      onClick={handleLogout}
      style={{
        position: 'fixed', 
        top: '10px',      
        right: '10px'
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;