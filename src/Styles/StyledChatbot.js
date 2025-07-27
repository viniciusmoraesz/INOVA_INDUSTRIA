import styled from 'styled-components';

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

export const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #2c3e50;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const ChatWindow = styled.div`
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .chat-header {
    background-color: #2c3e50;
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 1.2rem;
    }

    button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 1.2rem;
    }
  }
`;

export const MessageList = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

export const Message = styled.div`
  max-width: 80%;
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: 15px;
  position: relative;
  word-wrap: break-word;

  &.user {
    background-color: #2c3e50;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 0;
  }

  &.bot {
    background-color: #e0e0e0;
    color: #333;
    margin-right: auto;
    border-bottom-left-radius: 0;
  }
`;

export const InputArea = styled.div`
  display: flex;
  padding: 10px;
  background: white;
  border-top: 1px solid #eee;
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  margin-right: 10px;

  &:focus {
    border-color: #2c3e50;
  }
`;

export const SendButton = styled.button`
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #1a252f;
  }
`;