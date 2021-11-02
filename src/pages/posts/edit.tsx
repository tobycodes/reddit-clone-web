import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button, Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Wrapper } from "@components/Wrapper";
import InputField from "@components/forms/InputField";
import Layout from "@components/layout";
import { usePostQuery, useUpdatePostMutation } from "@generated/graphql";
import { generateErrorMap } from "@utils/generateErrorMap";
import { useIsAuth } from "@hooks/useIsAuth";
import { isErrorStatus } from "@utils/isErrorStatus";
import useQueryParams from "@hooks/useQueryParams";

const EditPost = () => {
  const { loading, isAuthenticated } = useIsAuth();
  const postId = useQueryParams("postId") as string;

  const {
    data,
    loading: loadingPost,
    error,
  } = usePostQuery({ variables: { id: +postId } });
  const [updatePost] = useUpdatePostMutation();
  const [initValues, setInitValues] = useState({
    title: "",
    text: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (data && data.post && data.post.post) {
      const { title, text } = data.post.post;

      setInitValues({ title, text });
    }
  }, [data]);

  if (loading || loadingPost)
    return (
      <Layout>
        <Box mt={4} textAlign="center">
          <Text>Loading...</Text>
        </Box>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <Box mt={4} textAlign="center">
          <Text>
            Sorry, there was an error fetching posts. Please refresh the page.
          </Text>
        </Box>
      </Layout>
    );

  if (!isAuthenticated)
    return (
      <Layout>
        <Box mt={4} textAlign="center">
          <Text>Not authenticated. Redirecting you to login...</Text>
        </Box>
      </Layout>
    );

  return (
    <Layout>
      <Wrapper variant="medium">
        <Formik
          initialValues={initValues}
          enableReinitialize
          onSubmit={async (values, { setErrors }) => {
            const { data } = await updatePost({
              variables: { input: values, id: +postId },
            });
            const res = data?.updatePost;

            if (isErrorStatus(res?.status!)) {
              if (res?.errors) {
                const errorObj = generateErrorMap(res.errors);
                setErrors(errorObj);
              }

              if (res?.message) {
                alert(res.message);
              }
            } else {
              router.push(`/posts/${res?.post?.slug}`);
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
                Update
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default EditPost;
