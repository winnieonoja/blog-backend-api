import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import { sendSuccess, sendError } from "../utils/response.js";

// CREATE COMMENT
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return sendError(res, 400, "Comment content is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
      return sendError(res, 404, "Post not found");
    }

    const comment = await Comment.create({
      content,
      author: req.userId,
      post: postId
    });

    await comment.populate("author", "userName profileImage");

    return sendSuccess(res,201,"Comment created successfully",comment);

  } catch (error) {
    console.error("Create comment error:", error);

    return sendError(
      res,
      500,
      "Failed to create comment",
      error.message
    );
  }
};

// GET ALL COMMENTS
export const getPostComments = async (req, res) => {
try {
  const{postId} = req.params;
  const post = await Post.findById(postId);
  if(!post){
    return sendError(
      res,
      404,
      "Post not found"
    )
  }

  const comments = await Comment.find({post:postId}).populate("author", "userName email profileImage").sort({createdAt: -1});

  const totalComment = comments.length;

  return sendSuccess(
    res,
    200,
    "Comments retrieved successfully",
    {
      totalComment,
      comments
    }
  )

}catch(error){
  console.error("Error getting post comments:", error);
  return sendError(
    res,
    500,
    "Fetching post comments error",
    error.message
  )
}
}


// UPDATE COMMENTS
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return sendError(res, 404, "Comment not found");
    }

  if (
  !comment.author ||
  comment.author.toString() !== req.userId.toString()
) {
  return sendError(
    res,
    403,
    "You can only update your own comments"
  );
}
console.log("Comment author:", comment?.author);
console.log("Logged-in user:", req.userId);


    if (!content || content.trim() === "") {
      return sendError(res, 400, "Comment content is required");
    }

    comment.content = content;

    const updatedComment = await comment.save();

    await updatedComment.populate(
      "author",
      "userName profileImage"
    );

    return sendSuccess(res,200,"Comment updated successfully",updatedComment);

  } catch (error) {
    console.error("Update comment error:", error);

    return sendError(
      res,
      500,
      "Failed to update comment",
      error.message
    );
  }
};

// DELETE POST
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return sendError(res, 404, "Comment not found");
    }

    const post = await Post.findById(comment.post);

    if (!post) {
      return sendError(res, 404, "Post not found");
    }

    const isCommentOwner =
      comment.author.toString() === req.userId.toString();

    const isPostOwner =
      post.author.toString() === req.userId.toString();

    const isAdmin = req.userRole === "admin";

    if (!isCommentOwner && !isPostOwner && !isAdmin) {
      return sendError( res, 403, "You do not have permission to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    return sendSuccess(
      res,
      200,
      "Comment deleted successfully"
    );

  } catch (error) {
    console.error("Delete comment error:", error);

    return sendError(
      res,
      500,
      "Failed to delete comment",
      error.message
    );
  }
};