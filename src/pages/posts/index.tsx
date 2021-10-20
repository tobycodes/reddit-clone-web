import { useState, useEffect } from "react";
import NextLink from "next/link";
import {
  Stack,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import Layout from "@components/layout";
import PostCard from "@components/posts/PostCard";
import { PostsQueryVariables, usePostsQuery } from "@generated/graphql";
import { LIMIT } from "@data-layer/constants";

type Cursor = string | null;

type PageProps = {
  variables: PostsQueryVariables;
  isLastPage: boolean;
  onLoadMore: (cursor: Cursor) => void;
};

const Posts = ({ variables, isLastPage, onLoadMore }: PageProps) => {
  const { data, error, loading } = usePostsQuery({ variables });
  const [cursor, setCursor] = useState<Cursor>(null);

  useEffect(() => {
    if (data && data.posts) {
      setCursor(data.posts.cursor);
    }
  }, [data]);

  if (error)
    return (
      <Text textAlign="center">
        Sorry, there was an error fetching posts. Please refresh the page.
      </Text>
    );

  return (
    <Box>
      <Stack spacing={8} align="center">
        {data &&
          data?.posts &&
          data?.posts.posts?.map((p) => {
            return (
              <PostCard
                key={p.id}
                postId={p.id}
                title={p.title}
                snippet={p.snippet}
                slug={p.slug}
                authorUsername={p.creator.username}
                points={p.points}
                voteStatus={p.voteStatus!}
              />
            );
          })}
      </Stack>
      <Flex justify="center" mt={4}>
        {(isLastPage && loading) || (isLastPage && data?.posts.hasMore) ? (
          <Button
            onClick={() => onLoadMore(cursor)}
            colorScheme="teal"
            isLoading={loading}
          >
            load more
          </Button>
        ) : null}
      </Flex>
    </Box>
  );
};

const PostsPage = () => {
  const [pageVariables, setPageVariables] = useState([
    { limit: LIMIT, cursor: null as Cursor },
  ]);

  const headingColor = useColorModeValue("teal.500", "teal.200");

  return (
    <Layout>
      <Flex justify="space-between" align="center" mb={5}>
        <Heading as="span" fontSize="xl" color={headingColor}>
          Latest posts
        </Heading>
        <NextLink href="/posts/create">
          <Link ml={4} fontWeight={500}>
            create post
          </Link>
        </NextLink>
      </Flex>
      {pageVariables.map((variables, i) => {
        return (
          <Posts
            key={variables.cursor || "null"}
            variables={variables}
            isLastPage={i === pageVariables.length - 1}
            onLoadMore={(cursor) =>
              setPageVariables([...pageVariables, { cursor, limit: LIMIT }])
            }
          />
        );
      })}
    </Layout>
  );
};

export default PostsPage;
