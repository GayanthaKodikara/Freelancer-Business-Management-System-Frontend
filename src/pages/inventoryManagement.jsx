import React, { useState, useEffect } from 'react';  
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function InventoryMng() {
    const [inventory, setInventory] = useState([]);
    const navigate = useNavigate();

    const fetchInventory = async () => {
            try {
                const response = await api.get(`/inventory`); 
                setInventory(response.data);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleAddInventory = () => {
        navigate(`/inventory/addInventory`); 
    };

    const handleUpdateInventory = (itemCode) => {
        navigate(`/inventory/updateInventory/${itemCode}`); 
    };

    return (
        <Container fluid>
            <Row className="mb-3">
                <Col className="d-flex justify-content-end">
                    <Button onClick={handleAddInventory} variant="primary">
                        Add New Inventory
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1>Inventory List</h1>
                    <Table striped bordered hover responsive="lg">
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Purchase Date</th>
                                <th>Price</th>
                                <th>Shop</th>
                                <th>Project ID</th>
                                <th>Availability</th>
                                <th>Update Inventory</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.item_code}>
                                    <td>{item.item_code}</td>
                                    <td>{item.item_name}</td>
                                    <td>{new Date(item.purchase_date).toLocaleDateString()}</td>
                                    <td>Rs.{item.price ? parseFloat(item.price).toFixed(2) : ''}</td>
                                    <td>{item.shop}</td>
                                    <td>{item.proj_id}</td>
                                    <td>{item.availability ? 'Yes' : 'No'}</td>
                                    <td>
                                        <Button onClick={() => handleUpdateInventory(item.item_code)} variant="success" size="sm">
                                            Update
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default InventoryMng;