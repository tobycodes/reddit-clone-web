import React from "react";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import { Button } from "@chakra-ui/button";
import InputField from "@components/forms/InputField";
import Layout from "@components/layout";
import { Wrapper } from "@components/Wrapper";
import { useChangePasswordMutation } from "@generated/graphql";
import { generateErrorMap } from "@utils/generateErrorMap";

const initValues = { newPassword: "", confirmPassword: "" };

const ChangePassword = () => {
  const router = useRouter();

  const [, changePassword] = useChangePasswordMutation();

  return (
    <Layout>
      <Wrapper variant="regular">
        <Formik
          initialValues={initValues}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await changePassword({
              input: { ...values, token: router.query.token as string },
            });

            const result = data?.changePassword;

            if (result?.status === "error") {
              if (result?.errors) {
                setErrors(generateErrorMap(result.errors));
              }

              if (result.message) {
                return alert(result.message);
              }
            }

            if (result?.user) {
              return router.replace("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                label="New Password"
              />
              <InputField
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                label="Confirm Password"
              />
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default ChangePassword;
