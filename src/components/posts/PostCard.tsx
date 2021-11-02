import React, { FC } from "react";
import NextLink from "next/link";
import {
  Box,
  Heading,
  Text,
  BoxProps,
  Link,
  Flex,
  Button,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import VoteBox from "./VoteBox";
import { useDeletePost } from "@hooks/useDeletePost";

interface Props extends BoxProps {
  postId: number;
  title: string;
  slug: string;
  snippet: string;
  authorUsername: string;
  points: number;
  voteStatus: number | null;
  isOwnPost: boolean;
}

const PostCard: FC<Props> = ({
  postId,
  title,
  snippet,
  slug,
  points,
  authorUsername,
  voteStatus,
  isOwnPost,
  ...rest
}) => {
  const { handleDeletePost } = useDeletePost();
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      width="100%"
      maxWidth="100%"
      boxShadow="base"
      rounded="md"
      {...rest}
    >
      <Flex justify="space-between" align="center" mb="25px">
        <Box flex="1">
          <Heading fontSize="md" colorScheme="gray">
            {title}
          </Heading>
          <Text fontSize="13px">
            posted by{" "}
            <Text as="span" fontStyle="italic" fontWeight={500}>
              {authorUsername}
            </Text>
          </Text>
        </Box>
        {isOwnPost && (
          <Flex style={{ gap: "10px" }} alignSelf="flex-start">
            <Button
              p="5px"
              h="25px"
              as="a"
              href={`/posts/edit?postId=${postId}`}
            >
              <EditIcon height="15px" />
            </Button>
            <Button
              colorScheme="red"
              p="2px"
              h="25px"
              onClick={() => handleDeletePost(postId)}
            >
              <DeleteIcon height="15px" />
            </Button>
          </Flex>
        )}
      </Flex>
      <Flex
        justify="space-between"
        align="center"
        style={{ gap: "10px" }}
        wrap={{ base: "wrap", sm: "nowrap" }}
      >
        <Text mt={4} colorScheme="gray">
          {snippet}{" "}
          <NextLink href={{ pathname: "/posts/[slug]", query: { slug } }}>
            <Link fontWeight={500} _hover={{ textDecoration: "underline" }}>
              Read more
            </Link>
          </NextLink>
        </Text>
        <VoteBox postId={postId} points={points} voteStatus={voteStatus} />
      </Flex>
    </Box>
  );
};

export default PostCard;
