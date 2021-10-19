import { Formik, Form } from "formik";
import { Button, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Wrapper } from "@components/Wrapper";
import InputField from "@components/forms/InputField";
import Layout from "@components/layout";
import { useCreatePostMutation } from "@generated/graphql";
import { generateErrorMap } from "@utils/generateErrorMap";
import { useIsAuth } from "hooks/useIsAuth";

const initValues = {
  title: "",
  text: "",
};

const CreatePost = () => {
  const [, createPost] = useCreatePostMutation();
  const { loading, isAuthenticated } = useIsAuth();

  const router = useRouter();

  if (loading)
    return (
      <Layout>
        <Box mt={4} textAlign="center">
          Loading...
        </Box>
      </Layout>
    );

  if (!isAuthenticated)
    return (
      <Layout>
        <Box mt={4} textAlign="center">
          Not authenticated. Redirecting you to login...
        </Box>
      </Layout>
    );

  return (
    <Layout>
      <Wrapper variant="medium">
        <Formik
          initialValues={initValues}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await createPost({ input: values });
            const res = data?.createPost;

            if (res?.status === "fail" || res?.status === "error") {
              if (res?.errors) {
                const errorObj = generateErrorMap(res.errors);
                setErrors(errorObj);
              }

              if (res.message) {
                alert(res.message);
              }
            } else {
              router.push("/posts");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="title"
                placeholder="Enter post title"
                label="Title"
              />
              <InputField
                name="text"
                placeholder="What's on your mind?"
                label="Body"
                textarea
                rows={4}
              />
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default CreatePost;