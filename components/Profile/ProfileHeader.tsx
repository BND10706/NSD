import { Title, Text, Anchor } from '@mantine/core'
import classes from './ProfileHeader.module.css'

export function ProfileHeader() {
  return (
    <>
      <Title className={classes.title} ta='center'>
        User Profile
      </Title>
    </>
  )
}
