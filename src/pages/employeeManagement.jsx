import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeMng() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL; // or process.env.REACT_APP_BACKEND_URL
                const response = await axios.get(`${backendUrl}/employees`); // Adjust the endpoint as needed

                setEmployees(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) {
        return <div>Loading employees...</div>;
    }

    if (error) {
        return <div>Error fetching employees: {error.message}</div>;
    }

    return (
        <div>
            <h1>Employee List</h1>
            {employees.length > 0 ? (
                <ul>
                    {employees.map((employee) => (
                        <li key={employee.emp_id}>
                            {employee.first_name} - {employee.last_name} - {employee.workshop_name} - {design_category}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No employees found.</p>
            )}
        </div>
    );
}

export default EmployeeMng;