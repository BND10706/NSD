'use client'
import { Paper, Title, Text, Container } from '@mantine/core'
import classes from './ProfileHeader.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Correct import from 'next/router' not 'next/navigation'
import { useUser } from '../../context/UserContext' // Import useUser hook
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle'

export function ProfileBody() {
  const router = useRouter()
  const { user } = useUser() // Get user from UserContext

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      router.push('/') // Redirect to home page if not logged in
    }
  }, [])

  return (
    <Container size={420} my={40}>
      <Title ta='center' className={classes.title}>
        Profile Page
      </Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        Manage your Profile Settings
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        {user && (
          <>
            <Title
              order={2}
            >{`${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`}</Title>
            <Text size='sm'>{user.email}</Text>
            <Text c='dimmed' size='sm' ta='center' mt={20}>
              Select Color Theme
            </Text>
            <ColorSchemeToggle />
          </>
        )}
      </Paper>
    </Container>
  )
}
