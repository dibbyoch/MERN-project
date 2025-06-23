import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import axios from "axios";
import.meta.env.VITE_API_BASE_URL;

const defaultCodes = {
  cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello World!";
    return 0;
}`,
  c: `#include <stdio.h>
int main() {
    printf("Hello World!");
    return 0;
}`,
  py: `print("Hello World!")`,
  java: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
        


}`,
};

function App() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(defaultCodes.cpp);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(defaultCodes[selectedLang]);
  };

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
      input,
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/compiler/run`,
        payload,
        { withCredentials: true }
      );
      setOutput(data.output);
    } catch (error) {
      console.error(error.response || error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-5xl font-bold text-center text-blue-500 mb-8 font-poppins">
        Welcome to Code Compiler
      </h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-3/4 md:w-1/2 lg:w-1/3 mb-6">
        <select
          className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
        </select>

        <div
          className="bg-gray-700 p-4 rounded-xl shadow-2xl border border-gray-600 mb-4"
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            minHeight: "200px",
          }}
        >
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => {
              const prismLangMap = {
                cpp: "cpp",
                c: "c",
                java: "java",
                py: "python",
              };
              return highlight(code, languages[prismLangMap[language]]);
            }}
            padding={10}
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              minHeight: "200px",
              backgroundColor: "#2d2d2d",
            }}
          />
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter custom input here"
          className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4 resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-32 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-500 focus:outline-none"
      >
        Run
      </button>

      {output && (
        <pre
          className="mt-4 bg-gray-800 p-4 rounded-lg text-green-400"
          style={{
            backgroundColor: "#333",
            color: "#a8ff60",
            fontFamily: "monospace",
            fontSize: 14,
          }}
        >
          {output}
        </pre>
      )}
    </div>
  );
}

export default App;
