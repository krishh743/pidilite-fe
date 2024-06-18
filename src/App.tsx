import React from "react";
import "./App.css";
import Login from "./Pages/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Game from "./Pages/Game/Game";
import AdminSetup from "./Pages/Admin/Setup/Setup";
import AdminProtectedRoute from "./Pages/Protected/AdminProtectedRoute";
import TrainerProtectedRoute from "./Pages/Protected/TrainerProtectedRoute";
import TrainerSetup from "./Pages/Trainer/Setup/Setup";
import UserMobileGameLogin from "./Pages/UserMobileGameLogin/UserMobileGameLogin";
import AddUsersByAdmin from "./Pages/Admin/add-users/AddUsersByAdmin";
import GamePlay from "./Pages/Admin/game-play/GamePlay";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin-setup"
            element={
              <AdminProtectedRoute>
                <AdminSetup />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin-add-user"
            element={
              <AdminProtectedRoute>
                <AddUsersByAdmin />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/gameplay"
            element={
              <AdminProtectedRoute>
                <GamePlay />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/trainer-setup"
            element={
              <TrainerProtectedRoute>
                <TrainerSetup />
              </TrainerProtectedRoute>
            }
          />
          <Route path="/game-play/:id" element={<UserMobileGameLogin />} />
          <Route path="/game-spectate/:id" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
