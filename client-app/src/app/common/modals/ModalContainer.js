import React from 'react';
import { Modal } from 'semantic-ui-react';
import {
  useModalState,
  useModalDispatch,
} from '../../context/modal/modalContext';
import { closeModal } from '../../context/modal/modalActions';

const ModalContainer = () => {
  const modalDispatch = useModalDispatch();
  const { open, body } = useModalState();

  return (
    <Modal open={open} onClose={() => closeModal(modalDispatch)} size='mini'>
      <Modal.Content>{body}</Modal.Content>
    </Modal>
  );
};

export default ModalContainer;
