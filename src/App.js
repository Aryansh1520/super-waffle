import "./App.css";
import Home1 from "./pages/Home.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/HOME" element={<Home1 />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
