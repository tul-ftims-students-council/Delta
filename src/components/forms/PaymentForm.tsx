import { z } from 'zod';

import { createForm } from '@felte/solid';
import { Component, createSignal, onMount, ParentProps } from 'solid-js';
import { validator } from '@felte/validator-zod';
import { reporter } from '@felte/reporter-solid';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];

import Input from '../shared/forms/Input.jsx';
import Loader from 'components/shared/Loader.jsx';
import {
  Container,
  ErrorMessage,
  FormSubtitle,
  FormTitle,
  FormWrapper,
  MainContent,
  Row,
  SubmitButton,
  SuccessMessage,
  InfoCards,
  Card,
  CardHeader,
  CardSubheader,
  CardSubtitle,
  CardSubheaderBottom,
  CardSubtitleBottom,
} from 'components/shared/forms/Styles.jsx';
import Select from 'components/shared/forms/Select.jsx';
import Option from 'components/shared/forms/Option.jsx';
import FileInput from 'components/shared/forms/FileInput.jsx';
import ReservationCounter from 'components/payment/ReservationCounter.jsx';
import { styled } from 'solid-styled-components';
import CustomCheckbox from 'components/shared/forms/CustomCheckbox.jsx';

const formSchema = z
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
    faculty: z.string().min(1, { message: 'To pole nie może być puste' }),
    major: z.string().min(1, { message: 'To pole nie może być puste' }),
    year: z
      .number({ required_error: 'To pole nie może być puste', invalid_type_error: 'Wartość musi być liczbą' })
      .min(1, { message: 'To pole nie może być puste' })
      .max(7, { message: 'Niepoprawny rok studiów' }),
    tShirtSize: z.string().min(1, { message: 'To pole nie może być puste' }),
    diet: z.string().min(1, { message: 'To pole nie może być puste' }),
    file: z
      .instanceof(File, { message: 'Nie wybrano żadnego pliku.' })
      .refine((file) => file.size <= MAX_FILE_SIZE, `Maksymalny rozmiar pliku to 5MB.`)
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        'tylko pliki w formacie .jpg, .jpeg, .png and .webp. i .pdf są akceptowane',
      ),
    footSize: z
      .number({ required_error: 'To pole nie może być puste', invalid_type_error: 'Wartość musi być liczbą' })
      .min(30, { message: 'Niepoprawny rozmiar buta' })
      .max(50, { message: 'Niepoprawny rozmiar buta' }),
    invoice_address: z
      .string()
      .min(3, { message: 'Musi zawierać conajmniej 3 znaki' })
      .max(200, { message: 'Moze zawierać maksymalnie 200 znaków' }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'Podane adresy email różnią się od siebie',
    path: ['confirmEmail'],
  });

type FormSchema = z.infer<typeof formSchema>;

