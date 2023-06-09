import { Box, Button, Select, TextInput, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

type FormValues = {
  rut: string;
  names: string;
  lastNames: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  birthday: Date;
  civilStatus: string;
};

export default function Edit() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      rut: "",
      names: "",
      lastNames: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      birthday: new Date(),
      civilStatus: "",
    },

    validate: {
      rut: (value) =>
        /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/.test(value)
          ? null
          : "Rut invalido",
      names: (value) =>
        value.length === 0
          ? "Campo requerido"
          : /^[a-zA-Z\s]*$/.test(value)
          ? null
          : "Nombres invalidos",
      lastNames: (value) =>
        value.length === 0
          ? "Campo requerido"
          : /^[a-zA-Z\s]*$/.test(value)
          ? null
          : "Apellidos invalidos",
      address: (value) => (value.length === 0 ? "Campo requerido" : null),
      city: (value) =>
        value.length === 0
          ? "Campo requerido"
          : /^[a-zA-Z\s]*$/.test(value)
          ? null
          : "Ciudad invalida",
      phone: (value) =>
        value.length === 0
          ? "Campo requerido"
          : /^\d{9}$/.test(value)
          ? null
          : "Número invalido",
      email: (value) =>
        value.length === 0
          ? "Campo requerido"
          : /^\S+@\S+$/.test(value)
          ? null
          : "Email invalido",
      // birthday: (value) => (value.length === 0 ? "Campo requerido" : null),
    },
  });

  const { data: user, isLoading: isUserLoading } = api.users.getOne.useQuery(
    {
      rut: router.query.rut as string,
    },
    {
      onSuccess: (user) => {
        if (user)
          form.setValues({
            rut: user.rut,
            names: user.names,
            lastNames: user.lastNames,
            address: user.address,
            city: user.city,
            phone: user.phone,
            email: user.email,
            birthday: new Date(user.birthday as Date),
            civilStatus: user.civilStatus,
          });
      },
    }
  );

  const { mutate: updateUser, isLoading: isUpdateUserLoading } =
    api.users.update.useMutation({
      onSuccess: async () => {
        notifications.show({
          title: "Usuario actualizado",
          message: "Se ha actualizado el usuario correctamente",
          color: "green",
        });
        await router.push("/");
      },
    });

  const handleSubmit = (values: FormValues) => {
    updateUser(values);
  };

  return (
    <>
      <Head>
        <title>Usuarios</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Title>Editar usuario</Title>
      {isUserLoading ? (
        <div>Cargando...</div>
      ) : !user ? (
        <div>No existe</div>
      ) : (
        <form
          style={{ marginTop: "1rem" }}
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
        >
          <TextInput
            error={true}
            label={"RUT"}
            disabled
            sx={() => ({ marginTop: "1rem" })}
            {...form.getInputProps("rut")}
          />
          <TextInput
            error="Invalid email"
            label={"Nombres"}
            withAsterisk
            sx={() => ({ marginTop: "1rem" })}
            {...form.getInputProps("names")}
          />
          <TextInput
            error="Invalid email"
            label={"Apellidos"}
            withAsterisk
            sx={() => ({ marginTop: "1rem" })}
            {...form.getInputProps("lastNames")}
          />
          <TextInput
            error="Invalid email"
            label={"Dirección"}
            withAsterisk
            sx={() => ({ marginTop: "1rem" })}
            {...form.getInputProps("address")}
          />
          <TextInput
            error="Invalid email"
            label={"Ciudad"}
            withAsterisk
            sx={() => ({ marginTop: "1rem" })}
            {...form.getInputProps("city")}
          />
          <TextInput
            error="Invalid email"
            label={"Número"}
            withAsterisk
            sx={() => ({ marginTop: "1rem" })}
            {...form.getInputProps("phone")}
          />
          <TextInput
            error="Invalid email"
            label={"Email"}
            withAsterisk
            sx={() => ({ marginTop: "1rem" })}
            {...form.getInputProps("email")}
          />
          <DateInput
            // value={birthday}
            // onChange={setBirthday}
            label="Date input"
            placeholder="Date input"
            withAsterisk
            sx={() => ({ marginTop: "1rem" })}
            {...form.getInputProps("birthday")}
          />
          <Select
            label="Estado civil"
            // value={civilStatus}
            // onChange={setCivilStatus}
            {...form.getInputProps("civilStatus")}
            withAsterisk
            sx={() => ({ marginTop: "1rem" })}
            data={[
              {
                value: "soltero",
                label: "Soltero",
              },
              {
                value: "casado",
                label: "Casado",
              },
              {
                value: "divorciado",
                label: "Divorciado",
              },
              {
                value: "viudo",
                label: "Viudo",
              },
            ]}
          />
          <Box
            sx={() => ({
              display: "flex",
              justifyContent: "end",
              marginTop: "1rem",
            })}
          >
            <Button type="submit" disabled={isUpdateUserLoading}>
              {isUpdateUserLoading ? "Actualizando..." : "Actualizar"}
            </Button>
          </Box>
        </form>
      )}
    </>
  );
}
