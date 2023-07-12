import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// import AddNewSite from "./component/add-new-site/AddNewSite";
import "./assets/css/global.css";
import Home from "./component/home/Home";
import AddNewSite from "./component/add-new-site/AddNewSite";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/add-new-site" element={<AddNewSite />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
