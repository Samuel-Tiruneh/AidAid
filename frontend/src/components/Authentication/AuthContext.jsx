// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [redirectPath, setRedirectPath] = useState("/");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const storedUserRaw = localStorage.getItem("user");
//       if (!storedUserRaw) {
//         setLoading(false);
//         return;
//       }

//       let storedUser;
//       try {
//         storedUser = JSON.parse(storedUserRaw);
//       } catch (error) {
//         console.warn("Failed to parse user from localStorage. Clearing corrupted data.");
//         localStorage.removeItem("user");
//         setLoading(false);
//         return;
//       }

//       const userId = storedUser?._id || storedUser?.id;
//       if (!userId) {
//         console.warn("Stored user exists but has no _id or id:", storedUser);
//         localStorage.removeItem("user");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:5000/api/users/${userId}`);
//         const latestUserData = await response.json();

//         if (!latestUserData._id) {
//           throw new Error("Invalid user data received from server");
//         }

//         const normalizedUser = {
//           ...latestUserData,
//           id: latestUserData._id,
//         };

//         setUser(normalizedUser);
//         localStorage.setItem("user", JSON.stringify(normalizedUser));
//       } catch (err) {
//         console.error("Failed to refresh user data:", err);
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const userWithCorrectRole = {
//           ...data.user,
//           id: data.user._id,
//           role: data.user.role,
//         };
//         localStorage.setItem("user", JSON.stringify(userWithCorrectRole));
//         setUser(userWithCorrectRole);
//         navigate(redirectPath);
//         setRedirectPath("/");
//       } else {
//         alert(data.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Login failed, please try again.");
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     setRedirectPath("/");
//     navigate("/");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         login,
//         logout,
//         setRedirectPath,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState("/");
  const navigate = useNavigate();

  // Set up axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Set the token immediately
        setToken(storedToken);
        
        // If we have user data in localStorage, use it
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Fetch user data if not in localStorage
          const response = await axios.get(`http://localhost:5000/api/user/${JSON.parse(atob(storedToken.split('.')[1])).userId}`);
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const { user: userData, token: authToken } = response.data;

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setToken(authToken);
      setUser(userData);
      navigate(redirectPath);
      setRedirectPath("/");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data?.message || "Login failed, please try again.";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        setRedirectPath,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
