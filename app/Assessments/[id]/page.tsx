'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { useUser } from '../../../context/UserContext'

interface QuestionAttributes {
  question: string
}

interface Question {
  id: number
  attributes: QuestionAttributes
}

export default function Assessment() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const params = useParams()
  const jwt = Cookies.get('token')
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      const id = user.id
      const assessmentId = params.id // get the assessment ID from the URL
      fetch(
        `http://localhost:1337/api/user-assessments/${assessmentId}?filters[user][id][$eq]=${id}&populate=assessment.questions`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json() // Convert the Response to JSON
        })
        .then((data) => {
          const userAssessment = data.data
          if (!userAssessment) {
            throw new Error('User assessment not found')
          }
          const questions: Question[] =
            data.data.attributes.assessment.data.attributes.questions.data
          setQuestions(questions)
        })
        .catch((error) => console.error('An error occurred:', error))
    }
  }, [jwt, user])

  return (
    <div>
      {questions.map((question, index) => (
        <div key={question.id}>
          <h2>Question {index + 1}</h2>
          <p>{question.attributes.question}</p>
        </div>
      ))}
    </div>
  )
}
