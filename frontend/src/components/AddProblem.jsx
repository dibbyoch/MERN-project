import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Menu, Home, Code, Plus, Settings } from "lucide-react";

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
  type = "button",
}) => {
  const baseStyles =
    "flex items-center gap-2 p-2 rounded-md focus:outline-none transition-colors";
  const sizeStyles = size === "icon" ? "p-2 justify-center" : "p-3";
  const variantStyles =
    variant === "ghost"
      ? "bg-transparent text-white hover:bg-white/10"
      : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Sidebar = ({ isSidebarCollapsed, toggleSidebar, navigate }) => (
  <aside
    className={`${
      isSidebarCollapsed ? "w-16" : "w-64"
    } p-4 border-r border-white/10 backdrop-blur-md bg-white/5 relative transition-all duration-300`}
  >
    <button
      onClick={toggleSidebar}
      className="mb-4 w-full justify-center flex items-center gap-2 p-2 rounded-md text-white"
    >
      <Menu className="w-5 h-5" />
    </button>

    <nav className="space-y-2">
      <button
        onClick={() => navigate("/dashboard")}
        className={`w-full justify-start text-left transition-all duration-300 ${
          isSidebarCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <Home className="w-5 h-5" />
        {!isSidebarCollapsed && "Dashboard"}
      </button>
      <button
        onClick={() => navigate("/compiler")}
        className={`w-full justify-start text-left transition-all duration-300 ${
          isSidebarCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <Code className="w-5 h-5" />
        {!isSidebarCollapsed && "Compiler"}
      </button>
      <button
        onClick={() => navigate("/add-problem")}
        className={`w-full justify-start text-left transition-all duration-300 ${
          isSidebarCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <Plus className="w-5 h-5" />
        {!isSidebarCollapsed && "Add Problem"}
      </button>
      <button
        onClick={() => navigate("/settings")}
        className={`w-full justify-start text-left transition-all duration-300 ${
          isSidebarCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <Settings className="w-5 h-5" />
        {!isSidebarCollapsed && "Settings"}
      </button>
    </nav>
  </aside>
);

export default function AddProblem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    sampleInput: "",
    sampleOutput: "",
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "${process.env.REACT_APP_API_BASE_URL}/api/problems",
        form,
        {
          withCredentials: true,
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add problem:", err.response?.data || err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        navigate={navigate}
      />

      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-white/10 border border-white/20 p-6 rounded-xl space-y-4">
          <h2 className="text-2xl font-semibold">Add New Problem</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              "title",
              "description",
              "inputFormat",
              "outputFormat",
              "constraints",
              "sampleInput",
              "sampleOutput",
            ].map((field) => (
              <div key={field}>
                <label className="block mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <textarea
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  rows={field === "description" ? 4 : 2}
                />
              </div>
            ))}
            <div>
              <label className="block mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black text-white border border-white/20"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <Button type="submit" className="mt-4">
              Submit
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
