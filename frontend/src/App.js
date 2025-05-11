import React from "react";
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Main from "./pages/Main";
import SongInfo from "./pages/SongInfo";

function App() {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/song/:title" element={<SongInfo />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
