import React from "react";
import "./App.css";
import ListEmployee from "./components/ListEmployee";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateOrEditEmployee from "./components/CreateOrEditEmployee";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateOrEditEmployee />} />
        <Route path="/create/:id" element={<CreateOrEditEmployee />} />
        <Route path="/list" element={<ListEmployee />} />
      </Routes>
    </div>
  );
}

export default App;
