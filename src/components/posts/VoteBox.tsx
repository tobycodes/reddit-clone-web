import { FC, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useVoteMutation } from "@generated/graphql";
import { isErrorStatus } from "@utils/isErrorStatus";

type VoteLoadingState = "upvote" | "downvote" | "none";

interface Props {
  postId: number;
  points: number;
  voteStatus: number | null;
}

const VoteBox: FC<Props> = ({ postId, points, voteStatus }) => {
  const [, vote] = useVoteMutation();
  const [loading, setLoading] = useState<VoteLoadingState>("none");

  const isUpvoted = voteStatus === 1;
  const isDownvoted = voteStatus === -1;

  const handleVote = async (value: number) => {
    const loadingState =
      value === 1 ? "upvote" : value === -1 ? "downvote" : "none";

    setLoading(loadingState);

    const { data } = await vote({ postId, value });
    const res = data?.vote;

    if (isErrorStatus(res?.status!)) {
      if (res?.message) {
        alert(res.message);
      }
    }

    setLoading("none");
  };

  return (
    <Flex
      style={{ gap: "10px" }}
      wrap="wrap"
      justify={{ sm: "flex-end" }}
      align="center"
      flexBasis="45%"
    >
      <Button
        onClick={() => handleVote(1)}
        colorScheme="teal"
        isLoading={loading === "upvote"}
        disabled={isUpvoted}
      >
        <ChevronUpIcon aria-label="upvote" size="24px" />
      </Button>
      <Text mx={1}>{points}</Text>
      <Button
        onClick={() => handleVote(-1)}
        isLoading={loading === "downvote"}
        disabled={isDownvoted}
      >
        <ChevronDownIcon aria-label="downvote" size="24px" />
      </Button>
    </Flex>
  );
};

export default VoteBox;
