'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../../context/UserContext'
import QuestionMain from '@/components/Assessments/QuestionMain'

export default function Assessment() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return null
  }
  return (
    <>
      <QuestionMain />
    </>
  )
}
