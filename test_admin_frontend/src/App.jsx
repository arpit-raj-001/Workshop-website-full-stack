import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import AdminLayout from "./components/AdminLayout";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import UploadForm from "./components/UploadForm";

import ManagePosts from "./components/ManagePosts";
import AuditHistory from "./components/AuditHistory";

const Students = () => (
  <div style={{ color: "#fff", padding: "2rem" }}>
    <h2>Students</h2>
  </div>
);
const Doubts = () => (
  <div style={{ color: "#fff", padding: "2rem" }}>
    <h2>Solve Doubts</h2>
  </div>
);
const Profile = () => (
  <div style={{ color: "#fff", padding: "2rem" }}>
    <h2>Admin Profile </h2>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AnalyticsDashboard />} />
          <Route path="create-post" element={<UploadForm />} />
          <Route path="manage-posts" element={<ManagePosts />} />
          <Route path="audit-history" element={<AuditHistory />} />
          <Route path="students" element={<Students />} />
          <Route path="doubts" element={<Doubts />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
