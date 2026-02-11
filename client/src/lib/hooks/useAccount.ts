import { useMutation } from "@tanstack/react-query";
import type { LoginSchema } from "../schemas/loginSchema";
import agent from "../api/agent";

export const useAccount = () => {
    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            const response = await agent.post('/login?useCookies=true', creds);
            return response.data;
        }
    });
    return { loginUser };
};