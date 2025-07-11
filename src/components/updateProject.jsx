import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Col, Row, Container, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const UpdateProject = () => {
    
    const [formData, setFormData] = useState({
        proj_name: '',
        start_date: '',
        end_date: '',
        status: '',
        remarks: '',
        url: '',
        client_name: '', 
        client_id: null, 
    });

    const [clientSuggestions, setClientSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimeoutRef = useRef(null);

    const navigate = useNavigate();
    const { project_id } = useParams(); 

    useEffect(() => {
        const fetchProjectData = async () => {
 
            try {
                const response = await api.get(`/projects/${project_id}`);
                const projectData = response.data;

                setFormData({
                    proj_name: projectData.proj_name || '', 
                    start_date: projectData.start_date || ''? response.data.start_date.substring(0, 10) : '',
                    end_date: projectData.end_date || ''? response.data.end_date.substring(0, 10) : '',
                    status: projectData.status || '',
                    remarks: projectData.remarks || '',
                    url: projectData.url || '',
                    // Client fields need special handling: fetch client details if client_id exists
                    client_name: projectData.client_id ? 'Loading client...' : '', // Placeholder
                    client_id: projectData.client_id,
                });

                // If a client_id exists, fetch client details for client_name display
                if (projectData.client_id) {
                    try {
                        const clientResponse = await api.get(`/clients/${projectData.client_id}`);
                        const client = clientResponse.data;
                        setFormData(prevData => ({
                            ...prevData,
                            client_name: `${client.first_name} (${client.company || 'N/A'})`,
                        }));
                    } catch (clientErr) {
                        console.error('Error fetching associated client details:', clientErr);
                        setFormData(prevData => ({
                            ...prevData,
                            client_name: 'Client not found or error loading', // Indicate error
                            client_id: null, // Reset client_id if unable to fetch associated client
                        }));
                    }
                }

            } catch (err) {
                console.error('Error fetching project data for update:', err);
                setFetchError(`Failed to load project details for ID: ${project_id}. ${err.response?.data?.error || 'Please check your network or try again.'}`);
            } finally {
            }
        };

        fetchProjectData();
    }, [project_id]); // Re-run if project_id or backendUrl changes

    // --- Event Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'client_name') {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            if (value.length > 2) {
                setShowSuggestions(true);
                setFormData(prevData => ({ ...prevData, client_id: null }));

                debounceTimeoutRef.current = setTimeout(async () => {
                    try {
                        const response = await api.get(`/clients/suggestions?query=${value}`);
                        setClientSuggestions(response.data);
                    } catch (err) {
                        console.error('Error fetching client suggestions:', err);
                        setClientSuggestions([]);
                    }
                }, 300);
            } else {
                setClientSuggestions([]);
                setShowSuggestions(false);
                setFormData(prevData => ({ ...prevData, client_id: null }));
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData(prevData => ({
            ...prevData,
            client_name: `${suggestion.first_name} (${suggestion.company || 'N/A'})`,
            client_id: suggestion.client_id,
        }));
        setShowSuggestions(false);
        setClientSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const projectDataToSubmit = {
                proj_name: formData.proj_name, // Note: backend uses 'name' not 'proj_name'
                start_date: formData.start_date,
                end_date: formData.end_date,
                status: formData.status,
                remarks: formData.remarks,
                url: formData.url,
                client_id: formData.client_id,
            };

            // Send a PUT request to update the project
            const projectResponse = await api.put(`/projects/${project_id}`, projectDataToSubmit);

            console.log('Project Data Updated Successfully:', projectResponse.data);
            alert('Project updated successfully!');
            navigate('/projectManagement'); // Navigate back to project list after update

        } catch (err) {
            console.error('Error updating data:', err);
            alert(`Error updating Project Data: ${err.response?.data?.error || 'Please check your network or try again.'}`);
        }
    };

    const handleAddClientClick = () => {
        navigate('/clientManagement');
    };


    return (
        <Container className="my-5 p-4 border rounded shadow-sm">
            <h2 className="mb-4 text-center">Update Project</h2>

            <Form onSubmit={handleSubmit}>
                {/* Project ID (Display Only) and Name Row */}
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="proj_id_display">
                        <Form.Label>Project ID</Form.Label>
                        <Form.Control type="text" value={project_id} readOnly disabled /> {/* Display project_id, not editable */}
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="proj_name">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control type="text" name="proj_name" value={formData.proj_name} onChange={handleChange} placeholder="Enter Project Name" required />
                    </Form.Group>
                </Row>

                {/* Start and End Date Row */}
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="start_date">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="end_date">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                    </Form.Group>
                </Row>

                {/* Status and URL Row */}
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                            <option value="">Select Status</option>
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="url">
                        <Form.Label>URL</Form.Label>
                        <Form.Control type="url" name="url" value={formData.url} onChange={handleChange} placeholder="Enter Project URL (Optional)" />
                    </Form.Group>
                </Row>

                {/* Remarks Row (Full Width) */}
                <Row className="mb-3">
                    <Form.Group as={Col} xs={12} controlId="remarks">
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control as="textarea" rows={3} name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Add any remarks for the project" />
                    </Form.Group>
                </Row>


                {/* Client Name Input with Suggestions & Add New Client Button Row */}
                <Row className="mb-4 align-items-end position-relative">
                    <Form.Group as={Col} md="6" controlId="client_name">
                        <Form.Label>Client Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="client_name"
                            value={formData.client_name}
                            onChange={handleChange}
                            placeholder="Type to search clients"
                            autoComplete="off"
                        />
                        {showSuggestions && clientSuggestions.length > 0 && (
                            <ListGroup
                                className="suggestions-list mt-1 shadow-sm"
                                style={{
                                    position: 'absolute',
                                    zIndex: 1000,
                                    width: 'calc(100% - 15px)',
                                    left: '7.5px',
                                    top: 'calc(100% + 5px)',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    borderRadius: '5px'
                                }}
                            >
                                {clientSuggestions.map((client) => (
                                    <ListGroup.Item
                                        key={client.client_id}
                                        action
                                        onClick={() => handleSuggestionClick(client)}
                                    >
                                        <strong>{client.first_name}</strong> ({client.company || 'N/A'}) - {client.country || 'N/A'}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                        {showSuggestions && !clientSuggestions.length && formData.client_name.length > 2 && (
                             <ListGroup
                                className="suggestions-list mt-1 shadow-sm"
                                style={{
                                    position: 'absolute',
                                    zIndex: 1000,
                                    width: 'calc(100% - 15px)',
                                    left: '7.5px',
                                    top: 'calc(100% + 5px)',
                                    borderRadius: '5px'
                                }}
                            >
                                <ListGroup.Item>No clients found matching "{formData.client_name}"</ListGroup.Item>
                            </ListGroup>
                        )}
                    </Form.Group>

                    <Col md="6" className="d-flex align-items-end">
                        <Button variant="outline-info" onClick={handleAddClientClick} className="w-100">
                            Add New Client
                        </Button>
                    </Col>
                </Row>

                {/* Submit Project Button */}
                <Button variant="primary" type="submit" className="w-100">
                    Update Project
                </Button>
            </Form>
        </Container>
    );
};

export default UpdateProject;