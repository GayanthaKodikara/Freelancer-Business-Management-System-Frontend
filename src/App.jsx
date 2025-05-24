import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/loginPage';
import EmployeeMng from './pages/employeeManagement';
import InventoryMng from './pages/inventoryManagement';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddEmployee from './components/addEmployee';
import UpdateEmployee from './components/updateEmployee';
import ProjectManagement from './pages/projectManagement';
import AddProject from './components/addProject';
import { AuthProvider } from './components/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/employeeManagement" element={<EmployeeMng />} />
                        <Route path="/inventoryManagement" element={<InventoryMng />} />
                        <Route path="/employeeManagement/addEmployee" element={<AddEmployee />} />
                        <Route path="/employeeManagement/updateEmployee/:empId" element={<UpdateEmployee />} />
                        <Route path="/projectManagement" element={<ProjectManagement />} />
                        <Route path="/projectManagement/addProject" element={<AddProject />} />
                    </Route>
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;