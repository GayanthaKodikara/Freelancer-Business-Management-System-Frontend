import { Card, Container, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import './loginPage.css'
import { useNavigate } from 'react-router-dom';
import VerifyToken from '../components/verifyToken';


// kamala@gmail.com	915432109V

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(`${backendUrl}/login`, {
                email: email,
                password: password,
            });

            setSuccess(response.data.message);

            localStorage.setItem('token', response.data.token);
            // console.log(response.data);
            await VerifyToken();

            // Check for admin role and redirect accordingly
            if (response.data.user && response.data.user.permission == "TRUE" && response.data.user.role == "Administrator") {
                navigate('/employeeManagement');
            }
            else if (response.data.user && response.data.user.permission == "TRUE" && response.data.user.role == "Project Manager") {
                navigate('/projectManagement');
            }
            else if (response.data.user && response.data.user.permission == "TRUE" && response.data.user.role == "Workshop Supervisour") {
                navigate('/inventoryManagement');
            }
            else if (response.data.user && response.data.user.permission == "TRUE" && response.data.user.role == "Designer") {
                navigate('/projectManagement');
            }
            else if (response.data.user && response.data.user.permission == "TRUE" && response.data.user.role == "Customer Support Engineer") {
                navigate('/projectManagement');
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