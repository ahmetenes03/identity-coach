import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HabitCreate from "./pages/HabitCreate";
import HabitEdit from "./pages/HabitEdit";
import CheckIn from "./pages/CheckIn";
import Recommendation from "./pages/Recommendation";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

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

        <Route
          path="/recommendation/:id"
          element={
            <ProtectedRoute>
              <Recommendation />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;