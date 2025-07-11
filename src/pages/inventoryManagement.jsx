
import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function InventoryMng() {
    const [inventory, setInventory] = useState([]);
    const [projects, setProjects] = useState([]);
    const [assignmentData, setAssignmentData] = useState({});


    const navigate = useNavigate();

    const fetchInventory = async () => {
        try {
            const response = await api.get(`/inventory`);
            setInventory(response.data);
            const initialAssignmentData = {};
            response.data.forEach(item => {
                initialAssignmentData[item.item_code] = { proj_id: '', quantity: '' };
            });
            setAssignmentData(initialAssignmentData);
        } catch (err) {
            console.error('Error fetching inventory:', err);
            alert(err.response?.data?.error || 'Failed to fetch inventory.');
        } finally {
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            const inProgressProjects = response.data.filter(
                (project) => project.status === 'On Progress' || 'Not Started'
            );
            setProjects(inProgressProjects);
        } catch (err) {
            console.error('Error fetching projects:', err);
            alert(err.response?.data?.error || 'Failed to fetch projects.');
        }
    };

    useEffect(() => {
        fetchInventory();
        fetchProjects();
    }, []);

    const handleAddInventory = () => {
        navigate(`/inventoryManagement/addInventory`);
    };

    const handleUpdateInventory = (item_Code) => {
        navigate(`/inventoryManagement/updateInventory/${item_Code}`);
    };

    const handleProjectChange = (itemCode, projId) => {
        setAssignmentData(prevData => ({
            ...prevData,
            [itemCode]: { ...prevData[itemCode], proj_id: projId }
        }));
    };

    const handleQuantityChange = (itemCode, quantity) => {
        setAssignmentData(prevData => ({
            ...prevData,
            [itemCode]: { ...prevData[itemCode], quantity: quantity }
        }));
    };

    const handleAssign = async (itemCode) => {
        const { proj_id, quantity } = assignmentData[itemCode];

        if (!proj_id) {
            alert('Please select a project.');
            return;
        }
        if (!quantity || isNaN(quantity) || parseFloat(quantity) <= 0) {
            alert('Please enter a valid positive quantity.');
            return;
        }

        try {
            await api.put(`/inventory/assign/${itemCode}`, {
                proj_id: proj_id,
                requested_quantity: parseFloat(quantity), // Ensure it's a number
                description: `Assigned ${quantity} units of ${inventory.find(inv => inv.item_code === itemCode)?.item_name || 'item'} to project ${projects.find(p => p.proj_id === proj_id)?.proj_name || proj_id}`
            });
            alert(`Successfully assigned ${quantity} units of ${inventory.find(inv => inv.item_code === itemCode)?.item_name || 'item'} to project.`);
            fetchInventory();

            setAssignmentData(prevData => ({
                ...prevData,
                [itemCode]: { proj_id: '', quantity: '' }
            }));
        } catch (err) {
            console.error('Error assigning inventory:', err);
            alert(err.response?.data?.error || 'Failed to assign inventory. Please try again.');
        }
    };



    return (
        <Container fluid className="py-4">
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
                                <th>Item Code</th><th>Item Name</th><th>Purchase Date</th><th>Price</th><th>Shop</th><th>Quantity</th><th>Available Quantity</th><th>Stock Location</th><th>Update Inventory</th><th>Assign to Project</th>
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
                                    <td>{item.quantity}</td>
                                    <td>{item.available_quantity}</td>
                                    <td>{item.location}</td>
                                    <td>
                                        <Button onClick={() => handleUpdateInventory(item.item_code)} variant="success" size="sm">
                                            Update
                                        </Button>
                                    </td>
                                    <td>
                                        <Form.Select
                                            size="sm"
                                            className="mb-2"
                                            value={assignmentData[item.item_code]?.proj_id || ''}
                                            onChange={(e) => handleProjectChange(item.item_code, e.target.value)}
                                        >
                                            <option value="">Select Project</option>
                                            {projects.map((project) => (
                                                <option key={project.proj_id} value={project.proj_id}>
                                                    {project.proj_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control
                                            type="number"
                                            placeholder="Quantity"
                                            size="sm"
                                            className="mb-2"
                                            value={assignmentData[item.item_code]?.quantity || ''}
                                            onChange={(e) => handleQuantityChange(item.item_code, e.target.value)}
                                            min="1"
                                        />
                                        <Button
                                            onClick={() => handleAssign(item.item_code)}
                                            variant="info"
                                            size="sm"
                                            disabled={!assignmentData[item.item_code]?.proj_id || !assignmentData[item.item_code]?.quantity || parseFloat(assignmentData[item.item_code]?.quantity) <= 0}
                                        >
                                            Assign
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {inventory.length === 0 && (
                                <tr>
                                    <td colSpan="10" className="text-center">No inventory items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default InventoryMng;