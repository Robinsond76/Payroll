const openModal = (body, dispatch) => {
  dispatch({ type: 'OPEN_MODAL', payload: body });
};

const closeModal = (dispatch) => {
  dispatch({ type: 'CLOSE_MODAL' });
};

export { openModal, closeModal };
