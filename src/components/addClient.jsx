import React, { useState } from 'react';
import { Form, Button, Col, Row, Container } from 'react-bootstrap';
import axios from 'axios';

const AddClient = () => {
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
            // Making API call specifically for clients
            const clientResponse = await axios.post(`${backendUrl}/clients`, {
                client_id: formData.client_id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                country: formData.country,
                company: formData.company,
                email: formData.email,
                contact_nu: formData.contact_nu,
            });

            console.log('Client Data Submitted:', clientResponse.data);
            alert('Client Data Submitted Successfully!');

            // Clear the form after successful submission
            setFormData({
                client_id: '',
                first_name: '',
                last_name: '',
                country: '',
                company: '',
                email: '',
                contact_nu: '',
            });

        } catch (error) {
            console.error('Error submitting client data:', error);
            // More user-friendly error message
            alert('Error Submitting Client Data. Please check the console for details.');
        }
    };

    return (
        <Container className="my-5 p-4 border rounded shadow-sm">
            <h2 className="mb-4 text-center">Add New Client</h2>
            <Form onSubmit={handleSubmit} className="p-4">
                
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="client_id">
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

                        <Form.Group as={Col} md="6" controlId="first_name">
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
                        <Form.Group as={Col} md="6" controlId="last_name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Enter Last Name"
                                required
                                autoComplete="last_name"
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="6" controlId="country">
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
                        <Form.Group as={Col} md="6" controlId="company">
                            <Form.Label>Company</Form.Label>
                            <Form.Control
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Enter Company"
                                autoComplete="organization" // Better autoComplete for company
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="6" controlId="email">
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
                        <Form.Group as={Col} md="6" controlId="contact_nu">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                                type="tel" // Changed to 'tel' for phone numbers
                                name="contact_nu"
                                value={formData.contact_nu}
                                onChange={handleChange}
                                placeholder="Enter Contact Number"
                                autoComplete="tel"
                            />
                        </Form.Group>
                        <Col></Col> {/* Empty column to balance the layout */}
                    </Row>
                <Button variant="primary" type="submit" className="mt-4">
                    Add Client
                </Button>
            </Form>
        </Container>
    );
};

export default AddClient;