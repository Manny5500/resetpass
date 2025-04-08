'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function NewPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  
  const supabase = createClient(
    "https://lahglbozapnbgwxwxvnz.supabase.co",
       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaGdsYm96YXBuYmd3eHd4dm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMDgzMjEsImV4cCI6MjA1Mzc4NDMyMX0.mvoIG2SNEGKsGPSF6h_c9oYIbnonhn7um8EMrWU-YBE"
      )
  useEffect(() => {
   
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data?.session) {
        setIsAuthenticated(true)
      } else if (error) {
        setMessage('Session expired or invalid. Please request a new reset link.')
      } else {
        setMessage('No active session found. Please request a new reset link.')
      }
    }
    checkAuth()
  }, [])

  const handleNewPassword = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setMessage('You must be authenticated to update your password.')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage('Password updated successfully! You can now log in.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div>
      <h1>New Password</h1>
      {isAuthenticated ? (
        <form onSubmit={handleNewPassword}>
          <input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>{message}</p>
      )}
      {message && isAuthenticated && <p>{message}</p>}
    </div>
  )
}
