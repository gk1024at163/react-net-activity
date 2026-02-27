import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";

// 定义创建活动时的数据类型（不包含id和isCancelled）
//type CreateActivityData = Omit<Activity, 'id' | 'isCancelled'>;

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
        select: (data) => {
            return data.map(activity => {
                return {
                    ...activity,
                    isHost: currentUser.id === activity.hostId,
                    isGoing: activity.attendees.some(a => a.id === currentUser.id)
                }
            })
        }
    });
    //使用 React Query 的 useQuery 钩子获取单个活动数据（可选）
    const { data: activity, isLoading: isLoadingActivity } = useQuery({
        queryKey: ['activities', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data;
        },
        enabled: !!id && !!currentUser,// 仅当提供了 id 并且登录了 时才启用此查询
        select: (data) => {
            return {
                ...data,
                isHost: data.hostId === currentUser.id,
                isGoing: data.attendees.some(a => a.id === currentUser.id)
            }
        },
        refetchOnWindowFocus: false, // 默认值为 true  窗口聚焦时自动刷新数据
    });

    //使用 React Query 的 useMutation 钩子进行数据变更操作（可选）

    //新增活动
    const createActivity = useMutation({
        mutationFn: async (activity: Omit<Activity, 'id' | 'isCancelled'>) => {
            const response = await agent.post<Activity>(`/activities`, activity);
            return response.data;//返回新创建的活动数据id
        },
        onSuccess: () => {
            // 刷新活动列表数据
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        }
    });

    //更新活动
    const updateActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            return await agent.put<void>(`/activities/${activity.id}`, activity); // ✅ 修复：添加活动ID到URL
        },
        onSuccess: () => {
            // 刷新活动列表数据和详情数据
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
    //参加活动
    const updateAttendance = useMutation({
        mutationFn: async (id: string) => {
            await agent.post(`/activities/${id}/attend`);
        },
        onMutate: async (activityId: string) => {
            await queryClient.cancelQueries({ queryKey: ["activities", activityId] });

            const prevActivity = queryClient.getQueryData<Activity>([
                "activities",
                activityId,
            ]);

            queryClient.setQueryData<Activity>(
                ["activities", activityId],
                (oldActivity) => {
                    if (!oldActivity || !currentUser) {
                        return oldActivity;
                    }

                    const isHost = oldActivity.hostId === currentUser.id;
                    const isAttending = oldActivity.attendees.some(
                        (x) => x.id === currentUser.id
                    );

                    return {
                        ...oldActivity,
                        isCancelled: isHost
                            ? !oldActivity.isCancelled
                            : oldActivity.isCancelled,
                        attendees: isAttending
                            ? isHost
                                ? oldActivity.attendees
                                : oldActivity.attendees.filter((x) => x.id !== currentUser.id)
                            : [
                                ...oldActivity.attendees,
                                {
                                    id: currentUser.id,
                                    displayName: currentUser.displayName,
                                    imageUrl: currentUser.imageUrl,
                                },
                            ],
                    };
                }
            );
            return { prevActivity };
        },
        onError: (_error, activityId, context) => {
            if (context?.prevActivity) {
                queryClient.setQueryData(
                    ["activities", activityId],
                    context.prevActivity
                );
            }
        },
    });


    //钩子中返回数据
    return {
        activities, isLoading, updateActivity, createActivity, deleteActivity
        , activity, isLoadingActivity, updateAttendance
    };
};