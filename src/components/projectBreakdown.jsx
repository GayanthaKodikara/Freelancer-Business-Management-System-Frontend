import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import api from '../api';

function ProjectBreakdownDetails() {
    const { proj_id: project_id } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [costData, setCostData] = useState([]);
    const [totalCost, setTotalCost] = useState(0.0);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await api.get(`/projectbreakdown/${project_id}`);
                setProjectData(response.data);
                console.log("Fetched project data:", response.data);

                const costresponse = await api.get(`/costbreakdown/${project_id}`);
                setCostData(costresponse.data.cost_breakdown);
                console.log("Fetched project data:", costresponse.data.cost_breakdown);
                setTotalCost(costresponse.data.total_project_cost);

            } catch (err) {
                console.error("Error fetching project breakdown details:", err);
                console.error(err.response?.data?.error || 'Failed to fetch project details. Please try again.');
            } finally {
            }
        };

        if (project_id) {
            fetchProjectDetails();
        }
    }, [project_id]);


    if (!projectData || !projectData.project_details) {
        return (
            <Container className="mt-4">
                <Alert variant="info">
                    <Alert.Heading>No Project Found</Alert.Heading>
                    <p>No details available for this project ID or data is incomplete.</p>
                </Alert>
            </Container>
        );
    }


    const { project_details, breakdown_history } = projectData;

    return (
        <Container fluid className="py-4">
            <h1 className="mb-4 text-center">Project Name: {project_details.proj_name}</h1>

            <Card className="mb-4 shadow-sm">
                <Card.Header as="h5" className="bg-primary text-white">Project Information</Card.Header>
                <Card.Body>
                    <Row className="mb-2">
                        <Col md={6}><strong>Project ID:</strong> {project_details.proj_id}</Col>
                        <Col md={6}><strong>Project Name:</strong> {project_details.proj_name}</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={6}><strong>Start Date:</strong> {project_details.start_date ? new Date(project_details.start_date).toLocaleDateString() : 'N/A'}</Col>
                        <Col md={6}><strong>End Date:</strong> {project_details.end_date ? new Date(project_details.end_date).toLocaleDateString() : 'N/A'}</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={6}><strong>Status:</strong> {project_details.status}</Col>
                        <Col md={6}><strong>Remarks:</strong> {project_details.remarks || 'N/A'}</Col>
                    </Row>
                    <Row>
                        <Col md={6}><strong>Client Name:</strong> {project_details.client_name}</Col>
                        <Col md={6}><strong>Company:</strong> {project_details.company}</Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Header as="h5" className="bg-info text-white">Project Breakdown</Card.Header>
                <Card.Body>
                    {breakdown_history && breakdown_history.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {breakdown_history.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.date_time ? new Date(entry.date_time).toLocaleString() : 'N/A'}</td>
                                        <td>{entry.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert variant="secondary" className="text-center">
                            No breakdown history available for this project.
                        </Alert>
                    )}
                </Card.Body>
            </Card>

            <Card className="mt-4">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Project Cost Breakdown</h5>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table bordered hover>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Item Name</th>
                                    <th>Unit Price (Rs.)</th>
                                    <th>Quantity</th>
                                    <th>Total Price(Rs.)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(costData) && costData.length > 0 ? (
                                    costData.map((entry) => (
                                        <tr key={entry.cost_id}>
                                            <td>{entry.inventory_name}</td>
                                            <td>{entry.inventory_price?.toFixed(2)}</td>
                                            <td>{entry.quantity}</td>
                                            <td>{entry.item_total_cost?.toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No cost data available</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="3" className="text-end">
                                        Total Project Cost (Rs.):
                                    </th>
                                    <th>{totalCost.toFixed(2)}</th>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

        </Container>
    );
}

export default ProjectBreakdownDetails;
