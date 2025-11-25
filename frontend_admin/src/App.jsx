import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";     
import Mainpage from "../pages/Mainpage"; 
import ProtectedRoute from "../components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Mainpage />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;