const userResponseSchema = z.object({
  ID: z.number(),
  CreatedAt: z.string(),
  UpdatedAt: z.string(),
  DeletedAt: z.string().nullable(),
  id: z.number(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
});

const BASE_URL = `https://delta-go.onrender.com`;

const submitFormData = async ({
  email,
  major,
  tShirtSize,
  diet,
  file,
  faculty,
  year,
  footSize,
  invoice_address,
}: FormSchema) => {
  const formData = new FormData();
  formData.append('Major', major);
  formData.append('Faculty', faculty);
  formData.append('Year', year.toString());
  formData.append('TShirtSize', tShirtSize);
  formData.append('Diet', diet);
  formData.append('PaymentFile', file);
  formData.append('FileExtension', file.type);
  formData.append('FootSize', footSize.toString());
  formData.append('InvoiceAddress', invoice_address);

  const response = await fetch(`${BASE_URL}/users/${email}/payment/send`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());

  return response;
};

const getRemainingPlaces = async () => {
  const response = await fetch(`${BASE_URL}/reservations/left`).then((res) => res.json());
  return response;
};

const PaymentForm: Component<ParentProps> = ({ children }) => {
  const [message, setMessage] = createSignal('');
  const [isSuccess, setIsSuccess] = createSignal(false);
  const [isExisting, setIsExisting] = createSignal(false);
  const [remainingPlaces, setRemainingPlaces] = createSignal(0);
  const [reservationDate, setReservationDate] = createSignal<Date>();
  const [isLoading, setIsLoading] = createSignal(false);
  const [isInvoiceNeeded, setIsInvoiceNeeded] = createSignal(false);

  onMount(async () => {
    const remainingPlaces = await getRemainingPlaces();
    setRemainingPlaces(remainingPlaces);
  });

  const { form, setData, data } = createForm<FormSchema>({
    extend: [validator({ schema: formSchema }), reporter()],
    onSubmit: async (data) => {
      setIsLoading(true);

      try {
        const response = await submitFormData(data);
        setIsSuccess(response.statusCode === 200);
        setRemainingPlaces((remainingPlaces) => remainingPlaces - 1);
        setMessage('Formularz został poprawnie wysłany, dziękujemy!');
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const ServerMessage = isSuccess() ? SuccessMessage : ErrorMessage;

  const startPayment = async (email: string) => {
    const response = await fetch(`${BASE_URL}/users/${email}/payment/start`);
    if (response.status !== 200) {
      setMessage('Nie można zarezerwować miejsca.');
    } else {
      const data = await response.json();
      setReservationDate(new Date(data.message));
    }
  };

  const getUserDetails = async (email: string) => {
    const response = await fetch(`${BASE_URL}/users/${email}/`);

    if (response.status === 200) {
      const userData = userResponseSchema.parse(await response.json());
      setData('email', userData.email);
      setData('confirmEmail', userData.email);
      setData('name', userData.name);
      setData('surname', userData.surname);
      setData('phoneNumber', userData.phoneNumber);
      try {
        await startPayment(userData.email);
        setIsExisting(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const hasPaymentsStarted = Date.now() > Date.parse('03 Oct 2022 18:00:00');
  const areThereAnyPlacesLeft = () => remainingPlaces() > 0;

  return (
    <Container>
      {hasPaymentsStarted && areThereAnyPlacesLeft() ? (
        <>
          <FormTitle>Płatności</FormTitle>
          <FormSubtitle>Wypełnij formularz, zrób przelew i zagwarantuj sobie miejsce na wyjeździe.</FormSubtitle>
          <FormSubtitle>Spiesz się! Pozostało {remainingPlaces()} miejsc.</FormSubtitle>
          <MainContent>
            <InfoCards>
              {reservationDate() && <ReservationCounter startDate={reservationDate() ?? new Date()} />}
              <Card>
                <CardHeader>Dane do przelewu</CardHeader>
                <CardSubheader>KWOTA</CardSubheader>
                <CardSubtitle>350zł</CardSubtitle>

                <CardSubheader>odbiorca</CardSubheader>
                <CardSubtitle>
                  POLITECHNIKA ŁÓDZKA
                  <br />
                  Wydział Fizyki Technicznej, Informatyki i Matematyki Stosowanej
                  <br />
                  ul. Wólczańska 21
                  <br />
                  593-005 Łódź
                </CardSubtitle>

                <CardSubheader>tytuł przelewu</CardSubheader>
                <CardSubtitle>Delta 2022 - Imię Nazwisko</CardSubtitle>

                <CardSubheader>nr konta odbiorcy</CardSubheader>
                <CardSubtitle>23 1240 3028 1111 0010 3742 1516</CardSubtitle>
              </Card>
              <Card>
                <CardHeader>Przydatne linki</CardHeader>
                <CardSubheaderBottom>
                  <a href="/oswiadczenie-obozowe.pdf">Oświadczenie obozowe</a>
                </CardSubheaderBottom>
                <CardSubtitleBottom>Wypełniony dokument jest niezbędny do odprawy!</CardSubtitleBottom>

                <CardSubheaderBottom>
                  <a href="/rozmiary.png">wymiary koszulek</a>
                </CardSubheaderBottom>
                <CardSubtitleBottom>Tabelka z danymi szczegółowymi od producenta.</CardSubtitleBottom>
              </Card>
            </InfoCards>
            <FormWrapper>
              <form use:form>
                <Row>
                  <Input
                    value={data().email}
                    onChange={(e) => getUserDetails(e.target.value)}
                    name="email"
                    label="Email"
                    placeholder="przykladowy@email.com"
                  ></Input>
                  <Input
                    disabled={isExisting()}
                    value={data().confirmEmail}
                    name="confirmEmail"
                    label="Potwierdź email"
                    placeholder="przykladowy@email.com"
                  ></Input>
                </Row>
                <Row>
                  <Input disabled={isExisting()} value={data().name} name="name" label="Imię" placeholder="Jan"></Input>
                  <Input
                    disabled={isExisting()}
                    value={data().surname}
                    name="surname"
                    label="Nazwisko"
                    placeholder="Kowalski"
                  ></Input>
                </Row>
                <Row>
                  <Input
                    disabled={isExisting()}
                    value={data().phoneNumber}
                    name="phoneNumber"
                    label="Nr telefonu"
                    placeholder="213769420"
                  ></Input>
                  <Select name="faculty" label="Wydział">
                    <Option value="" disabled>
                      Wybierz wydział
                    </Option>
                    <Option value="WM">Wydział Mechaniczny</Option>
                    <Option value="WEEIA">Wydział Elektrotechniki, Elektroniki, Informatyki i Automatyki</Option>
                    <Option value="WCH">Wydział Chemiczny</Option>
                    <Option value="WTMITW">Wydział Technologii Materiałowych i Wzornictwa Tekstyliów</Option>
                    <Option value="BINOZ">Wydział Biotechnologii i Nauk o Żywności</Option>
                    <Option value="BAIS">Wydział Budownictwa, Architektury i Inżynierii Środowiska</Option>
                    <Option value="FTIMS">Wydział Fizyki Technicznej, Informatyki i Matematyki Stosowanej</Option>
                    <Option value="OIZ">Wydział Organizacji i Zarządzania</Option>
                    <Option value="WIPOS">Wydział Inżynierii Procesowej i Ochrony Środowiska</Option>
                    <Option value="IFE">Centrum Kształcenia Międzynarodowego</Option>
                    <Option value="NotFromTechUni">Spoza Politechnniki Łódzkiej</Option>
                  </Select>
                </Row>
                <Row>
                  <Input name="major" label="Kierunek Studiów" placeholder="Fizyka Techniczna"></Input>
                  <Input name="year" placeholder="1" label="Rok Studiów" type="number" min="1" max="7" />
                </Row>
                <Row>
                  <Select label="Rozmiar koszulki" name="tShirtSize">
                    <Option value="" disabled>
                      Wybierz rozmiar
                    </Option>
                    <Option value="xs">XS</Option>
                    <Option value="s">S</Option>
                    <Option value="m">M</Option>
                    <Option value="lL">L</Option>
                    <Option value="xl">XL</Option>
                    <Option value="xxl">XXL</Option>
                    <Option value="3xl">3XL</Option>
                  </Select>
                  <Select label="Dieta" name="diet">
                    <Option value="" disabled>
                      Wybierz rodzaj
                    </Option>
                    <Option value="normal">mięsna</Option>
                    <Option value="vegan">wegańska</Option>
                    <Option value="vegetarian">wegetariańska</Option>
                  </Select>
                </Row>
                <Row>
                  <Input name="footSize" placeholder="42" label="Rozmiar buta" type="number" min="1" max="7" />
                </Row>
                <CustomCheckbox
                  id="rodo"
                  label="Chcę otrzymać fakturę"
                  isChecked={isInvoiceNeeded()}
                  setIsChecked={setIsInvoiceNeeded}
                  center
                  noMargin
                />
                {isInvoiceNeeded() && (
                  <Row>
                    <Input name="invoice_address" placeholder="Adres" label="Adres do faktury" />
                  </Row>
                )}
                <Row>
                  <FileInput fileName={data().file ? data().file.name : ''} name="file" label="Dowód przelewu" />
                  <SubmitButton isLoading={isLoading()}>{isLoading() ? <Loader size={40} /> : children}</SubmitButton>
                </Row>
                <Message>{message() ? <ServerMessage>{message()}</ServerMessage> : null}</Message>
              </form>
            </FormWrapper>
          </MainContent>
        </>
      ) : (
        <Finish>Płatności na Deltę są nieaktywne</Finish>
      )}
    </Container>
  );
};

export default PaymentForm;

const Finish = styled.h1`
  font-family: Inter;
  display: flex;
  align-items: center;
  height: 70vh;
  margin-bottom: 15vh;
`;

const Message = styled.div`
  margin: 1.5rem 0 0 0;

  & * {
    font-size: 18px;
  }
`;
