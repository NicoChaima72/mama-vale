import { Box, Button, Table, Text, TextInput, Title } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import moment from "moment";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { type ChangeEvent, useState } from "react";

type routerOutput = inferRouterOutputs<AppRouter>;

const Home: NextPage = () => {
  const [lastnameFilter, setLastnameFilter] = useState("");
  const [usersData, setUsersData] = useState<routerOutput["users"]["getAll"]>(
    []
  );
  const { data: users, isLoading: isUsersLoading } = api.users.getAll.useQuery(
    undefined,
    {
      onSuccess: (users: routerOutput["users"]["getAll"]) => {
        setUsersData(users);
      },
    }
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastnameFilter(e.target.value);
    console.log(e.target.value);
    if (users) {
      setUsersData(() =>
        users.filter(
          (user) =>
            user.lastNames.toLowerCase().indexOf(e.target.value.toLowerCase()) >
            -1
        )
      );
    }
  };
  return (
    <>
      <Head>
        <title>Usuarios</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={() => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <Title>Usuarios</Title>
        <Link href={"/create"}>
          <Button color="green">Agregar</Button>
        </Link>
      </Box>
      {isUsersLoading ? (
        <Text mt={"1rem"}>Cargando...</Text>
      ) : (
        <>
          <TextInput
            label="Buscar por apellido"
            mt={"1rem"}
            size="sm"
            value={lastnameFilter}
            onChange={handleInputChange}
          />
          <Table striped mt={"2rem"}>
            <thead>
              <tr>
                <th>RUT</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Número</th>
                <th>Email</th>
                <th>Cumpleaños</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.rut}>
                  <td>{user.rut}</td>
                  <td>{user.names}</td>
                  <td>{user.lastNames}</td>
                  <td>{user.address}</td>
                  <td>{user.city}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>
                    {moment(new Date(user.birthday as Date)).format(
                      "DD/MM/yyyy"
                    )}
                  </td>
                  <td>{user.civilStatus}</td>
                  <td>
                    <Link href={`/edit/${user.rut}`}>
                      <Button size="xs">Editar</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default Home;
