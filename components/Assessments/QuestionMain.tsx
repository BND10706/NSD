'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { useUser } from '../../context/UserContext'
import QuestionCard from './QuestionCard'
import classes from './QuestionMain.module.css'
import { Text, Center, Button, Grid, Container } from '@mantine/core'

interface QuestionAttributes {
  question: string
  AssessmentNumber: string
}

interface Question {
  id: number
  attributes: QuestionAttributes
}

export default function QuestionMain() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: boolean | null }>({})
  const params = useParams()
  const jwt = Cookies.get('token')
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const id = user.id
          const assessmentId = params.id

          const response = await fetch(
            `http://localhost:1337/api/user-assessments/${assessmentId}?filters[user][id][$eq]=${id}&populate=assessment.questions`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          )

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          const userAssessment = data.data

          if (!userAssessment) {
            throw new Error('User assessment not found')
          }

          const assessmentQuestions: Question[] =
            data.data.attributes.assessment.data.attributes.questions.data

          setQuestions(assessmentQuestions)

          // Initialize answers if null
          if (userAssessment.attributes.answers === null) {
            setAnswers((prevAnswers) => {
              const initialAnswers: { [key: number]: null } = {} // Provide type definition

              assessmentQuestions.forEach((question) => {
                initialAnswers[question.id] = null
              })

              return { ...prevAnswers, ...initialAnswers }
            })
          } else {
            // Set answers for already answered questions
            setAnswers((prevAnswers) => {
              const answeredQuestions = userAssessment.attributes.answers
              const updatedAnswers = { ...prevAnswers }

              Object.keys(answeredQuestions).forEach((questionId) => {
                const id = parseInt(questionId)
                updatedAnswers[id] = answeredQuestions[questionId]
              })

              return updatedAnswers
            })
          }
        }
      } catch (error) {
        console.error('An error occurred:', error)
      }
    }

    fetchData()
  }, [jwt, user, params.id])

  const handleAnswerSubmit = () => {
    // Check if there are unanswered questions
    if (Object.values(answers).some((answer) => answer === null)) {
      console.log('Please answer all questions before submitting.')
      return
    }

    const assessmentId = params.id

    // Make API call to update answers
    fetch(`http://localhost:1337/api/user-assessments/${assessmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          answers: { ...answers },
          completed: true, // Mark the assessment as completed
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        console.log('Answers submitted successfully:', data)

        // Redirect to the completion page or navigate to a new route
        // Example using Next.js router
        router.push('/Assessments')
      })
      .catch((error) => console.error('An error occurred:', error))
  }

  const handleOptionSelect = (questionId: number, option: boolean) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }))
  }

  const handleNextQuestion = () => {
    const assessmentId = params.id
    const questionId = questions[currentQuestionIndex].id
    const userAnswer = answers[questionId]

    // Update answers using the useState callback
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: userAnswer,
    }))

    // Make API call to update answers
    fetch(`http://localhost:1337/api/user-assessments/${assessmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          answers: {
            ...answers,
            [questionId]: userAnswer,
          },
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        console.log('Answers updated successfully:', data)
      })
      .catch((error) => console.error('An error occurred:', error))

    // Move to the next question
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
  }

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  return (
    <Container size={600} my={40}>
      {currentQuestionIndex < questions.length ? (
        <div key={questions[currentQuestionIndex].id}>
          <Center>
            <QuestionCard
              question={questions[currentQuestionIndex].attributes.question}
              onOptionSelect={(option) =>
                handleOptionSelect(questions[currentQuestionIndex].id, option)
              }
              savedAnswer={answers[questions[currentQuestionIndex].id]}
            />
          </Center>
          <Grid>
            <Grid.Col span={6}>
              <Center>
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous Question
                </Button>
              </Center>
            </Grid.Col>
            <Grid.Col span={6}>
              <Center>
                <Button
                  onClick={handleNextQuestion}
                  disabled={
                    currentQuestionIndex === questions.length - 1 &&
                    answers[questions[currentQuestionIndex].id] === null
                  }
                >
                  Next Question
                </Button>
              </Center>
            </Grid.Col>
          </Grid>
        </div>
      ) : (
        <div>
          <h2>
            Finish Assessment {questions[0]?.attributes?.AssessmentNumber}
          </h2>
          <p>All questions answered!</p>
          <Button onClick={handleAnswerSubmit}>Submit Answers</Button>
        </div>
      )}
    </Container>
  )
}
