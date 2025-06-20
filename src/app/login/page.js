// app/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import '../globals.css';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      
      router.push('/view-dtr');
    }
  };
  
  return (
  <div className="app-container">
      {/* Background Image */}
    <div className="background-image" />
      {/* Soft Overlay */}
      <div className="background-overlay" />

      {/* Foreground Content */}
      <div className="page-wrapper">
          <form onSubmit={handleLogin} className="form-container">
          <h1 className="heading-main">Welcome to Blue Clock</h1>
          <h2 className="heading-sub">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input-field input-password"
            />
          {errorMsg && (<p className="error-message">{errorMsg}</p>)}
          <button type="submit" className="button-submit">  Login</button>
        </form>
      </div>
    </div>
  );
}
