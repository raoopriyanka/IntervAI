// This is the URL where your FastAPI server is running
const BASE_URL = 'http://127.0.0.1:8000';

// 🟢 UTILITY: Check if the backend is online
export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return null;
  }
};

// 🔐 AUTH: Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    return { status: "error", detail: "Network error" };
  }
};

// 🔐 AUTH: Log in and save the token
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    // If successful, save the token and user data to the browser's LocalStorage
    if (data.status === "success" && data.access_token) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userRole", data.role);
    }
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { status: "error", detail: "Network error" };
  }
};

// 🟢 AUTH: Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
};

// 🟢 INTERVIEW: Start the interview session with custom settings
export const startInterviewSession = async (configData) => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${BASE_URL}/start-interview`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 🟢 NEW: Tell backend we are sending JSON
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(configData) // 🟢 NEW: Send the role, tech stack, and difficulty!
    });
    
    return await response.json();
  } catch (error) {
    console.error("Failed to start interview:", error);
    return null;
  }
};

// 🧠 AI INTERVIEW: Submit the typed answer to the Gemini Backend
export const submitInterviewAnswer = async (answerData) => {
  try {
    // Grab the secure token from the browser
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("You must be logged in to submit an interview!");
      return null;
    }

    const response = await fetch(`${BASE_URL}/submit-answer`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 🟢 NEW: Attach the JWT token to the request!
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(answerData),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to submit answer to AI:", error);
    return null;
  }
};

// 📊 AI INTERVIEW: Get the feedback for the most recent interview
export const getLatestFeedback = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${BASE_URL}/get-feedback`, {
      method: 'GET',
      headers: { 
        "Authorization": `Bearer ${token}` 
      }
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch feedback:", error);
    return null;
  }
};