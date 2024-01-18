// AssessmentCard.tsx
import { Button, Paper, Text, Grid } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import classes from './AssessmentCard.module.css'
import { useRouter } from 'next/navigation'

interface AssessmentAttributes {
  title: string
  assessment_completed: boolean
}

interface Assessment {
  id: number
  attributes: {
    title: string
    assessment_completed: boolean
  }
}

interface AssessmentCardProps {
  assessment: Assessment
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  const router = useRouter()

  const handleTakeAssessment = () => {
    router.push(`/Assessments/${assessment.id}`)
  }

  return (
    <Paper
      className={classes.card}
      withBorder
      shadow='md'
      p={30}
      mt={30}
      radius='md'
    >
      <Grid>
        <Grid.Col span={6}>
          <Text className={classes.title}>{assessment.attributes.title}</Text>
        </Grid.Col>
        <Grid.Col span={6} className={classes.status}>
          {assessment.attributes.assessment_completed ? (
            <>
              <Text className={classes.complete}>Complete</Text>
              <IconCheck className={classes.complete} />
            </>
          ) : (
            <>
              <Text>Not Complete</Text>
              <IconX />
            </>
          )}
        </Grid.Col>
        <Grid.Col span={12}>
          <Button
            className={classes.button}
            disabled={assessment.attributes.assessment_completed}
            color={assessment.attributes.assessment_completed ? 'gray' : 'blue'}
            onClick={handleTakeAssessment}
          >
            Take Assessment
          </Button>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

export default AssessmentCard
