'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function NewPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
