import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const fadeIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const fadeOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-20px); opacity: 0; }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ToastItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  min-width: 280px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${fadeIn} 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  
  &.exiting {
    animation: ${fadeOut} 0.3s ease-out forwards;
  }
  
  &.success {
    border-left: 4px solid #28a745;
  }
  
  &.error {
    border-left: 4px solid #dc3545;
  }
  
  .icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    
    &.success {
      color: #28a745;
    }
    
    &.error {
      color: #dc3545;
    }
  }
  
  .content {
    flex: 1;
    
    h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      color: #2d3436;
    }
    
    p {
      margin: 0;
      font-size: 0.875rem;
      color: #6c757d;
    }
  }
  
  .close {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f8f9fa;
    }
    
    svg {
      font-size: 1.25rem;
    }
  }
`;

export const showToast = (message, type = 'success', duration = 5000) => {
  const event = new CustomEvent('show-toast', {
    detail: { message, type, duration }
  });
  window.dispatchEvent(event);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  useEffect(() => {
    const handleShowToast = (e) => {
      const { message, type, duration } = e.detail;
      const id = Date.now();
      
      setToasts(prev => [...prev, { id, message, type, duration }]);
      
      setTimeout(() => {
        removeToast(id);
      }, duration);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, exiting: true } : toast
    ));
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  return (
    <>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            className={`${toast.type} ${toast.exiting ? 'exiting' : ''}`}
          >
            <div className={`icon ${toast.type}`}>
              {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
            </div>
            <div className="content">
              <h4>{toast.type === 'success' ? 'Sucesso!' : 'Erro!'}</h4>
              <p>{toast.message}</p>
            </div>
            <button 
              className="close" 
              onClick={() => removeToast(toast.id)}
              aria-label="Fechar notificação"
            >
              <FiX />
            </button>
          </ToastItem>
        ))}
      </ToastContainer>
    </>
  );
};

export default ToastProvider;
