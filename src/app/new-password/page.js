'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#e3f2fd', // Light blue background
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '400px',
    maxWidth: '90%',
  },
  heading: {
    color: '#1976d2', // Darker blue heading
    fontSize: '2.5rem',
    fontWeight: '600',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  },
  input: {
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #bbdefb', // Light blue border
    fontSize: '1rem',
    color: '#333',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#2196f3', // Blue button
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#1976d2',
  },
  message: {
    marginTop: '20px',
    color: '#424242',
    fontSize: '1rem',
  },
  errorMessage: {
    marginTop: '20px',
    color: '#d32f2f',
    fontSize: '1rem',
  },
  infoMessage: {
    marginTop: '20px',
    color: '#757575',
    fontSize: '1rem',
  },
};



export default function NewPasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setIsAuthenticated(true);
      } else if (error) {
        setMessage('Session expired or invalid. Please request a new reset link.');
      } else {
        setMessage('No active session found. Please request a new reset link.');
      }
    };
    checkAuth();
  }, []);

  const handleNewPassword = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage('You must be authenticated to update your password.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Password updated successfully! You can now log in.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {isAuthenticated ? (
          <>
            <h1 style={styles.heading}>New Password</h1>
            {message && <p style={styles.message}>{message}</p>}
            <form onSubmit={handleNewPassword} style={styles.form}>
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <button
                type="submit"
                style={styles.button}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
              >
                Submit
              </button>
            </form>
          </>
        ) : (
          <p style={styles.infoMessage}>{message}</p>
        )}
      </div>
    </div>
  );
}
