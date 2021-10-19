import { FC } from "react";
import { Box, useColorMode, Container } from "@chakra-ui/react";

import Navbar from "./Navbar";

const Layout: FC = ({ children }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };

  return (
    <Box bg={bgColor[colorMode]} color={color[colorMode]} minH="100vh">
      <Navbar />
      <Container maxWidth="container.md" mt="40px" pb="40px" as="main">
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
