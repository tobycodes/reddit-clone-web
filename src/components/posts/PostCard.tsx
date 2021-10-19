import React, { FC } from "react";
import NextLink from "next/link";
import { Box, Heading, Text, BoxProps, Link, Flex } from "@chakra-ui/layout";
import VoteBox from "./VoteBox";

interface Props extends BoxProps {
  postId: number;
  title: string;
  slug: string;
  snippet: string;
  authorUsername: string;
  points: number;
  voteStatus: number | null;
}

const PostCard: FC<Props> = ({
  postId,
  title,
  snippet,
  slug,
  points,
  authorUsername,
  voteStatus,
  ...rest
}) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      width="700px"
      maxWidth="100%"
      boxShadow="base"
      rounded="md"
      {...rest}
    >
      <Heading fontSize="md" colorScheme="gray">
        {title}
      </Heading>
      <Text fontSize="13px">
        posted by{" "}
        <Text as="span" fontStyle="italic" fontWeight={500}>
          {authorUsername}
        </Text>
      </Text>
      <Flex
        justify="space-between"
        align="center"
        style={{ gap: "10px" }}
        wrap={{ base: "wrap", sm: "nowrap" }}
      >
        <Text mt={4} colorScheme="gray">
          {snippet}{" "}
          <NextLink href={`/posts/${slug}`}>
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
