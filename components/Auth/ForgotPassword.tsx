'use client'
import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  rem,
} from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import classes from './ForgotPassword.module.css'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { useForm } from '@mantine/form'

export function ForgotPassword() {
  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  })

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:1337/api/auth/forgot-password', {
        email: form.values.email,
      })
      alert('Password reset email sent')
    } catch (error) {
      alert('Error sending password reset email')
    }
  }

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} ta='center'>
        Forgot your password?
      </Title>
      <Text c='dimmed' fz='sm' ta='center'>
        Enter your email to get a reset link
      </Text>

      <Text color='red' fz='sm' ta='center'>
        This feature is currently not functional
      </Text>

      <Paper withBorder shadow='md' p={30} radius='md' mt='xl'>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label='Your email'
            placeholder='Email Address'
            required
            {...form.getInputProps('email')}
          />
          <Group justify='space-between' mt='lg' className={classes.controls}>
            <Link href='/Login'>
              <Anchor c='dimmed' size='sm' className={classes.control}>
                <Center inline>
                  <IconArrowLeft
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={1.5}
                  />
                  <Box ml={5}>Back to the login page</Box>
                </Center>
              </Anchor>
            </Link>
            <Button type='submit' className={classes.control} disabled>
              Reset password
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  )
}
