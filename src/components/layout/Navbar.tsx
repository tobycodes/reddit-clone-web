import NextLink from "next/link";
import {
  Flex,
  Link,
  Text,
  Button,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { LightMode } from "@chakra-ui/color-mode";

import { DarkModeSwitch } from "@components/DarkModeSwitch";
import { useLogoutMutation, useMeQuery } from "@generated/graphql";
import isServer from "@utils/isServer";

const Navbar = () => {
  const [{ fetching: fetchingUser, data }] = useMeQuery({ pause: isServer() });
  const [{ fetching: loggingOut }, logout] = useLogoutMutation();

  const bgColor = useColorModeValue("teal.500", "teal.200");
  const color = useColorModeValue("white", "gray.900");

  return (
    <Flex
      position="sticky"
      top={0}
      zIndex={1}
      bg={bgColor}
      color={color}
      p={5}
      mb={2}
      justifyContent="space-between"
    >
      <NextLink href="/">
        <Heading fontSize="2xl" letterSpacing="wider">
          <Link ml={4}>RedLab</Link>
        </Heading>
      </NextLink>

      <Flex align="center">
        {fetchingUser || loggingOut ? null : data?.me.user ? (
          <>
            <Text as="span" mr={6}>
              hello,{" "}
              <Text as="span" fontWeight={600}>
                {data?.me.user?.username}
              </Text>
            </Text>
            <NextLink href="/profile">
              <Link ml={4} fontWeight={500}>
                profile
              </Link>
            </NextLink>
            <NextLink href="/posts/create">
              <Link ml={4} fontWeight={500}>
                create post
              </Link>
            </NextLink>
            <LightMode>
              <Button
                mx={4}
                fontWeight={500}
                variant="link"
                colorScheme="orange"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </LightMode>
          </>
        ) : (
          <>
            <NextLink href="/login">
              <Link mr={4} fontWeight={500}>
                login
              </Link>
            </NextLink>
            <NextLink href="/register">
              <Link mr={4} fontWeight={500}>
                register
              </Link>
            </NextLink>
          </>
        )}
        <DarkModeSwitch />
      </Flex>
    </Flex>
  );
};

export default Navbar;
