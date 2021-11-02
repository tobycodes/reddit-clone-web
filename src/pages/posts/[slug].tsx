import { FC } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Heading, Text, Button, Flex } from "@chakra-ui/react";

import { client } from "@data-layer/createClient";
import {
  Post,
  PostBySlugDocument,
  PostBySlugQuery,
  PostsDocument,
  PostsQuery,
  useMeQuery,
} from "@generated/graphql";
import { isErrorStatus } from "@utils/isErrorStatus";
import Layout from "@components/layout";
import { useDeletePost } from "@hooks/useDeletePost";

type PostType = Omit<Post, "deletedAt" | "updatedAt">;

interface Props {
  post: PostType;
}

const SinglePost: FC<Props> = ({ post }) => {
  const { data } = useMeQuery();
  const { handleDeletePost } = useDeletePost();

  return (
    <Layout>
      <Heading mb={2} fontSize="24px">
        {post.title}
      </Heading>
      <Text>{post.text}</Text>

      <Text mt={4}>
        posted by:{" "}
        <Text as="span" fontWeight={500}>
          {post.creator.username}
        </Text>
      </Text>

      {data && data.me && data.me.user && data.me.user.id === post.creatorId && (
        <Flex mt={4} style={{ gap: "20px" }}>
          <Button
            colorScheme="teal"
            as="a"
            href={`/posts/edit?postId=${post.id}`}
          >
            edit
          </Button>
          <Button colorScheme="red" onClick={() => handleDeletePost(post.id)}>
            delete
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  let posts: PostType[] = [];
  const { data } = await client.query<PostsQuery>({
    query: PostsDocument,
    variables: { limit: 50 },
  });

  if (!isErrorStatus(data.posts.status)) {
    posts = data.posts.posts!;
  }

  return {
    paths: posts.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  let post: PostType | {} = {};

  const { params } = ctx;
  const { data } = await client.query<PostBySlugQuery>({
    query: PostBySlugDocument,
    variables: { slug: params?.slug },
  });

  if (!isErrorStatus(data.postBySlug.status)) {
    post = data.postBySlug.post!;
  }

  return { props: { post }, revalidate: 60 };
};

export default SinglePost;
