import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/problems/${id}`,
          { withCredentials: true }
        );

        setProblem(res.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      }
    };

    fetchProblem();
  }, [id]);

  if (!problem) {
    return <div className="text-white p-6">Loading...</div>;
  }

  const details = [
    { label: "Difficulty", value: problem.difficulty },
    { label: "Input Format", value: problem.inputFormat },
    { label: "Output Format", value: problem.outputFormat },
    { label: "Constraints", value: problem.constraints },
    { label: "Sample Input", value: problem.sampleInput },
    { label: "Sample Output", value: problem.sampleOutput },
    {
      label: "Created At",
      value: new Date(problem.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-black text-white flex flex-col">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-400 flex items-center gap-1 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-300 bg-blue-900/40 px-6 py-4 rounded-2xl shadow-blue-500 shadow-md inline-block">
          {problem.title}
        </h1>
      </div>

      <div className="bg-zinc-800 rounded-xl p-5 mb-6 border border-zinc-700 shadow-inner">
        <h2 className="text-xl font-semibold text-gray-300 mb-2">
          Description
        </h2>
        <p className="text-white whitespace-pre-line">{problem.description}</p>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        {details.map((item, idx) => (
          <div
            key={idx}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-xl shadow-md"
          >
            <h3 className="text-gray-300 font-medium text-sm mb-1">
              {item.label}
            </h3>
            <p className="text-white text-base whitespace-pre-line">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto text-center">
        <button
          onClick={() => navigate(`/code/${id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-blue-500/50 transition-all duration-300 hover:shadow-blue-400/60 animate-pulse"
        >
          Take me to Code Compiler
        </button>
      </div>
    </div>
  );
}
