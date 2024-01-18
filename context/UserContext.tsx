'use client'
import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

interface Assessment {
  id: number
  title: string
  assessment_completed: boolean
}

interface User {
  firstName: string
  lastName: string
  email: string
  id: number
  colorScheme: string
  assessments: Assessment[]
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
    const fetchUser = async () => {
      const jwt = Cookies.get('token')

      if (jwt) {
        try {
          const response = await axios.get(
            'http://localhost:1337/api/users/me?include=assessments',
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          )

          setUser(response.data)
        } catch (error) {
          console.error('An error occurred:', error)
        }
      }

      setIsLoading(false)
    }

    fetchUser()
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
