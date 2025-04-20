import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function UpdateEmployee() {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    empId: empId || '',
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
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${backendUrl}/employees/${empId}`);
        setValues({
          empId: response.data.emp_id,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          workshopName: response.data.workshop_name,
          designCategory: response.data.design_category,
          address: response.data.address,
          birthday: response.data.birth_day ? response.data.birth_day.substring(0, 10) : '',
          email: response.data.email,
          nic: response.data.nic,
          role: response.data.role,
        });
      } catch (error) {
        console.error('Error fetching employee:', error);
        alert('Could not find employee with this ID.');
      }
    };

    fetchEmployee();
  }, [empId, backendUrl]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${backendUrl}/employees/${values.empId}`, {
        first_name: values.firstName,
        last_name: values.lastName,
        workshop_name: values.workshopName,
        design_category: values.designCategory,
        address: values.address,
        birth_day: values.birthday,
        email: values.email,
        nic: values.nic,
        role: values.role,
      });
      alert('Employee updated successfully!');
      navigate('/employeeManagement');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee.');
    }
  };

  return (
    <div>
      <h1>Update Employee</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control type="text" name="empId" value={values.empId} readOnly />
          </Form.Group>
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
              <option value="Workshop A">Workshop A</option>
              <option value="Workshop B">Workshop B</option>
              <option value="Workshop C">Workshop C</option>
            </Form.Select>
          </Form.Group>
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
          <Form.Group as={Col} md="4">
            <Form.Label>Role</Form.Label>
            <Form.Select name="role" value={values.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={values.address}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="3">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              name="birthday"
              value={values.birthday}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="3">
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
          <Form.Group as={Col} md="6">
            <Form.Label>NIC</Form.Label>
            <Form.Control type="text" name="nic" value={values.nic} onChange={handleChange} />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">
          Update Employee
        </Button>
      </Form>
    </div>
  );
}

export default UpdateEmployee;