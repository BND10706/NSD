'use client'
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core'
import React, { useState } from 'react'
import classes from './AuthenticationTitle.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useUser } from '../../context/UserContext' // Update the path to match your file structure

export function AuthenticationTitle() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { setUser } = useUser()

  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill all fields')
      return
    }

    setIsLoggingIn(true)
    try {
      const response = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      Cookies.set('token', data.jwt) // Set the JWT in a cookie
      setUser(data.user)

      router.push('/') // Redirect to home page after successful sign-in
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta='center' className={classes.title}>
        Welcome back!
      </Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        Do not have an account yet?{' '}
        <Link href='/Register'>
          <Anchor size='sm' component='button'>
            Create account
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <Text c='red' size='sm' ta='center' mt={5}>
          {error ? error : null}
        </Text>
        <TextInput
          label='Email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          label='Password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt='md'
        />
        <Group justify='space-between' mt='lg'>
          <Link href='/ForgotPassword'>
            <Anchor component='button' size='sm'>
              Forgot password?
            </Anchor>
          </Link>
        </Group>
        <Button fullWidth mt='xl' onClick={handleLogin} disabled={isLoggingIn}>
          Sign in
        </Button>
      </Paper>
    </Container>
  )
}
