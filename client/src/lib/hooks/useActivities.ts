import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";

// 定义创建活动时的数据类型（不包含id和isCancelled）
type CreateActivityData = Omit<Activity, 'id' | 'isCancelled'>;

export const useActivities = (id?: string) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const { currentUser } = useAccount();

    //使用 React Query 的 useQuery 钩子获取活动数据
    const { data: activities, isLoading } = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
            const response = await agent.get<Activity[]>('/activities');
            return response.data;
        },
        enabled: !id && location.pathname === '/activities' && !!currentUser,
    });
    //使用 React Query 的 useQuery 钩子获取单个活动数据（可选）
    const { data: activity, isLoading: isLoadingActivity } = useQuery({
        queryKey: ['activity', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data;
        },
        enabled: !!id && !!currentUser,// 仅当提供了 id 并且登录了 时才启用此查询
    });

    //使用 React Query 的 useMutation 钩子进行数据变更操作（可选）
    const updateActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            await agent.put<Activity>(`/activities`, activity);
        },
        onSuccess: () => {
            // 刷新活动列表数据
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        }
    });
    //新增活动
    const createActivity = useMutation({
        mutationFn: async (activity: CreateActivityData) => {
            const response = await agent.post<Activity>(`/activities`, activity);
            return response.data;//返回新创建的活动数据id
        },
        onSuccess: () => {
            // 刷新活动列表数据
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        }
    });
    //删除活动
    const deleteActivity = useMutation({
        mutationFn: async (id: string) => {
            await agent.delete(`/activities/${id}`);
        },
        onSuccess: () => {
            // 刷新活动列表数据
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        }
    });
    //钩子中返回数据
    return {
        activities, isLoading, updateActivity, createActivity, deleteActivity
        , activity, isLoadingActivity
    };
};