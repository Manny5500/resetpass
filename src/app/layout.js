'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const showNavbar = ['/view-dtr', '/sales', '/transpo', '/logout'].includes(pathname);
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const linkStyle = (path) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: pathname === path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    color: pathname === path ? '#ffffff' : 'white',
    fontWeight: pathname === path ? 'bold' : 'normal',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  });


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setShowLogoutModal(false);
    router.push('/login');
  };

   useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
            return;
      }
      let userQuery = supabase
          .from('user')
          .select('*')
          .eq('auth_id', session.user.id);

          
        const {data : currentUser, error : currentUserError} = await userQuery
        if(!currentUserError){
          setCurrentUser(currentUser[0])
        }else{
          return
        }
        setSession(session);


      if(currentUser && currentUser.user_role !== "10" && currentUser.user_role !== "11"){
        return  
      }

    };
    init();
  }, []);

 
  return (
    <html lang="en">
      <body>
       
        {showNavbar  && (
          <nav style={{
            background: 'linear-gradient(to right, #1976d2, #008080)',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '18px',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
          }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="/view-dtr" style={linkStyle('/view-dtr')}>DTR</a>
              <a href="/sales" style={linkStyle('/sales')}>Sales Record</a>
              <a href="/transpo" style={linkStyle('/transpo')}>Transpo Details</a>
            </div>
            <span onClick={() => setShowLogoutModal(true)} style={linkStyle('/logout')}>Logout</span>
          </nav>
        )}


        {showLogoutModal && (
          <div 
          onClick={() => setShowLogoutModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
          }}>
            <div
             onClick={e => e.stopPropagation()} 
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              textAlign: 'center',
              minWidth: '300px'
            }}>
              <p style={{ marginBottom: '20px' }}>Are you sure you want to log out?</p>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  backgroundColor: '#ccc',
                  color: '#333',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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