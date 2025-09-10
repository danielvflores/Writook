import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Show notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          displayName: username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification("Registration successful! Redirecting to login...", "success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorMessage = data.error || data.message || "Unknown error occurred";
        showNotification(`Registration failed: ${errorMessage}`, "error");
      }
    } catch (error) {
      showNotification("Connection error. Please check if the server is running.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Notification styles
  const notificationStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex items-center justify-center p-4">
      {/* Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notificationStyles[notification.type]}`}>
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'warning' && '⚠️'}
              {notification.type === 'info' && 'ℹ️'}
            </span>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-indigo-200">Join the Writook community</p>
        </div>

        <RegisterForm onSubmit={handleRegister} />

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-white">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating account...
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-indigo-200">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-300 hover:text-white font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-indigo-300 hover:text-white text-sm transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
