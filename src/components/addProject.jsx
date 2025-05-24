import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AddProject = () => {
    const [formData, setFormData] = useState({
        proj_id: '',
        proj_name: '',
        start_date: '',
        end_date: '',
        status: '',
        remarks: '',
        client_name: '', // Added client_name to formData for the input field
    });

    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const projectResponse = await axios.post(`${backendUrl}/projects`, {
                proj_id: formData.proj_id,
                proj_name: formData.proj_name,
                start_date: formData.start_date,
                end_date: formData.end_date,
                status: formData.status,
                remarks: formData.remarks,
            });


            console.log('Project Data Submitted:', projectResponse.data);
            alert('Project Data Submitted Successfully!'); // Modified alert as client submission is now separate

            //clear form
            setFormData({
                proj_id: '',
                proj_name: '',
                start_date: '',
                end_date: '',
                status: '',
                remarks: '',
                client_name: '',
            })

        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error Submitting Project Data. Check console for details.');
        }
    };

    // Function to handle navigation to AddClient page
    const handleAddClientClick = () => {
        navigate('/addClient');
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4">
            <Row>
                <Col md={12}>
                    <h2 className="mb-4">Project Information</h2>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="proj_id">
                            <Form.Label>Project ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="proj_id"
                                value={formData.proj_id}
                                onChange={handleChange}
                                placeholder="Enter Project ID"
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="proj_name">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="proj_name"
                                value={formData.proj_name}
                                onChange={handleChange}
                                placeholder="Enter Project Name"
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="start_date">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="end_date">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="remarks">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                                type="text"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Remarks"
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group as={Col} controlId="client_name">
                            <Form.Label>Client Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="client_name"
                                value={formData.client_name}
                                onChange={handleChange}
                                placeholder="Enter Client Name"
                                required
                            />
                        </Form.Group>

                        {/* Modified the Button to use onClick for navigation */}
                        <Form.Group as={Col} controlId="add_client_button">
                            <Button variant="info" onClick={handleAddClientClick} className="mt-4">
                                Add New Client
                            </Button>
                        </Form.Group>
                    </Row>

                </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-4">
                Submit Project
            </Button>
        </Form>
    );
};

export default AddProject;