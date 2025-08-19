import axios from "axios";
import { useState } from "react";

export default function useRequest({ url, method, body }) {
    const [errors, setErrors] = useState(null);

    async function doRequest() {
        try {
            const response = await axios[method](url, body);
            return response.data;
        } catch (error) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oops...</h4>
                    <ul className="my-0">
                        {error.response.data.errors.map((err) => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                        ;
                    </ul>
                </div>
            )
        }
    }

    return { doRequest, errors };
}