import { type AppType } from "next/app";

import { api } from "~/utils/api";

// import "~/styles/globals.css";
import { Box, Container, MantineProvider, Text } from "@mantine/core";
import Link from "next/link";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container>
        <Box>
          <Link href={"/"} style={{ textDecoration: "none", color: "black" }}>
            <Text size={'xl'} sx={() => ({ padding: '1rem 0' })}>Inicio</Text>
          </Link>
        </Box>
        <Component {...pageProps} />
      </Container>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
