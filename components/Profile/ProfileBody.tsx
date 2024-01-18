import React, { useEffect, useState } from 'react'
import { Paper, Title, Text, Container, Grid } from '@mantine/core'
import classes from './ProfileHeader.module.css'
import { useUser } from '../../context/UserContext'
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle'
import axios from 'axios'
import Cookies from 'js-cookie'
import { IconCheck, IconX } from '@tabler/icons-react'

export function ProfileBody() {
  const { user } = useUser()
  const [assessments, setAssessments] = useState([])

  useEffect(() => {
    const fetchAssessments = async () => {
      const jwt = Cookies.get('token')

      if (jwt) {
        try {
          const response = await axios.get(
            `http://localhost:1337/api/user-assessments?&filters[user][id][$eq]=${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          )

          setAssessments(response.data.data)
        } catch (error) {
          console.error('An error occurred:', error)
        }
      }
    }

    if (user) {
      fetchAssessments()
    }
  }, [user])

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

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <Title order={2}>Assessments</Title>
        {assessments &&
          assessments.map((assessment) => {
            return (
              <Grid key={assessment.id} style={{ marginBottom: '10px' }}>
                <Grid.Col
                  span={6}
                  style={{
                    color: assessment.attributes.completed ? 'green' : 'grey',
                  }}
                >
                  <span>{assessment.attributes.title}</span>
                </Grid.Col>
                <Grid.Col
                  span={6}
                  style={{
                    color: assessment.attributes.completed ? 'green' : 'grey',
                    textAlign: 'right',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {assessment.attributes.completed ? (
                    <>
                      <span>Complete</span>
                      <IconCheck />
                    </>
                  ) : (
                    <>
                      <span>Not Complete</span>
                      <IconX />
                    </>
                  )}
                </Grid.Col>
              </Grid>
            )
          })}
      </Paper>
    </Container>
  )
}
