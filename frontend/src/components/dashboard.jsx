import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  Pencil,
  Trash,
  Plus,
  LogOut,
  Menu,
  Terminal,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Card = ({ children, className }) => (
  <div className={`bg-white p-6 shadow-lg rounded-lg ${className}`}>
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  className,
  size = "md",
  variant = "primary",
}) => {
  const baseStyles =
    "flex items-center gap-2 rounded-md focus:outline-none transition-all duration-300";
  const sizeStyles = size === "icon" ? "p-2 justify-center" : "p-3 px-4";
  const variantStyles =
    variant === "ghost"
      ? "bg-transparent text-white hover:bg-white/10"
      : "bg-blue-500 text-white hover:bg-blue-600";
  const hoverStyles = "hover:shadow-lg hover:scale-105";

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className} ${hoverStyles}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Function to get difficulty color
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-500 text-white";
    case "Medium":
      return "bg-yellow-500 text-white";
    case "Hard":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start with sidebar collapsed
  const [problems, setProblems] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [username, setUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/problems", {
          withCredentials: true,
        });
        setProblems(response.data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };

    fetchProblems();
  }, []);

  const handleDeleteClick = (problem) => {
    setSelectedProblem(problem);
    setShowDeletePopup(true);
  };

  const handleDeleteSubmit = async () => {
    if (!username || !adminPassword) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/problems/${selectedProblem._id}`,
        {
          data: { username, password: adminPassword },
          withCredentials: true,
        }
      );
      setProblems(problems.filter((p) => p._id !== selectedProblem._id));
      setShowDeletePopup(false);
      setUsername("");
      setAdminPassword("");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Check credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleMainClick = () =>
    !isSidebarCollapsed && setIsSidebarCollapsed(true);

  return (
    <div className="flex min-h-screen bg-black text-white relative">
      <aside
        className={`${
          isSidebarCollapsed ? "w-16" : "w-64"
        } p-4 border-r border-white/10 backdrop-blur-md bg-white/5 relative transition-all duration-300`}
      >
        <Button
          onClick={toggleSidebar}
          className="mb-4 w-full justify-center"
          variant="ghost"
          size="icon"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {!isSidebarCollapsed && (
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:shadow-lg hover:bg-white/10 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:shadow-lg hover:bg-white/10 transition-all duration-200"
              onClick={() => navigate("/compiler")}
            >
              <Terminal className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Code Compiler</span>}
            </Button>
            <Button
              onClick={() => navigate("/add-problem")}
              className="flex items-center gap-2 w-full justify-start hover:shadow-lg hover:bg-white/10 transition-all duration-200"
              variant="ghost"
            >
              <Plus className="w-5 h-5" /> Add Problem
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2 hover:shadow-lg hover:bg-white/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" /> Logout
            </Button>
          </nav>
        )}
      </aside>

      <main className="flex-1 p-6 space-y-6" onClick={handleMainClick}>
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl">
          <h2 className="text-2xl font-semibold mb-6">Problem List</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-300 border-b border-white/10">
                <th className="pb-3">Title</th>
                <th className="pb-3">Difficulty</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Created At</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr
                  key={problem._id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="py-3">{problem.title}</td>
                  <td className="py-3">
                    <span
                      className={`py-1 px-3 rounded-full ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-3">{problem.description}</td>
                  <td className="py-3">
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => navigate(`/problems/${problem._id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingProblem(problem);
                        setShowEditPopup(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteClick(problem)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-blue-900/80 text-white p-6 rounded-xl shadow-2xl w-[400px] border border-blue-300/20 backdrop-blur-lg transition-all duration-300">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4 text-sm text-blue-100">
              Enter your username and admin password to delete:
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded-md border border-blue-300 bg-white/10 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-2 rounded-md border border-blue-300 bg-white/10 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <div className="flex justify-between mt-4">
                <Button onClick={handleDeleteSubmit}>Submit</Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-blue-900/80 text-white p-6 rounded-xl shadow-2xl w-[400px] border border-blue-300/20 backdrop-blur-lg transition-all duration-300">
            <h3 className="text-xl font-bold mb-4">Edit Problem</h3>
            <p className="mb-4 text-sm text-blue-100">
              Enter your username and admin password to edit:
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded-md border border-blue-300 bg-white/10 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-2 rounded-md border border-blue-300 bg-white/10 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <div className="flex justify-between mt-4">
                <Button
                  onClick={() => {
                    if (!username || !adminPassword) return;
                    navigate(`/problems/edit/${editingProblem._id}`, {
                      state: { username, password: adminPassword },
                    });
                  }}
                >
                  Proceed
                </Button>
                <Button variant="ghost" onClick={() => setShowEditPopup(false)}>
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
