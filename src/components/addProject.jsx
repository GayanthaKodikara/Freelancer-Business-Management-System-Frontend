// src/components/AddProject.jsx - Frontend Component for Adding Projects

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Button, Col, Row, Container, Alert, Spinner, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
    // --- State Management ---
    // formData: Holds the values for all input fields in the project form.
    const [formData, setFormData] = useState({
        proj_id: '',
        proj_name: '',
        start_date: '',
        end_date: '',
        status: '',
        remarks: '',       // Corresponds to 'remarks' field in backend
        client_name: '',   // User types here for client suggestions
        client_id: null,   // Stores the ID of the selected client to send to backend
    });

    // clientSuggestions: Array to store client objects fetched from the suggestions API.
    const [clientSuggestions, setClientSuggestions] = useState([]);
    // showSuggestions: Boolean to control the visibility of the suggestions dropdown.
    const [showSuggestions, setShowSuggestions] = useState(false);
    // suggestionsLoading: Boolean to indicate if client suggestions are currently being fetched.
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    // suggestionsError: Stores any error message that occurs during suggestion fetching.
    const [suggestionsError, setSuggestionsError] = useState(null);
    // debounceTimeoutRef: A ref to hold the timeout ID for debouncing API calls for suggestions.
    const debounceTimeoutRef = useRef(null);

    // formLoading: Boolean to indicate if the main project form is currently being submitted.
    const [formLoading, setFormLoading] = useState(false);
    // formError: Stores any error message from the main form submission.
    const [formError, setFormError] = useState(null);
    // formSuccess: Stores a success message after a successful form submission.
    const [formSuccess, setFormSuccess] = useState(null);

    // useNavigate hook from react-router-dom for programmatic navigation.
    const navigate = useNavigate();
    // backendUrl: Fetches the backend API base URL from Vite's environment variables.
    // Ensure you have VITE_BACKEND_URL defined in your .env file (e.g., VITE_BACKEND_URL=http://localhost:5000/api).
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // --- Event Handlers ---

    /**
     * Handles changes to any form input field.
     * Updates the formData state based on the input's name and value.
     * Also triggers client suggestions fetching if the 'client_name' field is changed.
     * @param {Event} e - The change event from the input field.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the form data for the changed input
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        // Special handling for the client_name input to fetch suggestions
        if (name === 'client_name') {
            // Clear any existing debounce timeout to reset the timer
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            // Only fetch suggestions if the input has more than 2 characters
            // and set client_id to null as the user is typing a new name
            if (value.length > 2) {
                setSuggestionsLoading(true); // Indicate that suggestions are loading
                setSuggestionsError(null);   // Clear any previous suggestion errors
                setShowSuggestions(true);    // Make the suggestions dropdown visible
                setFormData(prevData => ({ ...prevData, client_id: null })); // Clear client_id on new typing

                // Set a new debounce timeout
                debounceTimeoutRef.current = setTimeout(async () => {
                    try {
                        // Make an API call to the backend suggestions endpoint
                        const response = await axios.get(`${backendUrl}/clients/suggestions?query=${value}`);
                        setClientSuggestions(response.data); // Update suggestions state
                        setSuggestionsLoading(false); // End loading
                    } catch (err) {
                        console.error('Error fetching client suggestions:', err);
                        setSuggestionsError('Failed to load client suggestions. Please try again.'); // Set user-friendly error
                        setSuggestionsLoading(false); // End loading
                    }
                }, 300); // Debounce time: 300 milliseconds
            } else {
                // If input is too short or cleared, clear and hide suggestions
                setClientSuggestions([]);
                setShowSuggestions(false);
                setSuggestionsLoading(false);
                setFormData(prevData => ({ ...prevData, client_id: null })); // Ensure client_id is cleared
            }
        }
    };

    /**
     * Handles the click event when a client suggestion is selected from the dropdown.
     * Fills the 'client_name' input with formatted client details and sets the 'client_id' in formData.
     * Hides the suggestions list.
     * @param {Object} suggestion - The selected client object from the suggestions.
     */
    const handleSuggestionClick = (suggestion) => {
        setFormData(prevData => ({
            ...prevData,
            // Display client's first name and company in the input field
            client_name: `${suggestion.first_name} (${suggestion.company})`,
            client_id: suggestion.client_id, // Store the actual client_id for backend submission
        }));
        setShowSuggestions(false);    // Hide the dropdown
        setClientSuggestions([]);     // Clear suggestions
    };

    /**
     * Handles the submission of the main project form.
     * Sends a POST request to the backend to add a new project.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser form submission
        setFormLoading(true); // Start form submission loading
        setFormError(null);   // Clear previous form errors
        setFormSuccess(null); // Clear previous form success messages

        try {
            // Construct the payload for the project creation API.
            // Ensure client_id is included if a client was selected.
            // 'remarks' is now included as per your backend blueprint.
            const projectDataToSubmit = {
                proj_id: formData.proj_id,
                proj_name: formData.proj_name,
                start_date: formData.start_date,
                end_date: formData.end_date,
                status: formData.status,
                remarks: formData.remarks,
                client_id: formData.client_id, // Send the selected client_id to the backend
            };

            // Perform the POST request to your backend's projects endpoint
            const projectResponse = await axios.post(`${backendUrl}/projects`, projectDataToSubmit);

            console.log('Project Data Submitted:', projectResponse.data);
            setFormSuccess('Project Data Submitted Successfully!'); // Set success message for user

            // Clear the form after successful submission
            setFormData({
                proj_id: '',
                proj_name: '',
                start_date: '',
                end_date: '',
                status: '',
                remarks: '',
                client_name: '',
                client_id: null,
            });
        } catch (err) {
            console.error('Error submitting data:', err);
            // Provide a user-friendly error message based on the error response
            if (err.response && err.response.data && err.response.data.error) {
                setFormError(`Error: ${err.response.data.error}`);
            } else {
                setFormError('Error submitting Project Data. Please check your network or try again.');
            }
        } finally {
            setFormLoading(false); // Stop form submission loading regardless of success or error
        }
    };

    /**
     * Handles the click event for the "Add New Client" button.
     * Navigates the user to the client management page.
     */
    const handleAddClientClick = () => {
        navigate('/clientManagement'); // Programmatically navigate to the /clientManagement route
    };

    // --- Render Method ---
    return (
        <Container className="my-5 p-4 border rounded shadow-sm">
            <h2 className="mb-4 text-center">Add New Project</h2>

            {/* Display general form submission status messages */}
            {formLoading && <Spinner animation="border" role="status" className="d-block mx-auto mb-3" />}
            {formError && <Alert variant="danger" onClose={() => setFormError(null)} dismissible className="text-center">{formError}</Alert>}
            {formSuccess && <Alert variant="success" onClose={() => setFormSuccess(null)} dismissible className="text-center">{formSuccess}</Alert>}

            <Form onSubmit={handleSubmit}>
                {/* Project ID and Name Row */}
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="proj_id">
                        <Form.Label>Project ID</Form.Label>
                        <Form.Control type="text" name="proj_id" value={formData.proj_id} onChange={handleChange} placeholder="Enter Project ID" required />
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="proj_name">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control type="text" name="proj_name" value={formData.proj_name} onChange={handleChange} placeholder="Enter Project Name" required />
                    </Form.Group>
                </Row>

                {/* Start and End Date Row */}
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="start_date">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="end_date">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                    </Form.Group>
                </Row>

                {/* Status and Remarks Row */}
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                            <option value="">Select Status</option>
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="remarks">
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control type="text" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Add any remarks for the project" />
                    </Form.Group>
                </Row>

                {/* Client Name Input with Suggestions & Add New Client Button Row */}
                {/* position-relative is crucial for absolute positioning of the suggestions list */}
                <Row className="mb-4 align-items-end position-relative">
                    <Form.Group as={Col} md="6" controlId="client_name">
                        <Form.Label>Client Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="client_name"
                            value={formData.client_name}
                            onChange={handleChange}
                            placeholder="Type to search clients"
                            autoComplete="off" // Disable browser's native autocomplete
                        />
                        {/* Conditional rendering for the suggestions list */}
                        {showSuggestions && (clientSuggestions.length > 0 || suggestionsLoading || suggestionsError || formData.client_name.length > 2) && (
                            <ListGroup
                                className="suggestions-list mt-1 shadow-sm"
                                // Absolute positioning to make it float over other content
                                style={{
                                    position: 'absolute',
                                    zIndex: 1000, // Ensure it's above other elements
                                    width: 'calc(100% - 15px)', // Adjust width to match input, considering padding/margins
                                    left: '7.5px', // Adjust left position to align with input
                                    top: 'calc(100% + 5px)', // Position below the input with a small gap
                                    maxHeight: '200px', // Limit height and add scrollbar
                                    overflowY: 'auto',
                                    borderRadius: '5px' // Add slight border radius
                                }}
                            >
                                {suggestionsLoading && <ListGroup.Item><Spinner animation="border" size="sm" /> Loading suggestions...</ListGroup.Item>}
                                {suggestionsError && <ListGroup.Item variant="danger">{suggestionsError}</ListGroup.Item>}
                                {/* Show "No clients found" only if not loading, no error, and user typed enough */}
                                {!suggestionsLoading && !suggestionsError && clientSuggestions.length === 0 && formData.client_name.length > 2 &&
                                    <ListGroup.Item>No clients found matching "{formData.client_name}"</ListGroup.Item>
                                }
                                {/* Render each suggestion */}
                                {clientSuggestions.map((client) => (
                                    <ListGroup.Item
                                        key={client.client_id}
                                        action // Makes the item clickable with hover effect
                                        onClick={() => handleSuggestionClick(client)}
                                    >
                                        <strong>{client.first_name}</strong> ({client.company || 'N/A'}) - {client.country || 'N/A'}
                                        {/* Fallback to 'N/A' if company or country is not available */}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Form.Group>

                    {/* "Add New Client" Button Column */}
                    {/* d-flex and align-items-end help align the button with the text input */}
                    <Col md="6" className="d-flex align-items-end">
                        <Button variant="outline-info" onClick={handleAddClientClick} className="w-100">
                            Add New Client
                        </Button>
                    </Col>
                </Row>

                {/* Submit Project Button */}
                {/* w-100 makes the button take full width */}
                {/* disabled prop prevents multiple submissions while loading */}
                <Button variant="primary" type="submit" disabled={formLoading} className="w-100">
                    {formLoading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            {' '}Submitting...
                        </>
                    ) : (
                        'Submit Project'
                    )}
                </Button>
            </Form>
        </Container>
    );
};

export default AddProject;