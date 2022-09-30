import { z } from 'zod';
import { styled } from 'solid-styled-components';

import { createForm } from '@felte/solid';
import { Component, createSignal, ParentProps } from 'solid-js';
import { validator } from '@felte/validator-zod';
import { reporter } from '@felte/reporter-solid';

import Input from './Input.jsx';
import CustomCheckbox from './CutomCheckbox.jsx';
import Loader from 'components/shared/Loader.jsx';

const REGULAMIN = `Akceptuję regulamin wyjazdu wyjazdu integracyjno-szkoleniowego "Delta 2022" dostępny <a href="/regulamin.pdf">pod tym adresem</a> i oświadczam, że zapoznałam / zapoznałem się z jego treścią.`;
const RODO = `Wyrażam zgodę na przetwarzanie moich danych osobowych przez Politechnikę Łódzką, adres siedziby: ul.
Żeromskiego 116, 90-924 Łódź, jako administratora, w celu zorganizowania i przeprowadzenia wyjazdu
integracyjno-szkoleniowego "Delta 2022" (dalej: Delty). Dane w zakresie imię i nazwisko, adres e-mail i
numer telefonu uczestników zawarte w Formularzu Rejestracyjnym przetwarzać będzie Organizator Wyjazdu -
Wydziałowa Rada Samorządu Wydziału Fizyki Technicznej, Informatyki i Matematyki Stosowanej Politechniki
Łódzkiej. Administrator informuje, że niniejsza zgoda może być wycofana w każdym czasie poprzez
przesłanie oświadczenia o wycofaniu zgody na adres: iod@adm.p.lodz.pl, wycofanie zgody nie wpływa jednak
na zgodność z prawem przetwarzania, którego dokonano na podstawie tej zgody przed jej wycofaniem. Także
zgadzam się na otrzymywanie wiadomości tekstowych dotyczących spraw organizacyjnych związanych z Deltą
na adres e-mail (i numer telefonu) podany w formularzu. Klauzula RODO dostępna jest
<a href="/klauzula-rodo.pdf">tutaj</a>.`;

const schema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Musi zawierać conajmniej 3 znaki' })
      .max(20, { message: 'Moze zawierać maksymalnie 20 znaków' }),
    surname: z
      .string()
      .min(3, { message: 'Musi zawierać conajmniej 3 znaki' })
      .max(20, { message: 'Moze zawierać maksymalnie 20 znaków' }),
    email: z.string().email({ message: 'Niepoprawny adres email' }).min(1, { message: 'To pole nie może być puste' }),
    confirmEmail: z
      .string()
      .email({ message: 'Niepoprawny adres email' })
      .min(1, { message: 'To pole nie może być puste' }),
    phoneNumber: z
      .string()
      .min(1, { message: 'To pole nie może być puste' })
      .regex(/^\d{9}$/, { message: 'Niepoprawny numer telefonu' }),
    rodo: z.literal(true),
    regulamin: z.literal(true),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'Podane adresy email różnią się od siebie',
    path: ['confirmEmail'],
  });

type FormSchema = z.infer<typeof schema>;

const submitFormData = async ({ name, surname, email, phoneNumber }: FormSchema) => {
  const response = await fetch(`https://delta-go.onrender.com/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, surname, email, phoneNumber }),
  }).then((res) => res.json());

  return response;
};

const RegisterForm: Component<ParentProps> = ({ children }) => {
  const [isAgreementClicked, setIsAgreementClicked] = createSignal(false);
  const [isRodoClicked, setIsRodoClicked] = createSignal(false);
  const [message, setMessage] = createSignal('');
  const [isSuccess, setIsSuccess] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const { form, errors } = createForm<FormSchema>({
    extend: [validator({ schema }), reporter()],
    onSubmit: async (data) => {
      setIsLoading(true);
      try {
        const response = await submitFormData(data);
        setIsSuccess(response.statusCode === 200);
        setMessage(response.message);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const ServerMessage = isSuccess() ? SuccessMessage : ErrorMessage;

  return (
    <Container>
      <Register>Rejestracja</Register>
      <RegisterSubtitle>Wypełnij formularz i dostań informację o starcie płatności.</RegisterSubtitle>
      <MainContent>
        <img src="/assets/cowboy.png" alt="Cowboy on a horse" />
        <FormWrapper>
          <form use:form>
            <Row>
              <Input name="name" label="Imię" placeholder="Jan"></Input>
              <Input name="surname" label="Nazwisko" placeholder="Kowalski"></Input>
            </Row>
            <Row>
              <Input name="email" label="Email" placeholder="przykladowy@email.com"></Input>
              <Input name="confirmEmail" label="Potwierdź email" placeholder="przykladowy@email.com"></Input>
            </Row>
            <Row>
              <Input name="phoneNumber" label="Nr telefonu" placeholder="213769420"></Input>
            </Row>
            <CustomCheckbox
              id="regulamin"
              label={REGULAMIN}
              isChecked={isRodoClicked()}
              setIsChecked={setIsRodoClicked}
            />
            <CustomCheckbox
              id="rodo"
              label={RODO}
              isChecked={isAgreementClicked()}
              setIsChecked={setIsAgreementClicked}
            />
            {!!errors().rodo || !!errors().regulamin ? (
              <ErrorMessage>Musisz zaakceptować powyższe zgody</ErrorMessage>
            ) : null}
            <SubmitButton isLoading={isLoading()}>{isLoading() ? <Loader size={40} /> : children}</SubmitButton>
            {message() ? <ServerMessage>{message()}</ServerMessage> : null}
          </form>
        </FormWrapper>
      </MainContent>
    </Container>
  );
};

const MainContent = styled.div`
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

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;

  @media (max-width: 722px) {
    flex-direction: column;
    margin-bottom: 0;
  }
`;

const Message = styled.span`
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

const ErrorMessage = styled(Message)`
  color: red;
`;

const SuccessMessage = styled(Message)`
  color: green;
`;

const SubmitButton = styled.div<{ isLoading: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.isLoading ? 'center' : 'flex-end')};
  margin-top: 1rem;

  @media (max-width: 722px) {
    justify-content: center;
  }
`;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 425px) {
    padding-top: 30px;
  }
`;

const Register = styled.div`
  text-transform: uppercase;
  font-size: 40px;
  font-weight: 700;

  @media (max-width: 722px) {
    font-size: 20px;
  }
`;

const RegisterSubtitle = styled.p`
  font-size: 20px;
  font-weight: 300px;
  font-family: Inter;
  max-width: 60vw;

  @media (max-width: 722px) {
    font-size: 12px;
  }
`;

const FormWrapper = styled.div`
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

export default RegisterForm;
