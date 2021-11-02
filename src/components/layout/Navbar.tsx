import NextLink from "next/link";
import {
  Flex,
  Link,
  Text,
  Button,
  Heading,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { LightMode } from "@chakra-ui/color-mode";

import { DarkModeSwitch } from "@components/DarkModeSwitch";
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from "@generated/graphql";
import isServer from "@utils/isServer";
import { isErrorStatus } from "@utils/isErrorStatus";
import { useRouter } from "next/router";

const Navbar = () => {
  const { loading: fetchingUser, data } = useMeQuery({ ssr: isServer() });
  const router = useRouter();
  const [logout, { loading: loggingOut }] = useLogoutMutation({
    update(cache, { data }) {
      const meQuery = cache.readQuery<MeQuery>({ query: MeDocument });

      if (!isErrorStatus(data?.logout.status!)) {
        cache.writeQuery({
          query: MeDocument,
          data: { ...meQuery, me: { ...meQuery?.me, user: null } },
        });
      }
    },
  });

  const handleLogout = async () => {
    const { data } = await logout();

    if (!isErrorStatus(data?.logout.status!)) {
      router.push("/login");
    }
  };

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
            <Button mx={4} as="a" colorScheme="pink" href="/posts/create">
              create post
            </Button>
            <Box ml={6}>
              <Text as="span" mr={4}>
                hello,{" "}
                <Text as="span" fontWeight={600}>
                  {data?.me.user?.username}
                </Text>
              </Text>
              <LightMode>
                <Button
                  mx={4}
                  fontWeight={500}
                  variant="link"
                  colorScheme="orange"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </LightMode>
            </Box>
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
