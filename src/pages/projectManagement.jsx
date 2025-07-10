import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';


function ProjectMng() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get(`/projects`);
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching Projects:', error);
            }
        };
        fetchProjects();
    }, [navigate]);


    const handleAddProject = async () => {
        navigate(`/projectManagement/addProject`);
    };
    const handleUpdate = async (proj_id) => {
        navigate(`/projectManagement/updateProject/${proj_id}`);
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
                                <th>Remarks</th>
                                <th>Project Detail URL</th>
                                <th>Update Project</th>
                                <th>Project Breakdown</th>
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
                                    <td>{project.remarks}</td>
                                    <td><a href={project.url} target="_blank" rel="noopener noreferrer">
                                        Link
                                    </a></td>
                                    <td>
                                        <Button onClick={() => handleUpdate(project.proj_id)} variant="success" size="sm">
                                            Update
                                        </Button>
                                    </td>
                                    <td>
                                        <Button onClick={() => navigate(`/projectManagement/breakdown/${project.proj_id}`)} variant="success" size="sm">
                                            Breakdown
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