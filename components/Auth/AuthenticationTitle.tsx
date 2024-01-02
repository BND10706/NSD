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
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/app/firebase'
import { useRouter } from 'next/navigation'

export function AuthenticationTitle() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill all fields')
      return
    }

    setIsLoggingIn(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
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
