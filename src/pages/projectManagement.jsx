import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ProjectMng() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 

    // fetch employee details from backend
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${backendUrl}/projects`);
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching Projects:', error);
            }
        };

        fetchProjects();
    }, [backendUrl]); // Add backendUrl to the dependency array

    // Redirect to Add Employee Page
    const handleAddProject = () => {
        navigate(`/projectManagement/addProject`);
    };


   
    return (
        <Container fluid>
            <Row className="mb-3">
                <Col className="d-flex justify-content-end">
                    <Button onClick={handleAddProject} variant="primary">
                        Add New Project
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1>Project List</h1>
                    <Table striped bordered hover responsive="lg">
                        <thead>
                            <tr>
                                <th>Project ID</th>
                                <th>Project Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Project Type</th>
                                <th>Update Project</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.proj_id}>
                                    <td>{project.proj_id}</td>
                                    <td>{project.proj_name}</td>
                                    <td>{new Date(project.start_date).toLocaleDateString()}</td>
                                    <td>{new Date(project.end_date).toLocaleDateString()}</td>
                                    <td>{project.status}</td>
                                    <td>{project.proj_type}</td>
                                    <td>
                                        <Button onClick={() => handleUpdate(project.proj_id)} variant="success" size="sm">
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

export default ProjectMng;