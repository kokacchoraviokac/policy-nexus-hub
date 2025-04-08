
// Fix around line 107
const newCommentObj: Comment = {
  id: `comment-${Date.now()}`,
  document_id: document.id,
  content: newComment, // Use content field instead of text
  author: "Current User", // Kept for backward compatibility
  text: newComment, // Kept for backward compatibility
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: "current-user-id"
};
