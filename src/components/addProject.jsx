import React, { useState, useRef } from 'react';
import { Form, Button, Col, Row, Container, ListGroup } from 'react-bootstrap'; // Removed Alert, Spinner for minimalism
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AddProject = () => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        // proj_id: '',
        proj_name: '',
        start_date: '',
        end_date: '',
        status: '',
        remarks: '',
        url: '', // Added URL as it was in your formData but not in the form fields
        client_name: '',
        client_id: null,
    });

    const [clientSuggestions, setClientSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimeoutRef = useRef(null);

    const navigate = useNavigate();

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
                        setClientSuggestions([]); // Clear suggestions on error
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
            client_name: `${suggestion.first_name} (${suggestion.company})`,
            client_id: suggestion.client_id,
        }));
        setShowSuggestions(false);
        setClientSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const projectDataToSubmit = {
                // proj_id: formData.proj_id,
                proj_name: formData.proj_name,
                start_date: formData.start_date,
                end_date: formData.end_date,
                status: formData.status,
                remarks: formData.remarks,
                url: formData.url, 
                client_id: formData.client_id,
            };

            const projectResponse = await api.post(`/projects`, projectDataToSubmit);

            console.log('Project Data Submitted Successfully:', projectResponse.data);
            alert('Project added successfully!'); 

            setFormData({
                // proj_id: '',
                proj_name: '',
                start_date: '',
                end_date: '',
                status: '',
                remarks: '',
                url: '',
                client_name: '',
                client_id: null,
            });
            // navigate('/projects');

        } catch (err) {
            console.error('Error submitting data:', err);
            alert(`Error submitting Project Data: ${err.response?.data?.error || 'Please check your network or try again.'}`);
        }
    };

    const handleAddClientClick = () => {
        navigate('/clientManagement');
    };

    return (
        <Container className="my-5 p-4 border rounded shadow-sm">
            <h2 className="mb-4 text-center">Add New Project</h2>

            <Form onSubmit={handleSubmit}>
                {/* Project ID and Name Row */}
                <Row className="mb-3">
                    {/* <Form.Group as={Col} md="6" controlId="proj_id">
                        <Form.Label>Project ID</Form.Label>
                        <Form.Control type="text" name="proj_id" value={formData.proj_id} onChange={handleChange} placeholder="Enter Project ID" required />
                    </Form.Group> */}
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
                    <Form.Group as={Col} md="6" controlId="url"> {/* Added URL input field */}
                        <Form.Label>Project Detail URL</Form.Label>
                        <Form.Control type="url" name="url" value={formData.url} onChange={handleChange} placeholder="Enter Project Detail URL " />
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
                        {showSuggestions && clientSuggestions.length > 0 && ( // Only show if there are suggestions
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
                    Submit Project
                </Button>
            </Form>
        </Container>
    );
};

export default AddProject;