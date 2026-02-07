# Quiz Maker Application

A comprehensive quiz management and taking application built with React, Material-UI, and Vite.

## 🚀 Features

### Quiz Management
- **Create Quizzes** - Add new quizzes with multiple questions
- **Edit Quizzes** - Modify existing quiz names and questions
- **Delete Quizzes** - Remove quizzes with question preservation
- **Quiz Table** - Clean table display with actions
- **Question Recycling** - Reuse questions from previous quizzes

### Quiz Taking
- **Slideshow Format** - One question at a time
- **Progress Tracking** - Visual progress bar
- **Answer Hiding** - Toggle question/answer visibility
- **Score Calculation** - Automatic scoring with pass/fail feedback
- **URL Sharing** - Shareable quiz links

### Data Management
- **LocalStorage** - Client-side persistence
- **Quiz Preservation** - Deleted quizzes saved for recycling
- **State Management** - React hooks for clean state
- **Form Validation** - Real-time input validation

## 🛠️ Technologies

### Frontend
- **React 18** - Modern hooks and components
- **Material-UI (MUI)** - Professional UI components
- **React Router** - Client-side routing
- **Vite** - Fast development build tool

### Development
- **JavaScript (ES6+)** - Modern syntax
- **CSS-in-JS** - Styled components
- **Git** - Version control

## 📁 Project Structure

```
src/
├── components/
│   ├── Modal/
│   │   └── Modal.jsx
│   └── Quiz/
│       ├── CreateModal/
│       │   └── CreateModal.jsx
│       ├── EditModal/
│       │   └── EditModal.jsx
│       ├── ConfirmationModal/
│       │   └── ConfirmationModal.jsx
│       └── QuizTaker/
│           └── QuizTaker.jsx
├── pages/
│   └── QuizTaker.jsx
├── data/
│   └── quizzes.json
├── App.jsx
├── main.jsx
└── index.css
```

## 🎯 How to Use

### Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/muhamed-ramic/quiz-maker.git
   cd quiz-maker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Application Usage

#### Quiz Management
1. **View Quizzes** - Main table shows all created quizzes
2. **Create New Quiz** - Click "Novi kviz" button
3. **Edit Quiz** - Click row or edit button
4. **Delete Quiz** - Click delete button (questions preserved)
5. **Recycle Questions** - Use "Recikliraj pitanja" in CreateModal

#### Quiz Taking
1. **Start Quiz** - Click play button on any quiz
2. **Navigate Questions** - Use Previous/Next buttons
3. **Answer Questions** - Select radio button answers
4. **Hide/Show** - Toggle question visibility
5. **View Results** - See score and pass/fail status
6. **Share Links** - Copy URL for others to take quiz

## 🔧 Configuration

### Environment Variables
- `VITE_API_URL` - API endpoint (if needed)
- `VITE_APP_TITLE` - Application title

### Build Configuration
- **Vite Config** - `vite.config.js`
- **Port** - Default: 5173
- **Hot Reload** - Enabled in development

## 📱 Features in Detail

### Quiz Creation
- **Dynamic Questions** - Add/remove unlimited questions
- **Question Validation** - Real-time empty field checking
- **Answer Options** - Multiple choice support
- **Recycling System** - Load from active/deleted quizzes
- **Minimum Questions** - 5 questions required

### Quiz Taking
- **Responsive Design** - Works on all screen sizes
- **Progress Indicator** - Linear progress bar
- **Keyboard Navigation** - Previous/Next buttons
- **Score Calculation** - 80% passing grade
- **URL Parameters** - Shareable quiz links
- **Answer Hiding** - Toggle visibility for instructor control

### Data Persistence
- **LocalStorage** - Client-side data storage
- **Quiz Backup** - Deleted questions preserved
- **State Sync** - Automatic state management
- **Form Reset** - Clean modal closures

## 🎨 UI/UX Features

### Material-UI Integration
- **Consistent Theming** - Professional design system
- **Responsive Layout** - Mobile-friendly interface
- **Interactive Elements** - Hover states and transitions
- **Error Handling** - Visual validation feedback
- **Loading States** - Smooth user experience

### Accessibility
- **Keyboard Navigation** - Arrow key support
- **Screen Reader Support** - Semantic HTML
- **Focus Management** - Proper tab order
- **Color Contrast** - WCAG compliant colors

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Application
```bash
npm run preview
```

### Environment Setup
- **Development** - `npm run dev`
- **Production** - `npm run build`
- **Testing** - `npm run test` (if added)

## 📊 Data Flow

### Quiz Creation Flow
1. User fills quiz name and questions
2. Form validation checks for completeness
3. Quiz saved to localStorage
4. Quiz appears in main table

### Quiz Taking Flow
1. User navigates to `/quiz-taker?quiz=name`
2. Quiz loads from localStorage by name
3. User answers questions sequentially
4. Results calculated and displayed

### Data Management
- **Active Quizzes** - `localStorage.getItem('quizzes')`
- **Deleted Quizzes** - `localStorage.getItem('deletedQuizzes')`
- **User Answers** - Component state during session

## 🔒 Security Considerations

- **Client-Side Storage** - No server-side data exposure
- **Input Validation** - XSS prevention through form controls
- **URL Sanitization** - Safe parameter handling
- **State Isolation** - No data leakage between components

## 🤝 Contributing

### Development Guidelines
1. **Follow Code Style** - Consistent with existing patterns
2. **Test Features** - Verify functionality before commit
3. **Update Documentation** - Keep README current
4. **Use Git Branches** - Feature isolation

### Commit Standards
- **Clear Messages** - Descriptive commit titles
- **Atomic Changes** - One feature per commit
- **Proper Formatting** - Follow project conventions

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Material-UI** - For excellent component library
- **Vite** - For fast development experience
- **Open Source Community** - For tools and inspiration

---

**Built with ❤️ for efficient quiz management and taking**
