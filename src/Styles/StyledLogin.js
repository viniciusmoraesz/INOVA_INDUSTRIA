import styled from "styled-components";
import bgImage from '../assets/login-bg.png';


export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

export const LeftSection = styled.div`
  flex: 3;
  background: url(${bgImage}) no-repeat center center;
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    color: white;
    font-weight: bold;
    font-size: 0.95rem;
    max-width: 500px;
    margin-bottom: 250px;
    margin-right: 250px;
  }
`;

export const RightSection = styled.div`
  flex: 1; 
  background-color: #0f3f63;     
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Form = styled.div`
  width: 90%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 250px;
`;

export const Title = styled.h2`
  text-align: center;
  color: white;
  margin-bottom: 20px;
  font-size: 3rem;
  font-weight: bolder;
`;

export const Label = styled.label`
  color: white;
  font-weight: bold;
  display: block;
  margin: 15px 0 5px;
  font-size: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  border: none;
  outline: none;
`;

export const Button = styled.button`
  color: black;
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  border: none;
  background-color: #61c3cc; 
  font-weight: 900;
  cursor: pointer;

  &:hover {
    background-color: #5bc0c0;
  }
`;

export const LinkText = styled.p`
  color: white;
  font-size: 0.97rem;
  margin-top: 15px;
  text-align: center;

  a {
    color: #61c3cc;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
