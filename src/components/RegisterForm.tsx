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
  surname: z
    .string()
    .min(4, { message: 'Musi zawierać conajmniej 4 znaki' })
    .max(20, { message: 'Moze zawierać maksymalnie 20 znaków' }),
  email: z.string().email({ message: 'Niepoprawny adres email' }).min(1, { message: 'To pole nie może być puste' }),
  confirmEmail: z
    .string()
    .email({ message: 'Niepoprawny adres email' })
    .min(1, { message: 'To pole nie może być puste' }),
  // Nie działa - nie wyświetla poprawnie błędu
  // emailForm: z
  //   .object({
  //     email: z.string().email({ message: 'Niepoprawny adres email' }).min(1, { message: 'To pole nie może być puste' }),
  //     confirmEmail: z
  //       .string()
  //       .email({ message: 'Niepoprawny adres email' })
  //       .min(1, { message: 'To pole nie może być puste' }),
  //   })
  //   .refine((data) => data.email === data.confirmEmail, { message: 'Podane adresy email różnią się od siebie' }),
  phoneNumber: z
    .number({
      required_error: 'To pole jest wymagane',
    })
    .min(111111111, { message: 'Niepoprawny numer telefonu' })
    .max(999999999, { message: 'Niepoprawny numer telefonu' }),
  rodo: z.literal(true),
  regulamin: z.literal(true),
});

type FormSchema = z.infer<typeof schema>;

const RegisterForm: Component = () => {
  const [isAgreementClicked, setIsAgreementClicked] = createSignal(false);
  const [isRodoClicked, setIsRodoClicked] = createSignal(false);

  const { form, validate, data, errors } = createForm<FormSchema>({
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
            {/* <Row>
              <Input name="emailForm.email" label="Email" placeholder="przykladowy@email.com"></Input>
              <Input name="emailForm.confirmEmail" label="Potwierdź email" placeholder="przykladowy@email.com"></Input>
            </Row> */}
            <Row>
              <Input name="phoneNumber" label="Nr telefonu" placeholder="213769420" type="number"></Input>
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

            <button
              type="submit"
              onClick={() => {
                console.log(data());
                console.log(errors());
                validate();
              }}
            >
              submit
            </button>
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
  /* margin-top: 2vh; */

  @media (max-width: 1200px) {
    width: 90vw;
    justify-content: center;
  }

  @media (max-width: 722px) {
    margin-top: 20px;
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
  }
`;

const ErrorMessage = styled.span`
  color: red;
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
  width: 35vw;

  @media (max-width: 1200px) {
    width: 60vw;
  }

  @media (max-width: 800px) {
    padding: 40px 50px;
    border-radius: 10px;
  }

  @media (max-width: 722px) {
    padding: 20px 30px;
    width: 70vw;
  }
`;

export default RegisterForm;
