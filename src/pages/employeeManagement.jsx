import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
// import TopupMessage from '../components/topupMesssage';


function EmployeeMng() {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const [alerts, setAlert] = useState({ show: false, message: '', variant: '' });

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            alert('Error fetching employees:', error); 
        }
    };

    // Fetch employee details from backend
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Redirect to Add Employee Page
    const handleAddEmployee = async () => {
        navigate(`/employeeManagement/addEmployee`);
    };

    // Redirect to Employee Update Page
    const handleUpdate = async (empId) => {
        navigate(`/employeeManagement/updateEmployee/${empId}`);
    };

    // Remove Employee Permission
    const handleRemovePermission = async (empId) => {
        try {
            await api.put(`/employees/remove/${empId}`, { permission: "FALSE" });
            fetchEmployees();
            alert("Successfully Removed permission for employee ID " + empId);
            // setAlert({ show: true, message: `Successfully Granted permission for employee ID ${empId}`, variant: 'success' });


        } catch (error) {
            console.error('Error removing permission:', error);
            // setAlert({ show: true, message: 'Error giving permission', variant: 'danger' });
        }
    };

    // Give Employee Permission
    const handleGivePermission = async (empId) => {
        try {
            await api.put(`/employees/remove/${empId}`, { permission: "TRUE" });
            fetchEmployees();
            alert("Successfully Granted permission for employee ID " + empId);

        } catch (error) {
            console.error('Error giving permission:', error);
        }
    };

    return (
        <Container fluid>
             {/* {alerts.show && <TopupMessage message={alerts.message} variant={alerts.variant} onClose={() => setAlert({ ...alerts, show: false })} />} */}
            <Row className="mb-3">
                <Col className="d-flex justify-content-end">
                    <Button onClick={handleAddEmployee} variant="primary">
                        Add New Employee
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1>Employee List</h1>
                    <Table striped bordered hover responsive="lg">
                        <thead>
                            <tr>
                                <th>Emp. ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Workshop Name</th>
                                <th>Design Category</th>
                                <th>Address</th>
                                <th>Birthday</th>
                                <th>Email</th>
                                <th>NIC</th>
                                <th>Role</th>
                                <th>Update Employee</th>
                                <th>Remove Permission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.emp_id}>
                                    <td>{employee.emp_id}</td>
                                    <td>{employee.first_name}</td>
                                    <td>{employee.last_name}</td>
                                    <td>{employee.workshop_name}</td>
                                    <td>{employee.design_category}</td>
                                    <td>{employee.address}</td>
                                    <td>{new Date(employee.birth_day).toLocaleDateString()}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.nic}</td>
                                    <td>{employee.role}</td>
                                    <td>
                                        <Button onClick={() => handleUpdate(employee.emp_id)} variant="success" size="sm">
                                            Update
                                        </Button>
                                    </td>
                                    <td>
                                        {employee.permission === "TRUE" ? (
                                            <Button
                                                onClick={() => handleRemovePermission(employee.emp_id)}
                                                variant="danger"
                                                size="sm"
                                            >
                                                Remove
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleGivePermission(employee.emp_id)}
                                                variant="secondary" size="sm" >
                                                Removed
                                            </Button>
                                        )}
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

export default EmployeeMng;