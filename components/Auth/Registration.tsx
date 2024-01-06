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
import classes from './Registration.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'

export function Registration() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)

  async function handleRegistration() {
    setIsRegistering(true)
    if (!email || !password || !firstName || !lastName) {
      setError('Please fill all fields')
      setIsRegistering(false)
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:1337/api/auth/local/register',
        {
          username: email,
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data) {
        console.log('User registered successfully!')
        // Store the token in a cookie
        Cookies.set('token', response.data.jwt)
        router.push('/')
      }
    } catch (error) {
      console.error('An error occurred:')
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta='center' className={classes.title}>
        Register now!
      </Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        Already Have an Account?{' '}
        <Link href='/Login'>
          <Anchor size='sm' component='button'>
            Log in
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <Text c='red' size='sm' ta='center' mt={5}>
          {error ? error : null}
        </Text>
        <TextInput
          label='First Name'
          placeholder='First Name'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <TextInput
          label='Last Name'
          placeholder='First Name'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          mt='md'
        />
        <TextInput
          label='Email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          mt='md'
        />
        <PasswordInput
          label='Password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt='md'
        />
        <Button
          fullWidth
          mt='xl'
          onClick={handleRegistration}
          disabled={isRegistering}
        >
          Register
        </Button>
      </Paper>
    </Container>
  )
}
