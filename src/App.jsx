import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/loginPage';
import EmployeeMng from './pages/employeeManagement';
import InventoryMng from './pages/inventoryManagement';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddEmployee from './components/addEmployee';
import UpdateEmployee from './components/updateEmployee';
import ProjectManagement from './pages/projectManagement';
import AddProject from './components/addProject';
import ClientMng from './pages/clientManagement';
import AddClient from './components/addClient';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route >
                    <Route path="/employeeManagement" element={<EmployeeMng />} />
                    <Route path="/inventoryManagement" element={<InventoryMng />} />
                    <Route path="/clientManagement" element={<ClientMng />} />
                    <Route path="/clientManagement/addClient" element={<AddClient />} />
                    <Route path="/employeeManagement/addEmployee" element={<AddEmployee />} />
                    <Route path="/employeeManagement/updateEmployee/:empId" element={<UpdateEmployee />} />
                    <Route path="/projectManagement" element={<ProjectManagement />} />
                    <Route path="/projectManagement/addProject" element={<AddProject />} />
                </Route>
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;