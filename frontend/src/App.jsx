import Register from "./components/Register";
import Login from "./components/Login";
import Compiler from "./components/compiler/compiler";
import Dashboard from "./components/dashboard";
import AddProblem from "./components/addProblem";
import ProblemDetails from "./components/ProblemDetails";
import EditProblem from "./components/EditProblem";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
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
          path="/add-problem"
          element={
            <ProtectedRoute>
              <AddProblem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compiler"
          element={
            <ProtectedRoute>
              <Compiler />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/edit/:id"
          element={
            <ProtectedRoute>
              <EditProblem />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
