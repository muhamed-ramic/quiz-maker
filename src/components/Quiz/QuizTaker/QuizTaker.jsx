import { useState, useEffect } from 'react'
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, LinearProgress } from '@mui/material'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import Modal from '../Modal'

const QuizTaker = ({ open, onClose, quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = quiz?.questions?.[currentQuestionIndex]

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const calculateResults = () => {
    if (!quiz?.questions) return
    
    let correctCount = 0
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.answer) {
        correctCount++
      }
    })
    
    setScore(correctCount)
    setShowResults(true)
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
  }

  const handleFinish = () => {
    onClose()
    handleRestart()
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <Modal open={open} onClose={onClose}>
        <Typography>Kviz nema pitanja za rješavanje.</Typography>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="lg">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">{quiz.name}</Typography>
          <Typography variant="body2">
            Pitanje {currentQuestionIndex + 1} od {quiz.questions.length}
          </Typography>
        </Box>

        {/* Progress Bar */}
        <LinearProgress 
          variant="determinate" 
          value={quiz?.questions ? (currentQuestionIndex + 1) / quiz.questions.length * 100 : 0} 
          sx={{ mb: 3 }}
        />

        {/* Question */}
        {!showResults && quiz?.questions ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentQuestion.question}
            </Typography>
            
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.options.map((option, index) => (
                <FormControlLabel 
                  key={index} 
                  value={option} 
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </Box>
        ) : (
          /* Results */
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Rezultati
            </Typography>
            <Typography variant="h3" sx={{ mb: 2, color: quiz?.questions ? (score >= quiz.questions.length * 0.8 ? 'success.main' : 'warning.main') : 'text.secondary' }}>
              Vaš rezultat: {score}/{quiz?.questions?.length || 0}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {quiz?.questions ? (
                score >= quiz.questions.length * 0.8 
                  ? 'Čestitamo! Odličan ste prošli kviz.' 
                  : `Pokušajte ponovo. Potrebno je ${quiz.questions.length * 0.8 - score} tačnih odgovora za prolaz.`
              ) : 'Nema pitanja za prikazivanje rezultata.'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBack />}
                onClick={handleRestart}
              >
                Ponovi
              </Button>
              <Button 
                variant="contained" 
                startIcon={<ArrowForward />}
                onClick={handleFinish}
              >
                Završi
              </Button>
            </Box>
          </Box>
        )}

        {/* Navigation */}
        {!showResults && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />}
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Prethodno
            </Button>
            <Button 
              variant="contained" 
              startIcon={<ArrowForward />}
              onClick={handleNext}
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Završi' : 'Sljedeće'}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  )
}

export default QuizTaker
