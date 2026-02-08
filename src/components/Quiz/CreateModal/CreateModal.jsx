import { useState } from 'react'
import { TextField, IconButton, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material'
import { Add, Delete, Refresh } from '@mui/icons-material'
import Modal from '../../Modal'

const CreateModal = ({ open, onClose, onSave }) => {
  const [quizName, setQuizName] = useState(' ')
  const [questions, setQuestions] = useState([
    { question: ' ', answer: ' ' }
  ])
  const [isRecycleModalOpen, setIsRecycleModalOpen] = useState(false)
  const [allPreviousQuestions, setAllPreviousQuestions] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState(new Set())

  const handleSave = () => {
    if (quizName.trim() && questions.some(q => q.question.trim() && q.answer.trim())) {
      const validQuestions = questions.filter(q => q.question.trim() && q.answer.trim())
      onSave({
        id: Date.now(),
        name: quizName.trim(),
        questions: validQuestions
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setQuizName('')
    setQuestions([{ question: '', answer: '' }])
    onClose()
  }

  const addQuestion = () => {
    setQuestions([...questions, { question: ' ', answer: ' ' }])
  }

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index)
      setQuestions(updatedQuestions)
    }
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index][field] = value
    setQuestions(updatedQuestions)
  }

  const loadPreviousQuestions = () => {
    const storedQuizzes = localStorage.getItem('quizzes')
    const deletedQuizzes = localStorage.getItem('deletedQuizzes')
    
    let allQuestions = []
    
    // Load from active quizzes
    if (storedQuizzes) {
      const quizzes = JSON.parse(storedQuizzes)
      allQuestions = quizzes.flatMap(quiz => 
        quiz.questions.map((q, index) => ({
          ...q,
          sourceQuiz: quiz.name,
          questionNumber: index + 1,
          status: 'active'
        }))
      )
    }
    
    // Load from deleted quizzes
    if (deletedQuizzes) {
      const deleted = JSON.parse(deletedQuizzes)
      const deletedQuestions = deleted.flatMap(quiz => 
        quiz.questions.map((q, index) => ({
          ...q,
          sourceQuiz: `${quiz.name} (obrisan)`,
          questionNumber: index + 1,
          status: 'deleted'
        }))
      )
      allQuestions = [...allQuestions, ...deletedQuestions]
    }
    
    setAllPreviousQuestions(allQuestions)
    setIsRecycleModalOpen(true)
  }

  const toggleQuestionSelection = (index) => {
    const newSelected = new Set(selectedQuestions)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedQuestions(newSelected)
  }

  const addSelectedQuestions = () => {
    const questionsToAdd = Array.from(selectedQuestions).map(index => ({
      question: allPreviousQuestions[index].question,
      answer: allPreviousQuestions[index].answer
    }))
    setQuestions([...questions, ...questionsToAdd])
    setIsRecycleModalOpen(false)
    setSelectedQuestions(new Set())
  }

  const isFormValid = quizName.trim() && 
    questions.length >= 5 && 
    questions.length <= 25 &&
    questions.every(q => q.question.trim() && q.answer.trim())

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title="Novi Kviz"
        maxWidth="md"
        actions={[
          {
            label: 'Otkaži',
            onClick: handleClose,
            color: 'secondary'
          },
          {
            label: 'Kreiraj',
            onClick: handleSave,
            variant: 'contained',
            color: 'primary',
            disabled: !isFormValid
          }
        ]}
      >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Ime Kviza"
          fullWidth
          variant="outlined"
          error={quizName == ""}
          helperText={quizName == "" ? 'Ime kviza ne može biti prazno' : ''}
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          placeholder="Unesite ime kviza..."
        />

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <h3>Pitanja:</h3>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={loadPreviousQuestions}
                startIcon={<Refresh />}
                size="small"
                variant="outlined"
              >
                Recikliraj pitanja
              </Button>
            </Box>
          </Box>

          {questions.map((q, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Pitanje {index + 1}</span>
                {questions.length > 1 && (
                  <IconButton
                    onClick={() => removeQuestion(index)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
              
              <TextField
                fullWidth
                label="Pitanje"
                variant="outlined"
                value={q.question}
                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                placeholder="Unesite pitanje..."
                sx={{ mb: 1 }}
                error={q.question == ""}
                helperText={q.question == "" ? 'Pitanje ne može biti prazno' : ''}
              />
              
              <TextField
                fullWidth
                label="Odgovor"
                variant="outlined"
                value={q.answer}
                onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                placeholder="Unesite odgovor..."
                sx={{ mb: 1 }}
                error={q.answer == ""}
                helperText={q.answer == "" ? 'Odgovor ne može biti prazan' : ''}
              />

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <IconButton
                  onClick={addQuestion}
                  color="primary"
                  size="small"
                  sx={{ border: '1px dashed #1976d2', borderRadius: 1 }}
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      </Modal>

      <Dialog 
        open={isRecycleModalOpen} 
        onClose={() => setIsRecycleModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Recikliraj pitanja</DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {allPreviousQuestions.length === 0 ? (
              <p>Nema prethodnih pitanja za recikliranje.</p>
            ) : (
              allPreviousQuestions.map((q, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 1,
                    cursor: 'pointer',
                    backgroundColor: selectedQuestions.has(index) ? '#f5f5f5' : 'white'
                  }}
                  onClick={() => toggleQuestionSelection(index)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedQuestions.has(index)}
                        onChange={() => toggleQuestionSelection(index)}
                      />
                    }
                    label=""
                  />
                  <Box sx={{ ml: 2 }}>
                    <Box sx={{ fontWeight: 'bold', mb: 1 }}>
                      Pitanje: {q.question}
                    </Box>
                    <Box sx={{ color: '#666', mb: 1 }}>
                      Odgovor: {q.answer}
                    </Box>
                    <Box sx={{ fontSize: '12px', color: q.status === 'deleted' ? '#d32f2f' : '#999' }}>
                      Iz kviza: {q.sourceQuiz} (Pitanje {q.questionNumber})
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRecycleModalOpen(false)}>
            Otkaži
          </Button>
          <Button 
            onClick={addSelectedQuestions}
            variant="contained"
            disabled={selectedQuestions.size === 0}
          >
            Dodaj odabrana pitanja ({selectedQuestions.size})
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CreateModal
