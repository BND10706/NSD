'use client'
import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

interface User {
  firstName: string
  lastName: string
  email: string
  id: number
  colorScheme: string
}

interface UserContextProps {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isLoading: boolean
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const jwt = Cookies.get('token') // Log the JWT

    if (jwt) {
      axios
        .get('http://localhost:1337/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          // Log the user data
          setUser(response.data)
          setIsLoading(false)
        })
        .catch((error) => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
