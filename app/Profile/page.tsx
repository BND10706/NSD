'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/UserContext'
import { ProfileBody } from '../../components/Profile/ProfileBody'

export default function ProfilePage() {
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
      <ProfileBody />
    </>
  )
}
