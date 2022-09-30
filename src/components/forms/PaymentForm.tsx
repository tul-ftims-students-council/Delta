import { z } from 'zod';

import { createForm } from '@felte/solid';
import { Component, createSignal, ParentProps } from 'solid-js';
import { validator } from '@felte/validator-zod';
import { reporter } from '@felte/reporter-solid';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        'pliki w formacie .jpg, .jpeg, .png and .webp. są akceptowane',
      ),
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

const submitFormData = async ({ email, major, tShirtSize, diet, file, faculty, year }: FormSchema) => {
  const formData = new FormData();
  formData.append('Major', major);
  formData.append('Faculty', faculty);
  formData.append('Year', year.toString());
  formData.append('TShirtSize', tShirtSize);
  formData.append('Diet', diet);
  formData.append('PaymentFile', file);
  formData.append('FileExtension', file.type);
  formData.append('FootSize', '42');

  const response = await fetch(`http://127.0.0.1:10000/users/${email}/payment/send`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());

  return response;
};

const PaymentForm: Component<ParentProps> = ({ children }) => {
  const [message, setMessage] = createSignal('');
  const [isSuccess, setIsSuccess] = createSignal(false);
  const [isExisting, setIsExisting] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const { form, setData, data } = createForm<FormSchema>({
    extend: [validator({ schema: formSchema }), reporter()],
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

  const getUserDetails = async (email: string) => {
    const response = await fetch(`http://127.0.0.1:10000/users/${email}/`);

    if (response.status === 200) {
      const userData = userResponseSchema.parse(await response.json());
      setData('email', userData.email);
      setData('confirmEmail', userData.email);
      setData('name', userData.name);
      setData('surname', userData.surname);
      setData('phoneNumber', userData.phoneNumber);
      setIsExisting(true);
    }
  };

  return (
    <Container>
      <FormTitle>Płatności</FormTitle>
      <FormSubtitle>Wypełnij formularz, zrób przelew i zagwarantuj sobie miejsce na wyjeździe.</FormSubtitle>
      <MainContent>
        <InfoCards>
          <div>header</div>
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
              <a href="/oswiadczenie">Oświadczenie obozowe</a>
            </CardSubheaderBottom>
            <CardSubtitleBottom>Wypełniony dokument jest niezbędny do odprawy!</CardSubtitleBottom>

            <CardSubheaderBottom>wymiary koszulek</CardSubheaderBottom>
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
              <FileInput name="file" label="Dowód przelewu" />
            </Row>
            <SubmitButton isLoading={isLoading()}>{isLoading() ? <Loader size={40} /> : children}</SubmitButton>
            {message() ? <ServerMessage>{message()}</ServerMessage> : null}
          </form>
        </FormWrapper>
      </MainContent>
    </Container>
  );
};

export default PaymentForm;
