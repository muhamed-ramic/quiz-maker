import Modal from '../../Modal'
import { Button } from "@mui/material"

export default function ConfirmationModal({open, onClose, onConfirm}) {
  return (
    <Modal open={open} onClose={onClose}>
      <p>DA li želiš obrisati kviz ? </p>
      <Button onClick={onConfirm}>Da</Button>
      <Button onClick={onClose}>Ne</Button>
    </Modal>
  )
}