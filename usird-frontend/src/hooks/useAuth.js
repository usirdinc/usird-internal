import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = async (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);

    try {
      await axios.post('http://localhost:5000/api/workhours/check-in', {}, {
        headers: {
          'x-auth-token': token
        }
      });
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error during check-in: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);

    try {
      await axios.post('http://localhost:5000/api/workhours/check-out', {}, {
        headers: {
          'x-auth-token': token
        }
      });
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Error during check-out: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  return { isAuthenticated, login, logout };
};

export default useAuth;
