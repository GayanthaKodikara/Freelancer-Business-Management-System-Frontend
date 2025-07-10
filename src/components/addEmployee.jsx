import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import api from '../api';
import { useNavigate } from 'react-router-dom';



function AddEmployee() {

    const navigate = [useNavigate]
    const [values, setValues] = useState({
        empId: '',
        firstName: '',
        lastName: '',
        workshopName: '',
        designCategory: '',
        address: '',
        birthday: '',
        email: '',
        nic: '',
        role: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
       
        try {
            const response = await api.post(`/employees`, {
                empId: values.empId,
                first_name: values.firstName,
                last_name: values.lastName,
                workshop_name: values.workshopName,
                design_category: values.designCategory,
                address: values.address,
                birth_day: values.birthday,
                email: values.email,
                nic: values.nic,
                role: values.role,
                permission: 'TRUE'
            });

            console.log('Employee added successfully:', response.data);

        } catch (error) {
            console.error('Error adding employee:', error);

        }
    };

    return (
        <div>
            <h1>Add Employee</h1>
            <Form onSubmit={handleSubmit}>

                <Row className="mb-3">
                    <Form.Group as={Col} md="4">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>NIC</Form.Label>
                        <Form.Control
                            type="text"
                            name="nic"
                            value={values.nic}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} md="4">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={values.address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Birthday</Form.Label>
                        <Form.Control
                            type="date"
                            name="birthday"
                            value={values.birthday}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="4">
                        <Form.Label>Workshop Name</Form.Label>
                        <Form.Select
                            name="workshopName"
                            value={values.workshopName}
                            onChange={handleChange}
                        >
                            <option value="">Select Workshop</option>
                            <option value="Head Office Thalawa">Head Office (Thalawa)</option>
                            <option value="Workshop A Thalawa">Workshop A (Thalawa)</option>
                            <option value="Workshop B Anuradhapura">Workshop B (Anuradhapura)</option>
                            <option value="Workshop C Anuradhapura">Workshop C (Anuradhapura)</option>
                            <option value="Work From Home Employee">Work From Home Employee</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                        >
                            <option value="">Select Role</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Customer Support Engineer">Customer Support Engineer</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Workshop Supervisour">Workshop Supervisour</option>
                            <option value="Designer">Designer</option>
                            <option value="Fabricator">Fabricator</option>

                        </Form.Select>
                    </Form.Group>

                    {values.role === 'Designer' && (
                        <Form.Group as={Col} md="4">
                            <Form.Label>Design Category</Form.Label>
                            <Form.Select
                                name="designCategory"
                                value={values.designCategory}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                <option value="Graphic Design">Graphic Design</option>
                                <option value="Web Design">Web Design</option>
                                <option value="3D Modeling">3D Modeling</option>
                            </Form.Select>
                        </Form.Group>
                    )}
                </Row>

                <Button variant="primary" type="submit">
                    Add Employee
                </Button>
            </Form>
        </div>
    );
}

export default AddEmployee;