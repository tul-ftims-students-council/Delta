import { createForm } from '@felte/solid';
import { Component, createSignal } from 'solid-js';
import { validator } from '@felte/validator-zod';
import { reporter } from '@felte/reporter-solid';
import { z } from 'zod';
import { styled } from 'solid-styled-components';
import Input from './Input.jsx';
import Cowboy from '/assets/cowboy.png';
import CustomCheckbox from './CutomCheckbox.jsx';

const REGULAMIN = `Akceptuję regulamin wyjazdu wyjazdu integracyjno-szkoleniowego "Delta 2022" dostępny <a>pod tym adresem</a> i oświadczam, że zapoznałam / zapoznałem się z jego treścią.`;
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
<a href="#">tutaj</a>.`;

const schema = z.object({
  name: z
    .string()
    .min(4, { message: 'Musi zawierać conajmniej 4 znaki' })
    .max(20, { message: 'Moze zawierać maksymalnie 20 znaków' }),
  surname: z.string(),
  email: z.string().email().min(1),
  confirmEmail: z.string().email().min(1),
  phoneNumber: z.string(),
  regulamin: z.boolean(),
  zgoda: z.boolean(),
});

type FormSchema = z.infer<typeof schema>;

const RegisterForm: Component = () => {
  const [isAgreementClicked, setIsAgreementClicked] = createSignal(false);
  const [isRodoClicked, setIsRodoClicked] = createSignal(false);

  const { form } = createForm<FormSchema>({
    extend: [validator({ schema }), reporter()],
    onSubmit: (values) => {
      console.log({ values });
    },
    onError(err, context) {
      console.log('Error', { err }, { context });
    },
    onSuccess(err, context) {
      console.log('Success', { err }, { context });
    },
  });
  return (
    <Container>
      <Register>Rejestracja</Register>
      <RegisterSubtitle>Wypełnij formularz i dostań informację o starcie płatności.</RegisterSubtitle>
      <MainContent>
        <img src={Cowboy} alt="Cowboy on a horse" />
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
            {/* <CheckboxContainer>
              <Checkbox />
              <span>
                Akceptuję regulamin wyjazdu wyjazdu integracyjno-szkoleniowego "Delta 2022" dostępny{' '}
                <a>pod tym adresem</a> i oświadczam, że zapoznałam / zapoznałem się z jego treścią.
              </span>
            </CheckboxContainer> */}
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

            <button type="submit">submit</button>
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

  & > img {
    width: 400px;
    height: 100%;
    object-fit: cover;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 20px;

  & > span {
    font-family: Inter;
    font-weight: 400;
    font-size: 8px;
    line-height: 12px;
    width: 90%;
    color: #300f07;
    & > a {
      color: #e4780c;
      text-decoration: none;
    }
  }
`;
const Checkbox = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid rgba(48, 15, 7, 0.25);
  margin-right: 20px;
`;

const Container = styled.section`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Register = styled.div`
  text-transform: uppercase;
  font-size: 40px;
  font-weight: 700;
`;

const RegisterSubtitle = styled.p`
  font-size: 20px;
  font-weight: 300px;
  font-family: Inter;
`;

const FormWrapper = styled.div`
  background-color: white;
  box-shadow: 0px 6px 12px rgba(29, 10, 6, 0.08);
  border-radius: 40px;
  padding: 50px 70px;
  width: 35vw;

  & > form {
    & > input {
      font-size: 14px;
      font-family: Inter;
      font-weight: 600;
      line-height: 40px;
      border-radius: 10px;
      padding: 0px 14px;
      background: #ffffff;
      border: 1px solid rgba(48, 15, 7, 0.25);
      border-radius: 10px;
      color: #300f07;
    }

    & > label {
      font-weight: 700;
      font-size: 14px;
      line-height: 28px;
      color: #300f07;
      text-transform: uppercase;
    }
  }
`;

export default RegisterForm;
