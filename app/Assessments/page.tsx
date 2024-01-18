'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/UserContext'
import AssessmentMain from '../../components/Assessments/AssessmentMain'

export default function AssessmentsPage() {
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
      <AssessmentMain />
    </>
  )
}
