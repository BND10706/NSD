'use client'

import { Button, Group, useMantineColorScheme } from '@mantine/core'
import { useUser } from '../../context/UserContext' // Import useUser hook
import axios from 'axios'
import Cookies from 'js-cookie' // Import axios to make API calls

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const { user, setUser } = useUser()
  const jwt = Cookies.get('token') // Get user and setUser from UserContext

  const handleColorSchemeChange = async (colorScheme: 'light' | 'dark') => {
    setColorScheme(colorScheme)

    // If user is null, return early
    if (!user) {
      return
    }

    // Update colorScheme in user's profile in Strapi
    const response = await axios.put(
      `http://localhost:1337/api/users/${user.id}`,
      {
        colorScheme: colorScheme,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`, // Use the JWT token from cookie
        },
      }
    )

    // Update user in UserContext
    setUser(response.data)
  }

  return user ? (
    <Group justify='center' mt={10}>
      <Button
        color={user.colorScheme === 'light' ? 'blue' : undefined}
        variant={user.colorScheme === 'light' ? 'filled' : 'outline'}
        onClick={() => handleColorSchemeChange('light')}
      >
        Light
      </Button>
      <Button
        color={user.colorScheme === 'dark' ? 'blue' : undefined}
        variant={user.colorScheme === 'dark' ? 'filled' : 'outline'}
        onClick={() => handleColorSchemeChange('dark')}
      >
        Dark
      </Button>
    </Group>
  ) : null
}
