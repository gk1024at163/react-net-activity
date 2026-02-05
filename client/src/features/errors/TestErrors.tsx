import { Alert, Button, ButtonGroup, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import agent from "../../lib/api/agent.ts";
import { useState } from "react";

export default function TestErrors() {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    //使用useMutation来处理错误请求,useMutation是中间态管理库react-query提供的hook
    const { mutate } = useMutation({
        mutationFn: async ({
            path,
            method = "get",
        }: {
            path: string;
            method: string;
        }) => {
            if (method === "post") await agent.post(path, {});
            else await agent.get(path);
        },
        onError: (err) => {
            if (Array.isArray(err)) {
                setValidationErrors(err);
            } else {
                setValidationErrors([]);
            }
        },
    });

    const handleError = (path: string, method = "get") => {
        mutate({ path, method });
    };

    return (
        <>
            <Typography variant="h4">Test errors component</Typography>

            <ButtonGroup variant="contained" sx={{ mt: 4 }}>
                <Button onClick={() => handleError("buggy/not-found")}>
                    Not found
                </Button>
                <Button onClick={() => handleError("buggy/bad-request")}>
                    Bad request
                </Button>
                <Button onClick={() => handleError("activities", "post")}>
                    Validation error
                </Button>
                <Button onClick={() => handleError("buggy/server-error")}>
                    Server error
                </Button>
                <Button onClick={() => handleError("buggy/unauthorised")}>
                    Unauthorised
                </Button>
            </ButtonGroup>
            {/* 显示验证错误： */}
            {validationErrors.map((err, i) => (
                <Alert key={i} severity="error">
                    {err}
                </Alert>
            ))}
        </>
    );
}
