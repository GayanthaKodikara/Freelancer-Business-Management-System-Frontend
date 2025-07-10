import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function UpdateInventory() {
    const navigate = useNavigate();
    const { itemCode } = useParams(); 
    const [formData, setFormData] = useState({
        name: '',
        shop: '',
        buying_date: '',
        price: '',
        quantity: '',
        location: ''
    });

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await api.get(`/inventory/${itemCode}`);
                const itemData = response.data;

                // Format the date for the input field (YYYY-MM-DD)
                const formattedDate = itemData.purchase_date
                    ? new Date(itemData.purchase_date).toISOString().split('T')[0]
                    : '';

                setFormData({
                    name: itemData.item_name || '', // Use item_name from backend
                    shop: itemData.shop || '',
                    buying_date: formattedDate,
                    price: itemData.price !== undefined ? itemData.price : '',
                    quantity: itemData.quantity !== undefined ? itemData.quantity : '',
                    available_quantity: itemData.available_quantity !== undefined ? itemData.available_quantity : '',
                    location: itemData.location || ''
                });
            } catch (err) {
                console.error('Error fetching inventory item for update:', err);
               
            }
        };

        if (itemCode) {
            fetchItem();
        } else {
            console.error('No item code provided for update.');
        }
    }, [itemCode]); // Re-run when itemCode changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation (ensure consistency with AddInventory and backend)
        if (!formData.name || !formData.buying_date || !formData.price || !formData.quantity || !formData.available_quantity || !formData.location) {
            console.error('Please fill in all required fields (Name, Buying Date, Price, Quantity, Available Quantity, Location).');
            return;
        }

        try {
            // Ensure price, quantity, and available_quantity are numbers
            const dataToSend = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10),
                available_quantity: parseInt(formData.available_quantity, 10),
            };

            const response = await api.put(`/inventory/${itemCode}`, dataToSend);

        } catch (err) {
            console.error('Error updating inventory:', err);
        }
    };

    return (
        <Container className="my-4">
            <Row className="justify-content-md-center">
                <Col md={8} lg={6}>
                    <h2>Update Inventory Item (Code: {itemCode})</h2>
                    
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="formName">
                                <Form.Label>Item Name </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter item name"
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6" controlId="formShop">
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
                            <Form.Group as={Col} md="6" controlId="formBuyingDate">
                                <Form.Label>Buying Date </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="buying_date"
                                    value={formData.buying_date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="6" controlId="formPrice">
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
                            <Form.Group as={Col} md="6" controlId="formQuantity">
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

                            <Form.Group as={Col} md="6" controlId="formAvailableQuantity">
                                <Form.Label>Available Quantity </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="available_quantity"
                                    value={formData.available_quantity}
                                    onChange={handleChange}
                                    placeholder="Enter available quantity"
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formLocation">
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

                        <Button variant="success" type="submit" className="me-2">
                            Update Inventory
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/inventory')}>
                            Cancel
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default UpdateInventory;