import './App.css'
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Box
} from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Edit, Delete, Add, PlayArrow } from '@mui/icons-material'
import initialQuizzes from './data/quizzes.json'
import CreateModal from './components/Quiz/CreateModal/CreateModal'
import EditModal from './components/Quiz/EditModal/EditModal'
import ConfirmationModal from './components/Quiz/ConfirmationModal/ConfirmationModal'
import QuizTakerPage from './pages/QuizTaker'

function App() {
  const [quizzes, setQuizzes] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null)
  const [isQuizTakerOpen, setIsQuizTakerOpen] = useState(false)
  const [takingQuiz, setTakingQuiz] = useState(null)

  useEffect(() => {
    const storedQuizzes = localStorage.getItem('quizzes')
    if (storedQuizzes) {
      setQuizzes(JSON.parse(storedQuizzes))
    } else {
      setQuizzes(initialQuizzes)
      localStorage.setItem('quizzes', JSON.stringify(initialQuizzes))
    }
  }, [])

  const saveQuizzes = (updatedQuizzes) => {
    setQuizzes(updatedQuizzes)
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes))
  }

  const handleEdit = (quizId) => {
    console.log('Edit quiz:', quizId)
    // TODO: Implement edit functionality
  }

  const handleDelete = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId)
      saveQuizzes(updatedQuizzes)
    }
  }

  const handleCreateNew = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleSaveNewQuiz = (newQuiz) => {
    const updatedQuizzes = [...quizzes, newQuiz]
    saveQuizzes(updatedQuizzes)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const handleConfirmDelete = () => {
    if (editingQuiz) {
      // Remove from active quizzes
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== editingQuiz.id)

      // Add to deleted quizzes collection
      const deletedQuizzes = JSON.parse(localStorage.getItem('deletedQuizzes') || '[]')
      deletedQuizzes.push(editingQuiz)
      localStorage.setItem('deletedQuizzes', JSON.stringify(deletedQuizzes))

      saveQuizzes(updatedQuizzes)
      setIsDeleteModalOpen(false)
      setEditingQuiz(null)
    }
  }

  const handleDeleteClick = (quiz) => {
    setEditingQuiz(quiz)
    setIsDeleteModalOpen(true)
  }

  const handleRowClick = (quiz) => {
    setEditingQuiz(quiz)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingQuiz(null)
  }

  const handleSaveEditQuiz = (updatedQuiz) => {
    const updatedQuizzes = quizzes.map(quiz =>
      quiz.id === updatedQuiz.id ? updatedQuiz : quiz
    )
    saveQuizzes(updatedQuizzes)
  }

  const handleStartQuiz = (quiz) => {
    // Navigate to QuizTaker page with quiz ID
    window.location.href = `/quiz-taker?quiz=${quiz.name}`
  }

  const handleCloseQuizTaker = () => {
    setIsQuizTakerOpen(false)
    setTakingQuiz(null)
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <h1 align="center">Kvizovi</h1>
            </div>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateNew}
              sx={{ mb: 2 }}
            >
              Novi kviz
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Ime</strong></TableCell>
                    <TableCell align="right"><strong>Akcija</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quizzes.map((quiz) => (
                    <TableRow
                      key={quiz.id}
                      onClick={() => handleRowClick(quiz)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <TableCell>{quiz.name}</TableCell>
                      <TableCell align="right">
                        <Link to={`/quiz-taker?quiz=${quiz.name}`}>
                          <IconButton
                            color="primary"
                            size="small"
                            title="Pokreni kviz"
                          >
                            <PlayArrow />
                          </IconButton>
                        </Link>
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRowClick(quiz)
                          }}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(quiz)
                          }}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <CreateModal
              open={isCreateModalOpen}
              onClose={handleCloseCreateModal}
              onSave={handleSaveNewQuiz}
            />

            <EditModal
              open={isEditModalOpen}
              onClose={handleCloseEditModal}
              onSave={handleSaveEditQuiz}
              quiz={editingQuiz}
            />

            <ConfirmationModal
              open={isDeleteModalOpen}
              onClose={handleCloseDeleteModal}
              onConfirm={handleConfirmDelete}
            />
          </div>
        } />
        <Route path="/quiz-taker" element={<QuizTakerPage />} />
      </Routes>
    </Router>
  )
}

export default App
