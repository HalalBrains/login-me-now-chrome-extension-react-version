import { MemoryRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/css/global.css";
import AddNewSite from "./component/add-new-site/AddNewSite";
import Home from "./component/home/Home"
function App() {
  return (
    <>
      <MemoryRouter>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/add-new-site" element={<AddNewSite />} />
        </Routes>
      </MemoryRouter>
    </>
  );
}

export default App;
