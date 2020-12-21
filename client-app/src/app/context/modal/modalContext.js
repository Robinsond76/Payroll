import React, { createContext, useReducer } from 'react';
import modalReducer from './modalReducer';

const ModalContext = createContext();
const ModalDispatchContext = createContext();

const ModalProvider = ({ children }) => {
  const initialState = {
    open: false,
    body: null,
  };

  const [state, dispatch] = useReducer(modalReducer, initialState);

  return (
    <ModalContext.Provider value={state}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalContext.Provider>
  );
};

//Helper Functions

const useModalState = () => {
  const modalState = React.useContext(ModalContext);
  return modalState;
};

const useModalDispatch = () => {
  const modalDispatch = React.useContext(ModalDispatchContext);
  return modalDispatch;
};

export { ModalProvider, useModalState, useModalDispatch };
