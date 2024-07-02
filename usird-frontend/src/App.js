import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import LandingPage from './components/pages/LandingPage';
import Articles from './components/pages/Articles';
import ArticleDetails from './components/pages/ArticleDetails';
import CreateArticle from './components/pages/CreateArticle';
import CheckStatus from './components/client/CheckStatus';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ManagerDashboard from './components/manager/Dashboard';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import CreateEmployee from './components/manager/CreateEmployee';
import EmployeeList from './components/manager/EmployeeList';
import EmployeeDetails from './components/manager/EmployeeDetails';
import AssignTask from './components/manager/AssignTask';
import ViewTasks from './components/manager/ViewTasks';
import CreateContact from './components/common/CreateContact';
import ViewContacts from './components/common/ViewContacts';
import ViewCases from './components/common/ViewCases';
import CreateCase from './components/common/CreateCase';
import ViewCaseDetails from './components/common/ViewCaseDetails';
import Logout from './components/auth/Logout';
import useAuth from './hooks/useAuth';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetails />} />
          <Route path="/create-article" element={<CreateArticle />} />
          <Route path="/check-status" element={<CheckStatus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/manager/create-employee" element={<CreateEmployee />} />
          <Route path="/manager/employees" element={<EmployeeList />} />
          <Route path="/manager/employees/:id" element={<EmployeeDetails />} />
          <Route path="/manager/assign-task" element={<AssignTask />} />
          <Route path="/manager/view-tasks" element={<ViewTasks />} />
          <Route path="/create-contact" element={<CreateContact />} />
          <Route path="/view-contacts" element={<ViewContacts />} />
          <Route path="/view-cases" element={<ViewCases />} />
          <Route path="/create-case" element={<CreateCase />} />
          <Route path="/view-case/:id" element={<ViewCaseDetails />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
