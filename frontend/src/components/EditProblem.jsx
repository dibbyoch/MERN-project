import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { username, password } = location.state || {};

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/problems/${id}`,
          { withCredentials: true }
        );
        setProblem(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleInputChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/problems/${id}`,
        {
          ...problem,
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      navigate(`/problems/${id}`, { state: { message: "Problem updated!" } });
    } catch (err) {
      console.error("Error updating problem:", err);
      alert("Failed to update problem. Check admin credentials or try again.");
    }
  };

  if (loading || !problem) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-black text-white flex flex-col">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-400 flex items-center gap-1 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="text-center mb-6">
        <input
          type="text"
          name="title"
          value={problem.title}
          onChange={handleInputChange}
          className="text-4xl font-bold text-blue-300 bg-blue-900/40 px-6 py-4 rounded-2xl shadow-md text-center w-full max-w-3xl mx-auto mb-2"
        />
      </div>

      <div className="bg-zinc-800 rounded-xl p-5 mb-6 border border-zinc-700 shadow-inner">
        <h2 className="text-xl font-semibold text-gray-300 mb-2">
          Description
        </h2>
        <textarea
          name="description"
          value={problem.description}
          onChange={handleInputChange}
          rows={6}
          className="w-full p-3 rounded-lg bg-white/10 border border-gray-600 text-white resize-y"
        />
      </div>

      <div className="flex flex-col gap-4 mb-10">
        {[
          "difficulty",
          "inputFormat",
          "outputFormat",
          "constraints",
          "sampleInput",
          "sampleOutput",
        ].map((field) => (
          <div
            key={field}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-xl shadow-md"
          >
            <h3 className="text-gray-300 font-medium text-sm mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </h3>
            <textarea
              name={field}
              value={problem[field]}
              onChange={handleInputChange}
              rows={field === "difficulty" ? 1 : 3}
              className="w-full p-2 rounded-md bg-black/10 border border-gray-600 text-white resize-y"
            />
          </div>
        ))}
      </div>

      <div className="mt-auto text-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-green-500/50 transition-all duration-300 hover:shadow-green-400/60 animate-pulse"
        >
          Save Changes
        </button>
        ;
      </div>
    </div>
  );
}
