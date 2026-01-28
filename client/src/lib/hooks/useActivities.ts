import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
export const useActivities = () => {

    const queryClient = useQueryClient();

    //使用 React Query 的 useQuery 钩子获取活动数据
    const { data: activities, isPending } = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
            const response = await agent.get<Activity[]>('/activities');
            return response.data;
        }
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
        mutationFn: async (activity: Activity) => {
            await agent.post<Activity>(`/activities`, activity);
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
    return { activities, isPending, updateActivity, createActivity, deleteActivity };
};