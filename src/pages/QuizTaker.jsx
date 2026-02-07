import { useState, useEffect } from 'react'
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, LinearProgress, IconButton } from '@mui/material'
import { ArrowBack, ArrowForward, Visibility, VisibilityOff } from '@mui/icons-material'

const QuizTaker = () => {
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [hiddenQuestions, setHiddenQuestions] = useState(new Set())

  const currentQuestion = quiz?.questions?.[currentQuestionIndex]

  // Get quiz ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const quizId = urlParams.get('quiz')
    
    if (quizId) {
      // Load quiz from localStorage
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]')
      const foundQuiz = storedQuizzes.find(q => q.name == quizId)
      setQuiz(foundQuiz || null)
      
      // Reset state when quiz changes
      setCurrentQuestionIndex(0)
      setAnswers({})
      setShowResults(false)
      setScore(0)
      setHiddenQuestions(new Set())
    }
  }, [window.location.search]) // Rerun when URL changes

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const toggleQuestionVisibility = (questionId) => {
    setHiddenQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
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
    setHiddenQuestions(new Set())
  }

  const handleFinish = () => {
    // Could save results to localStorage here
    window.close()
  }

  if (!quiz) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">
          Kviz nije pronađen.
        </Typography>
        <Button onClick={handleFinish}>
          Zatvori
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">{quiz?.name || 'Učitavanje...'}</Typography>
        <Typography variant="body2">
          Pitanje {currentQuestionIndex + 1} od {quiz?.questions?.length || 0}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, flex: 1 }}>
              Pitanje {currentQuestionIndex + 1}
            </Typography>
            <IconButton
              onClick={() => toggleQuestionVisibility(currentQuestion.id)}
              color={hiddenQuestions.has(currentQuestion.id) ? 'default' : 'primary'}
              title={hiddenQuestions.has(currentQuestion.id) ? 'Prikaži pitanje' : 'Sakrij pitanje'}
            >
              {hiddenQuestions.has(currentQuestion.id) ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>
          
          <Typography variant="h6" sx={{ 
            mb: 2, 
            opacity: hiddenQuestions.has(currentQuestion.id) ? 0.3 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}>
            {currentQuestion.question}
          </Typography>
          
          <Typography variant="body2" sx={{ 
            mb: 2, 
            opacity: hiddenQuestions.has(currentQuestion.id) ? 0.3 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}>
            {hiddenQuestions.has(currentQuestion.id) ? 'Odgovor nije dostupan' : currentQuestion.answer || 'Odgovor nije dostupan'}
          </Typography>
          
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            disabled={hiddenQuestions.has(currentQuestion.id)}
          >
            {currentQuestion.options ? (
              currentQuestion.options.map((option, index) => (
                <FormControlLabel 
                  key={index} 
                  value={option} 
                  control={<Radio />}
                  label={option}
                  disabled={hiddenQuestions.has(currentQuestion.id)}
                />
              ))
            ) : (
              <FormControlLabel 
                value="true" 
                control={<Radio />}
                label="Točno"
                disabled={hiddenQuestions.has(currentQuestion.id)}
              />
            )}
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
      {!showResults && quiz?.questions && (
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
  )
}

export default QuizTaker
