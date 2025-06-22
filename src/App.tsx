import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import ChatInterface from "./components/Chat/ChatInterface";
import FileUpload from "./components/Admin/FileUpload";
import Dashboard from "./components/Admin/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex-1 max-w-4xl mx-auto w-full bg-white shadow-sm">
                  <ChatInterface />
                </div>
              }
            />
            <Route
              path="/upload"
              element={
                <div className="flex-1">
                  <FileUpload />
                </div>
              }
            />
            <Route
              path="/admin"
              element={
                <div className="flex-1">
                  <Dashboard />
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
