import { Formik, Form } from "formik";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Wrapper } from "@components/Wrapper";
import InputField from "@components/forms/InputField";
import Layout from "@components/layout";
import { useRegisterMutation } from "@generated/graphql";
import { generateErrorMap } from "@utils/generateErrorMap";

const initValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterPage = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Layout>
      <Wrapper variant="regular">
        <Formik
          initialValues={initValues}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await register({ input: { ...values } });
            const res = data?.register;

            if (res?.status === "fail" || res?.status === "error") {
              if (res?.errors) {
                const errorObj = generateErrorMap(res.errors);
                setErrors(errorObj);
              }

              if (res.message) {
                alert(res.message);
              }
            } else {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <InputField
                name="email"
                placeholder="email"
                type="email"
                label="Email"
              />
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <InputField
                name="confirmPassword"
                placeholder="repeat password"
                label="Repeat password"
                type="password"
              />
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default RegisterPage;
