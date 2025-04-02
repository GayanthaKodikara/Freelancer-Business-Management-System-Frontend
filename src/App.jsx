import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './pages/loginPage';
import EmployeeMng from './pages/employeeManagement';
import InventoryMng from './pages/inventoryManagement';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/employeeManagement" element={<EmployeeMng />} />
                <Route path="/inventoryManagement" element={<InventoryMng />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
