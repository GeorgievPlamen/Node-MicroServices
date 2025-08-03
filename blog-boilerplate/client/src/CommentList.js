import axios from "axios";
import { useState, useEffect } from "react";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  async function fetchData() {
    const result = await axios.get(
      `http://localhost:4001/posts/${postId}/comments`
    );

    setComments(result.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
}
