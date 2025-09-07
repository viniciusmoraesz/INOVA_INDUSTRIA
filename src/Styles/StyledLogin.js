import styled from "styled-components";
import bgImage from '../assets/login-bg.png';

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    height: 100vh;
  }
`;

export const LeftSection = styled.div`
  display: none;
  padding: 2rem;
  background: url(${bgImage}) no-repeat center center;
  background-size: cover;
  position: relative;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 40vh;
  
  p {
    color: white;
    font-weight: bold;
    font-size: var(--font-size-lg);
    max-width: 500px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 1rem;
  }

  @media (min-width: 768px) {
    display: flex;
    flex: 3;
    min-height: 100vh;
    
    p {
      margin: 0 auto 250px 0;
      padding: 0 2rem;
      text-align: left;
    }
  }

  @media (min-width: 1200px) {
    p {
      margin-right: 250px;
    }
  }
`;

export const RightSection = styled.div`
  background-color: #0f3f63;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  min-height: 60vh;
  
  @media (min-width: 768px) {
    flex: 1;
    min-height: 100vh;
    padding: 2rem;
  }
`;

export const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    width: 90%;
    max-width: 350px;
    margin-bottom: 150px;
  }
  
  @media (min-width: 1024px) {
    margin-bottom: 250px;
  }
`;

export const Title = styled.h2`
  text-align: center;
  color: white;
  margin: 0 0 1.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

export const Label = styled.label`
  color: white;
  font-weight: 600;
  display: block;
  margin: 0.5rem 0 0.25rem;
  font-size: var(--font-size-sm);
  
  @media (min-width: 768px) {
    font-size: var(--font-size-base);
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 20px;
  border: 2px solid transparent;
  outline: none;
  font-size: var(--font-size-sm);
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    border-color: #61c3cc;
    box-shadow: 0 0 0 3px rgba(97, 195, 204, 0.3);
  }
  
  @media (min-width: 768px) {
    padding: 0.875rem 1.25rem;
    font-size: var(--font-size-base);
  }
`;

export const Button = styled.button`
  color: black;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  border: none;
  background-color: #61c3cc;
  font-weight: 700;
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  
  &:hover, &:focus {
    background-color: #5bc0c0;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (min-width: 768px) {
    padding: 0.875rem 2rem;
    font-size: var(--font-size-base);
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4d4d;
  background-color: rgba(255, 0, 0, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: 1rem;
  border: 1px solid #ff4d4d;
`;

export const LinkText = styled.p`
  color: white;
  font-size: var(--font-size-sm);
  margin: 1.5rem 0 0;
  text-align: center;
  line-height: 1.5;

  a {
    color: #61c3cc;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;

    &:hover, &:focus {
      color: #5bc0c0;
      text-decoration: underline;
    }
  }
  
  @media (min-width: 768px) {
    font-size: var(--font-size-base);
  }
`;
