import React, { useState } from "react";
import axios from "axios";

export default function CommentCreate({ postId }) {
    const [content, setContent] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
            content
        })

        setContent("");
    }

    return <div>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="comment">New Comment</label>
                <input value={content} onChange={(e) => setContent(e.target.value)} name="comment" className="form-control" />
                <button className="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
}