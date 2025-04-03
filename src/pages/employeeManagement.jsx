import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import AddEmployee from '../components/addEmployee';


function EmployeeMng() {

    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}/employees`);
                setEmployees(response.data); //Updating State with Fetched Data
            }
            catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div>

            <AddEmployee></AddEmployee>

            <h1>Employee List</h1>
            <Table striped bordered hover>
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
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default EmployeeMng;