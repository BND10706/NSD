import { Title, Text, Anchor } from '@mantine/core'
import classes from './Welcome.module.css'

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta='center' mt={100}>
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
