'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
"https://lahglbozapnbgwxwxvnz.supabase.co",
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaGdsYm96YXBuYmd3eHd4dm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMDgzMjEsImV4cCI6MjA1Mzc4NDMyMX0.mvoIG2SNEGKsGPSF6h_c9oYIbnonhn7um8EMrWU-YBE"
);

export default function RootLayout({children}) {
 
  return (
    <html>
      <body>
      <div>
      {children}
    </div>
      </body>
    </html>

  );
}

//for sign up
/*
export default function RootLayout({children}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for confirmation link!');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setMessage(error ? error.message : 'Check your email for the reset link!');
  };

  return (
    <html>
      <body>
      <div>



      
      <h1>Sign Up</h1>
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
      </body>
    </html>
    
  );
}
*/
