import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginSchema } from "../schemas/loginSchema";
import agent from "../api/agent";
import { useLocation, useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";

export const useAccount = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    //用户登录
    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            const response = await agent.post('/login?useCookies=true', creds);
            return response.data;
        },
        // 登录成功后，刷新当前用户信息
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            //登录后导航到活动仪表板
            //naviagate('/activities');
        }
    });
    //用户登出
    const logoutUser = useMutation({
        mutationFn: async () => {
            await agent.post('/account/logout');
        },
        // 登出成功后，刷新当前用户信息
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['currentUser'] });
            queryClient.removeQueries({ queryKey: ["activities"] });//不同的钩子可以清空缓存
            //登出后导航到首页
            navigate('/');
        }
    });
    // 查询当前登录用户
    const { data: currentUser, isLoading: isLodingUserInfo } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await agent.get('/account/user-info');
            return response.data;
        },
        enabled: !queryClient.getQueryData(['currentUser'])
            && location.pathname !== '/login'
            && location.pathname !== '/register',//缓存中没有当前用户信息时才查询
    });
    //用户注册
    const registerUser = useMutation({
        mutationFn: async (creds: RegisterSchema) => {
            await agent.post("/account/register", creds);
        },
        onSuccess: () => {
            toast.success("Register successful - you can now login");
            navigate("/login");
        },
    });


    return { loginUser, logoutUser, currentUser, isLodingUserInfo, registerUser };
};