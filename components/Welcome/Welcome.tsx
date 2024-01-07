import { useUser } from '../../context/UserContext'
import { Title, Text, Anchor } from '@mantine/core'
import classes from './Welcome.module.css'

export function Welcome() {
  const { user } = useUser()

  if (user) {
    return (
      <>
        <Title className={classes.title} ta='center'>
          Welcome back,{' '}
          <Text
            inherit
            variant='gradient'
            component='span'
            gradient={{ from: 'blue', to: 'grey' }}
          >
            {user.firstName.charAt(0).toUpperCase() +
              user.firstName.slice(1).toLowerCase()}
            !
          </Text>
        </Title>
        <Text c='dimmed' ta='center' size='lg' maw={580} mx='auto' mt='xl'>
          This will eventually be a place where you can review you NSD
          assessments etc.
          <br />
          <br />
          For now this is just a testing page to handle the logged in user
          state.
        </Text>
      </>
    )
  } else {
    return (
      <>
        <Title className={classes.title} ta='center'>
          Welcome to{' '}
          <Text
            inherit
            variant='gradient'
            component='span'
            gradient={{ from: 'blue', to: 'grey' }}
          >
            NSD
          </Text>
        </Title>
        <Text c='dimmed' ta='center' size='lg' maw={580} mx='auto' mt='xl'>
          To get started on your NSD Assessments, please {''}
          <Anchor href='/Login' size='lg'>
            Login
          </Anchor>
          . To get started. If you do not have an account, please {''}
          <Anchor href='/Register' size='lg'>
            Register
          </Anchor>
          {''} to begin.
        </Text>
      </>
    )
  }
}
