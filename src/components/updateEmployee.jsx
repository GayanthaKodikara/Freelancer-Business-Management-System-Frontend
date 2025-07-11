import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import api from '../api';

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
    resetPassword: false, // Initialize resetPassword state
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employees/${empId}`);
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
          resetPassword: false, // Reset checkbox state when fetching employee
        });
      } catch (error) {
        console.error('Error fetching employee:', error);
        alert('Could not find employee with this ID.');
      }
    };

    fetchEmployee();
  }, [empId]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const dataToUpdate = {
        first_name: values.firstName,
        last_name: values.lastName,
        workshop_name: values.workshopName,
        design_category: values.designCategory,
        address: values.address,
        birth_day: values.birthday,
        email: values.email,
        nic: values.nic,
        role: values.role,
      };

      if (values.resetPassword) {
        dataToUpdate.password = values.nic;
      }

      await api.put(`/employees/${values.empId}`, dataToUpdate);
      alert('Employee updated successfully!');
      navigate('/employeeManagement');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error Updating Employee: ' + (error?.response?.data?.error || 'Unknown error occurred'));
    }
  };

  return (
    <div>
      <h1>Update Employee</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4 mt-4">
          <Form.Group as={Col} md="12">
            <Form.Label>Employee ID = {values.empId}</Form.Label>
          </Form.Group>
        </Row>

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
            <Form.Label>Other names</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={values.lastName}
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
            <Form.Label>NIC</Form.Label>
            <Form.Control type="text" name="nic" value={values.nic} onChange={handleChange} />
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
            <Form.Select name="role" value={values.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="Administrator">Administrator</option>
              <option value="Customer Support Engineer">Customer Support Engineer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Workshop Supervisor">Workshop Supervisor</option>
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

        <Row className="mb-3 mt-4">
          <Form.Group as={Col} md="6">
            <Form.Check type="checkbox" id="reset-password-checkbox" label="Reset Password" name="resetPassword"
              checked={values.resetPassword}
              onChange={handleChange}
            />
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