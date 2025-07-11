import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AddInventory() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        shop: '',
        buying_date: '',
        price: '',
        quantity: '',
        location: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.buying_date || !formData.price || !formData.quantity || !formData.location) {
            setError('Please fill in all required fields (Name, Buying Date, Price, Quantity, Location).');
            return;
        }

        try {
            const response = await api.post('/inventory', dataToSend);
            alert('Inventory item added successfully!');
            setFormData({
                name: '',
                shop: '',
                buying_date: '',
                price: '',
                quantity: '',
                location: ''
            });

        } catch (err) {
            console.error('Error adding inventory:', err);
            alert('Failed to add inventory. Please try again. ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <Container >
            <Row className="justify-content-md-center">
                <h2>Add New Inventory Item</h2>
                <Form onSubmit={handleSubmit}>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter item name"
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                            <Form.Label>Shop</Form.Label>
                            <Form.Control
                                type="text"
                                name="shop"
                                value={formData.shop}
                                onChange={handleChange}
                                placeholder="Enter shop name"
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label>Buying Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="buying_date"
                                value={formData.buying_date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                            <Form.Label>Price (Rs.) </Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                step="0.01"
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <Form.Label>Quantity </Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                            <Form.Label>Stock Location </Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter stock location"
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Button variant="primary" type="submit" className="me-2">
                        Add Inventory
                    </Button>
                </Form>
            </Row>
        </Container>
    );
}

export default AddInventory;