import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';

const AddProject = () => {
    const [formData, setFormData] = useState({
              
        client_id: '',
        first_name: '',
        last_name: '',
        country: '',
        company: '',
        email: '',
        contact_nu: '',

    });

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
                proj_type: formData.proj_type,
            });

            const clientResponse = await axios.post(`${backendUrl}/clients`, {  
                client_id: formData.client_id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                country: formData.country,
                company: formData.company,
                email: formData.email,
                contact_nu: formData.contact_nu,
            });

            console.log('Project Data Submitted:', projectResponse.data);
            console.log('Client Data Submitted:', clientResponse.data);
            alert('Project and Client Data Submitted Successfully!'); 

            //clear form
            setFormData({
                proj_id: '',
                proj_name: '',
                start_date: '',
                end_date: '',
                status: '',
                proj_type: '',
                client_id: '',
                first_name: '',
                last_name: '',
                country: '',
                company: '',
                email: '',
                contact_nu: '',
            })

        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error Submitting Data.  Check console for details.');
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4">
            <Row>
                <Col md={6}>
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

                        <Form.Group as={Col} controlId="proj_type">
                            <Form.Label>Project Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="proj_type"
                                value={formData.proj_type}
                                onChange={handleChange}
                                placeholder="e.g., Web Development"
                                required
                            />
                        </Form.Group>
                    </Row>
                </Col>
                <Col md={6}>
                    <h2 className="mb-4">Client Information</h2>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="client_id">
                            <Form.Label>Client ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="client_id"
                                value={formData.client_id}
                                onChange={handleChange}
                                placeholder="Enter Client ID"
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="first_name">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Enter First Name"
                                required
                                autoComplete="first_name"
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="last_name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Enter Last Name"
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="country">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Enter Country"
                                autoComplete="country"
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="company">
                            <Form.Label>Company</Form.Label>
                            <Form.Control
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Enter Company"
                                autoComplete="company"
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                required
                                autoComplete="email"
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} controlId="contact_nu">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="contact_nu"
                                value={formData.contact_nu}
                                onChange={handleChange}
                                placeholder="Enter Contact Number"
                            />
                        </Form.Group>
                    </Row>
                </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-4">
                Submit
            </Button>
        </Form>
    );
};

export default AddClient;

