import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function TopupMessage({ message, variant, onClose }) {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <Modal show={show} variant={variant} onHide={handleClose}
        backdrop="static"
        keyboard={false}>
        <Modal.Body>
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} variant="outline-primary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TopupMessage;
