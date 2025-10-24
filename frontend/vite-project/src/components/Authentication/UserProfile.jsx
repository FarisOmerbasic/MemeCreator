import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import './AuthStyles.css'

export default function UserProfile() {
    const {user, isAuthenticated, isLoading} = useAuth0();
    if (isLoading || !isAuthenticated) return null;
  return (
    <div className="profile">
      <span>{user.email}</span>
    </div>
  )
}
