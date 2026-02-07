import { useState, useEffect } from 'react'
import { Box, Button, Typography, LinearProgress, IconButton } from '@mui/material'
import { ArrowBack, ArrowForward, Visibility, VisibilityOff } from '@mui/icons-material'
import Modal from '../Modal'

const QuizTaker = ({ open, onClose, quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [hiddenQuestions, setHiddenQuestions] = useState(new Set())

  const currentQuestion = quiz?.questions?.[currentQuestionIndex]

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

  const toggleQuestionVisibility = () => {
    setHiddenQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id)
      } else {
        newSet.add(currentQuestion.id)
      }
      return newSet
    })
  }

  const calculateResults = () => {
    if (!quiz?.questions) return
    
    setScore(quiz.questions.length)
    setShowResults(true)
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setShowResults(false)
    setScore(0)
    setHiddenQuestions(new Set())
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
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ 
                mr: 2,
                opacity: hiddenQuestions.has(currentQuestion.id) ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out'
              }}>
                {hiddenQuestions.has(currentQuestion.id) ? 'Odgovor nije dostupan' : currentQuestion.answer || 'Odgovor nije dostupan'}
              </Typography>
              
              <IconButton
                onClick={toggleQuestionVisibility}
                size="small"
                title={hiddenQuestions.has(currentQuestion.id) ? 'Prikaži odgovor' : 'Sakrij odgovor'}
              >
                {hiddenQuestions.has(currentQuestion.id) ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
          </Box>
        ) : (
          /* Results */
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Rezultati
            </Typography>
            <Typography variant="h3" sx={{ mb: 2, color: 'success.main' }}>
              Kviz završen!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Uspješno ste pregledali sva pitanja.
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
