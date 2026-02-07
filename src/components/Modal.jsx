import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from '@mui/material'

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {children}
        </Box>
      </DialogContent>
      
      {actions && (
        <DialogActions>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'text'}
              color={action.color || 'primary'}
              onClick={action.onClick}
              disabled={action.disabled}
              startIcon={action.startIcon}
              type={action.type || 'button'}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  )
}

export default Modal
