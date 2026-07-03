import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HabitCreate from "./pages/HabitCreate";
import HabitEdit from "./pages/HabitEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/habit/create" element={<HabitCreate />} />

        <Route path="/habit/edit/:id" element={<HabitEdit />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;