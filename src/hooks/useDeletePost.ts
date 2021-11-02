import { LIMIT } from "@data-layer/constants";
import {
  useDeletePostMutation,
  PostsQuery,
  PostsDocument,
} from "@generated/graphql";
import { isErrorStatus } from "@utils/isErrorStatus";
import { useRouter } from "next/router";

export const useDeletePost = () => {
  const [deletePost] = useDeletePostMutation({
    update(cache, { data }) {
      const postsQuery = cache.readQuery<PostsQuery>({
        query: PostsDocument,
        variables: { limit: LIMIT, cursor: null },
      });

      if (!isErrorStatus(data?.deletePost.status!)) {
        cache.writeQuery({
          query: PostsDocument,
          variables: { limit: LIMIT, cursor: null },
          data: {
            ...postsQuery,
            posts: {
              ...postsQuery?.posts,
              posts: postsQuery?.posts.posts!.filter(
                (p) => p.id !== data?.deletePost?.post!.id
              ),
            },
          },
        });
      }
    },
  });
  const router = useRouter();

  const handleDeletePost = async (postId: number) => {
    const approved = confirm("Are you sure you want to delete this post?");

    if (approved) {
      const { data } = await deletePost({ variables: { id: postId } });
      const res = data?.deletePost;

      if (isErrorStatus(res?.status!)) {
        alert(res?.message);
      } else {
        router.replace("/posts");
      }
    }
  };

  return { handleDeletePost };
};
