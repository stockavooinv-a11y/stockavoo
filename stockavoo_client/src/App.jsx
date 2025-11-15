import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/auth/Register';
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<Register />} />
      {/* Add more routes as we build them */}
    </Routes>
  );
}

export default App;
