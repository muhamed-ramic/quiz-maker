import { useState, useEffect } from 'react'
import { TextField, IconButton, Box } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import Modal from '../../Modal'

const EditModal = ({ open, onClose, onSave, quiz }) => {
  const [quizName, setQuizName] = useState(' ')
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    if (quiz) {
      setQuizName(quiz.name)
      setQuestions(quiz.questions.length > 0 ? quiz.questions : [{ question: ' ', answer: ' ' }])
    }
  }, [quiz])

  const handleSave = () => {
    if (quizName.trim() && questions.every(q => q.question.trim() && q.answer.trim())) {
      const validQuestions = questions.filter(q => q.question.trim() && q.answer.trim())
      onSave({
        ...quiz,
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

  const isFormValid = quizName.trim() && 
    questions.length >= 1 && 
    questions.every(q => q.question.trim() && q.answer.trim())

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Uredi Kviz"
      maxWidth="md"
      actions={[
        {
          label: 'Otkaži',
          onClick: handleClose,
          color: 'secondary'
        },
        {
          label: 'Spremi',
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
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          placeholder="Unesite ime kviza..."
          error={quizName == ""}
          helperText={quizName == "" ? 'Ime kviza ne može biti prazno' : ''}
        />

        <Box>
          <h3>Pitanja:</h3>

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
  )
}

export default EditModal
