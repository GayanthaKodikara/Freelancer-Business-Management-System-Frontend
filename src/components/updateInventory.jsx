import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function UpdateInventory() {
    const navigate = useNavigate();
    const { itemCode } = useParams();
    const [formData, setFormData] = useState({
        itemCode: itemCode || '',
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
                setFormData({
                    name: response.data.item_name,
                    shop: response.data.shop,
                    buying_date: response.data.buying_date ? response.data.buying_date.substring(0, 10) : '',
                    price: response.data.price,
                    quantity: response.data.quantity,
                    location: response.data.location
                });
            } catch (err) {
                console.error('Error fetching inventory item for update:', err);
                alert('Could not find inventory with this code.');
            }
        };
        fetchItem();

    }, [itemCode]); // Re-run when itemCode changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Ensure price, quantity, and available_quantity are numbers
            const dataToSend = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10),
                // available_quantity: parseInt(formData.available_quantity, 10),
            };

            await api.put(`/inventory/${itemCode}`, dataToSend);
            alert('Inventory updated successfully!');
            navigate('/inventoryManagement');
        } catch (err) {
            console.error('Error updating inventory:', err);
            alert('Error updating inventory.');
        }
    };

    return (
        <Container className="my-4">
            <Row className="justify-content-md-center">
                <Col md={12}>
                    <h2>Update Inventory Item </h2>

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
                            <Form.Group as={Col} md="6" controlId="formLocation">
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

                        <Button variant="success" type="submit" className="me-2">
                            Update Inventory
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default UpdateInventory;