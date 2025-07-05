import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';


const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchClients = async () => {
            try {
                const response = await api.get(`/clients`);
                setClients(response.data);
            } catch (err) {
                console.error('Error fetching clients:', err);
                setError('Failed to load clients. Please try again later.');
            }
        };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClientClick = () => {
        navigate('/clientManagement/addClient');
    };

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
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ClientList;