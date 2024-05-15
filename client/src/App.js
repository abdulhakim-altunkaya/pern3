import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Read from "./components/Read";
import Write from "./components/Write";
import Update from "./components/Update";
import Delete from "./components/Delete";
import Hello from "./components/Hello";
import CreateTable from "./components/CreateTable";


function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <span className="navbarButtons"><Link to="/hello">Hello Backend</Link></span>
          <span className="navbarButtons"><Link to="/create">Create Table</Link></span>
          <span className="navbarButtons"><Link to="/read">Read</Link></span>
          <span className="navbarButtons"><Link to="/write">Write</Link></span>
          <span className="navbarButtons"><Link to="/update">Update</Link></span>
          <span className="navbarButtons"><Link to="/delete">Delete</Link></span>
        </div>
        <br/> <br/> <br/>
        <Routes>
          <Route path="/hello" element={<Hello />} />
          <Route path="/create" element={<CreateTable />} />
          <Route path="/read" element={<Read />} />
          <Route path="/write" element={<Write />} />
          <Route path="/update" element={<Update />} />
          <Route path="/delete" element={<Delete />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;