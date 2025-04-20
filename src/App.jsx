import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/loginPage';
import EmployeeMng from './pages/employeeManagement';
import InventoryMng from './pages/inventoryManagement';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddEmployee from './components/addEmployee';
import UpdateEmployee from './components/updateEmployee';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/employeeManagement" element={<EmployeeMng />} />
                <Route path="/inventoryManagement" element={<InventoryMng />} />
                <Route path="/employeeManagement/addEmployee" element={<AddEmployee />} />
                <Route path="/employeeManagement/updateEmployee/:empId" element={<UpdateEmployee />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
