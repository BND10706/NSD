// AssessmentMain.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useUser } from '../../context/UserContext'
import { Text, Center } from '@mantine/core'
import AssessmentCard from './AssessmentCard'
import classes from './AssessmentMain.module.css'

interface Assessment {
  id: number
  attributes: {
    title: string
    completed: boolean
  }
}

export default function AssessmentMain() {
  const { user } = useUser()
  const [assessments, setAssessments] = useState<Assessment[]>([])

  useEffect(() => {
    const fetchAssessments = async () => {
      const jwt = Cookies.get('token')

      if (jwt && user) {
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

  if (!user) {
    return null
  }

  return (
    <Center style={{ flexDirection: 'column', alignItems: 'center' }}>
      <Text size='xl' className={classes.fontWeight700}>
        Welcome to the Assessments Page
      </Text>
      <Text size='md'>
        This is the place where you can take an assessment. Below are the
        available assessments:
      </Text>
      {assessments.map((assessment) => (
        <AssessmentCard key={assessment.id} assessment={assessment} />
      ))}
    </Center>
  )
}
