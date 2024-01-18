// QuestionCard.tsx
import { Button, Paper, Text, Grid, Center } from '@mantine/core'
import { useRouter } from 'next/navigation'
import classes from './QuestionCard.module.css'

interface QuestionCardProps {
  question: string
  onOptionSelect: (option: boolean) => void
  savedAnswer: boolean | null // New prop to handle saved answers
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onOptionSelect,
  savedAnswer,
}) => {
  const router = useRouter()

  const handleOptionSelect = (option: boolean) => {
    onOptionSelect(option)
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
        <Grid.Col span={12}>
          <Center>
            <Text className={classes.title}>{question}</Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={12} className={classes.buttonGroup}>
          <Button
            variant={savedAnswer === true ? 'filled' : 'outline'}
            color='blue'
            onClick={() => handleOptionSelect(true)}
          >
            True
          </Button>

          <Button
            variant={savedAnswer === false ? 'filled' : 'outline'}
            color='red'
            onClick={() => handleOptionSelect(false)}
          >
            False
          </Button>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

export default QuestionCard
