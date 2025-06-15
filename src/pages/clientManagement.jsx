import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    // Ensure your .env.VITE_BACKEND_URL is correctly set (e.g., VITE_BACKEND_URL=http://localhost:5000)
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 

    useEffect(() => {
        const fetchClients = async () => {
            try {
                // This GET request will hit your Flask /clients endpoint
                const response = await axios.get(`${backendUrl}/clients`);
                setClients(response.data);
            } catch (err) {
                console.error('Error fetching clients:', err);
                setError('Failed to load clients. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [backendUrl]); // Dependency array: re-run if backendUrl changes

    const handleAddClientClick = () => {
        // Navigate to the AddClient form
        // Make sure your routing is set up for '/add-client' in App.jsx
        navigate('/clientManagement/addClient'); 
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading clients...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="m-4">
                {error}
            </Alert>
        );
    }

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Client List</h2>
                {/* Add Client Button in the upper right corner */}
                <Button variant="primary" onClick={handleAddClientClick}>
                    Add Client
                </Button>
            </div>

            {clients.length === 0 ? (
                <Alert variant="info">No clients found. Click "Add Client" to add one!</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Client ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Company</th>
                            <th>Country</th>
                            <th>Email</th>
                            <th>Contact No.</th>
                            {/* Add more headers if needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.client_id}>
                                <td>{client.client_id}</td>
                                <td>{client.first_name}</td>
                                <td>{client.last_name}</td>
                                <td>{client.company}</td>
                                <td>{client.country}</td>
                                <td>{client.email}</td>
                                <td>{client.contact_nu}</td>
                                {/* Render more client data */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ClientList;