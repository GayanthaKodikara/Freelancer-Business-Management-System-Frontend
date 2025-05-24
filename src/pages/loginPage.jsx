import { Card, Container, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import './loginPage.css'

// kamala@gmail.com	915432109V

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); //sending the data via AJAX without a page reload
        setError('');
        setSuccess('');

        // send 'email' and 'password' to backend and then await for response
        try {

            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(`${backendUrl}/login`, {
                email: email,
                password: password,
            });

            setSuccess(response.data.message);

            localStorage.setItem('token', response.data.token); //Store the token
            console.log(response.data); // Log the response data user data from response.data.user

            // Check for admin role and redirect accordingly
            if (response.data.user && response.data.user.permission == "TRUE") {
                window.location.href = '/employeeManagement'; // (this can be done by 'react-router-dom';)
            } else {
                console.log("Permission Removed")
                alert('Permission denied. Please contact your administrator')
            }


        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('An error occurred. Please try again.');
            }
            console.error('Login error:', err); // Log the error
            console.error(err.response.data.error);
            alert('Login error: ' + err.response.data.error);
        }
    };

    return (
        <Container fluid>
            <Card style={{ width: '25rem' }} border="primary">
                <Form onSubmit={handleSubmit}>
                    <Form.Text className="mb-3" style={{ fontSize: '2rem', fontWeight: '400' }}>LOGIN</Form.Text>
                    <Form.Group className="mb-3" controlId="userEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}

export default Login;