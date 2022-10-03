import { z } from 'zod';

import { createForm } from '@felte/solid';
import { Component, createSignal, ParentProps } from 'solid-js';
import { validator } from '@felte/validator-zod';
import { reporter } from '@felte/reporter-solid';

import Input from '../shared/forms/Input.jsx';
import CustomCheckbox from 'components/shared/forms/CustomCheckbox.jsx';
import Loader from 'components/shared/Loader.jsx';
import {
  SuccessMessage,
  ErrorMessage,
  Container,
  FormSubtitle,
  MainContent,
  FormWrapper,
  Row,
  SubmitButton,
  FormTitle,
} from 'components/shared/forms/Styles.jsx';
import { BASE_URL } from 'config/api.js';

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
  const response = await fetch(`${BASE_URL}}/users/register`, {
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
      <FormTitle>Rejestracja</FormTitle>
      <FormSubtitle>Wypełnij formularz i dostań informację o starcie płatności.</FormSubtitle>
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

export default RegisterForm;
