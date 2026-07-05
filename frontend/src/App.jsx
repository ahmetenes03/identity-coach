import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HabitCreate from "./pages/HabitCreate";
import HabitEdit from "./pages/HabitEdit";
import CheckIn from "./pages/CheckIn";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/habit/create"
          element={
            <ProtectedRoute>
              <HabitCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/habit/edit/:id"
          element={
            <ProtectedRoute>
              <HabitEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/check-in/:id"
          element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;