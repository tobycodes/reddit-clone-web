import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { Button, Text, Flex } from "@chakra-ui/react";

import InputField from "@components/forms/InputField";
import Layout from "@components/layout";
import { Wrapper } from "@components/Wrapper";
import { useForgotPasswordMutation } from "@generated/graphql";

const initValues = { email: "" };

const ChangePassword = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [message, setMessage] = useState("");
  const router = useRouter();

  return (
    <Layout>
      <Wrapper variant="regular">
        <Formik
          initialValues={initValues}
          onSubmit={async (values, { setFieldError }) => {
            const { data } = await forgotPassword(values);

            const result = data?.forgotPassword;

            if (result?.status === "error") {
              setFieldError("email", result.message as string);
            } else if (result?.status === "success") {
              setMessage(result?.message as string);
            }
          }}
        >
          {({ isSubmitting }) =>
            message ? (
              <Flex flexDirection="column" alignItems="center">
                <Text fontSize={20} marginTop={10} marginBottom={8}>
                  {message}
                </Text>
                <Button
                  colorScheme="teal"
                  margin="0 auto"
                  onClick={() => router.replace("/login")}
                >
                  Go to login
                </Button>
              </Flex>
            ) : (
              <Form>
                <InputField
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  label="Email Address"
                />
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                >
                  Reset Password
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default ChangePassword;
