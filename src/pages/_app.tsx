import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

import theme from "../theme";
import { client } from "@data-layer/createClient";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: false,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
