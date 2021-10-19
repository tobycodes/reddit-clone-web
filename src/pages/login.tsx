import { Formik, Form } from "formik";
import { Button, Link, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";

import { Wrapper } from "@components/Wrapper";
import Layout from "@components/layout";
import InputField from "@components/forms/InputField";
import { useLoginMutation } from "@generated/graphql";
import { generateErrorMap } from "@utils/generateErrorMap";
import useQueryParams from "hooks/useQueryParams";

const initValues = { usernameOrEmail: "", password: "" };

const LoginPage = () => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  const redirectUrl = useQueryParams("redirect");

  return (
    <Layout>
      <Wrapper variant="regular">
        <Formik
          initialValues={initValues}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await login({ input: { ...values } });

            if (data?.login.errors) {
              const errorObj = generateErrorMap(data.login.errors);
              setErrors(errorObj);
            } else if (data?.login.user) {
              router.push((redirectUrl as string) || "/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="username or email"
                label="Username or Email"
              />
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <Button
                type="submit"
                colorScheme="teal"
                mb={4}
                isLoading={isSubmitting}
              >
                Log In
              </Button>

              <Text>
                Forgot Password?{" "}
                <NextLink href="/forgot-password">
                  <Link mr={4} fontWeight={500}>
                    Click here
                  </Link>
                </NextLink>
              </Text>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default LoginPage;
