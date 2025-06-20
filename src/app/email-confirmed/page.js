import Image from "next/image";

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
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  checkmarkIcon: {
    fontSize: '48px',
    color: '#2196f3', // Blue checkmark
  },
  heading: {
    color: '#1976d2', // Darker blue heading
    fontSize: '2.5rem',
    fontWeight: '600',
    marginBottom: '20px',
  },
  message: {
    fontSize: '1.1rem',
    color: '#333',
    lineHeight: '1.6',
    marginBottom: '30px',
  },
};

export default function EmailConfirmedMinimal() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h1 style={styles.heading}>Email Confirmed!</h1>
        <p style={styles.message}>
          Your email address has been successfully confirmed.
        </p>
      </div>
    </div>
  );
}
