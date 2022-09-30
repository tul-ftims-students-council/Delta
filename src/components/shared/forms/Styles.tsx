import { styled } from 'solid-styled-components';

export const MainContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  margin-top: 5vh;
  margin-bottom: 35px;

  @media (max-width: 1200px) {
    width: 90vw;
    justify-content: center;
  }

  @media (max-width: 722px) {
    margin-top: 20px;
  }

  @media (max-width: 425px) {
    margin-top: 10px;
  }

  & > img {
    width: 400px;
    height: 100%;
    object-fit: cover;
    margin-right: 20px;

    @media (max-width: 1200px) {
      display: none;
    }
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;

  @media (max-width: 722px) {
    flex-direction: column;
    margin-bottom: 0;
  }
`;

export const Message = styled.span`
  font-family: Inter;
  margin-top: 4px;
  font-size: 10px;
  min-height: 16px;
  font-weight: 300;
  display: flex;
  justify-content: flex-start;

  @media (max-width: 722px) {
    justify-content: center;
  }
`;

export const ErrorMessage = styled(Message)`
  color: red;
`;

export const SuccessMessage = styled(Message)`
  color: green;
`;

export const SubmitButton = styled.div<{ isLoading: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.isLoading ? 'center' : 'flex-end')};
  margin-top: 1rem;

  @media (max-width: 722px) {
    justify-content: center;
  }
`;

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 425px) {
    padding-top: 30px;
  }
`;

export const FormTitle = styled.div`
  text-transform: uppercase;
  font-size: 40px;
  font-weight: 700;
  color: #300f07;

  @media (max-width: 722px) {
    font-size: 20px;
  }
`;

export const FormSubtitle = styled.p`
  font-size: 20px;
  font-weight: 300px;
  font-family: Inter;
  color: #300f07;
  max-width: 60vw;

  @media (max-width: 722px) {
    font-size: 12px;
  }
`;

export const FormWrapper = styled.div`
  background-color: white;
  box-shadow: 0px 6px 12px rgba(29, 10, 6, 0.08);
  border-radius: 40px;
  padding: 50px 70px;
  width: 50%;

  @media (max-width: 1500px) {
    width: 55%;
    padding: 50px 60px;
  }

  @media (max-width: 1200px) {
    width: 60vw;
  }

  @media (max-width: 800px) {
    padding: 40px 50px;
    border-radius: 10px;
    width: 65vw;
  }

  @media (max-width: 722px) {
    padding: 20px 30px;
    width: 70vw;
  }
`;
