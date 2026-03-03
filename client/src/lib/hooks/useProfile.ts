import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useMemo } from "react";
import type { EditProfileSchema } from "../schemas/editProfileSchema";

export const useProfile = (id?: string) => {
    const queryClient = useQueryClient();
    const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await agent.get<Profile>(`/profiles/${id}`);
            return response.data;
        },
        enabled: !!id, // 仅当提供了 id 时才启用此查询
    });


    //获取照片
    const { data: photos, isLoading: loadingPhotos } = useQuery<Photo[]>({
        queryKey: ["photos", id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
            return response.data;
        },
        enabled: !!id,
    });

    // 上传照片
    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData(); // 创建一个 FormData 对象，用于构建 multipart/form-data 请求体 上传图片比较这样
            formData.append("file", file); //"file" 是后端接收文件的字段名称，file 是要上传的 Blob 对象
            const response = await agent.post(
                "/profiles/add-photo",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            return response.data;
        },
        onSuccess: async (photo: Photo) => {//API返回的就是Photo 类型对象
            // 1. 成功上传照片后，首先调用 queryClient.invalidateQueries 来使与用户照片相关的查询失效。这将触发这些查询重新获取数据，从而确保 UI 显示最新的照片列表。
            await queryClient.invalidateQueries({
                queryKey: ["photos", id],
            });
            //2. 如果上传的照片是用户的主照片（即 profile.imageUrl 为空），则更新查询缓存中的用户数据和个人资料数据，以反映新的主照片 URL。
            // 这是通过调用 queryClient.setQueryData 来实现的，分别更新了 ["currentUser"] 和 ["profile", id] 查询的数据。
            queryClient.setQueryData(["currentUser"], (data: User) => {
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url,
                };
            });
            queryClient.setQueryData(["profile", id], (data: Profile) => {
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url,
                };
            });
        },
    });

    // const setMainPhoto = useMutation({
    //     mutationFn: async (photo: Photo) => {
    //         await agent.put(`/profiles/${photo.id}/setMain`);
    //     },
    //     onMutate: async (photo: Photo) => {
    //         await queryClient.cancelQueries({ queryKey: ["user"] });
    //         await queryClient.cancelQueries({ queryKey: ["profile", id] });

    //         const previousUser = queryClient.getQueryData<User>(["user"]);
    //         const previousProfile = queryClient.getQueryData<Profile>([
    //             "profile",
    //             id,
    //         ]);

    //         queryClient.setQueryData<User>(["user"], (userData) => {
    //             if (!userData) return userData;
    //             return {
    //                 ...userData,
    //                 imageUrl: photo.url,
    //             };
    //         });

    //         queryClient.setQueryData<Profile>(["profile", id], (profile) => {
    //             if (!profile) return profile;
    //             return {
    //                 ...profile,
    //                 imageUrl: photo.url,
    //             };
    //         });

    //         return { previousUser, previousProfile };
    //     },
    //     onError: (_err, _photo, context) => {
    //         if (context?.previousUser) {
    //             queryClient.setQueryData(["user"], context.previousUser);
    //         }
    //         if (context?.previousProfile) {
    //             queryClient.setQueryData(["profile", id], context.previousProfile);
    //         }
    //     },
    // });
    const setMainPhoto = useMutation({
        mutationFn: async (photo: Photo) => {
            await agent.put(`/profiles/${photo.id}/setMain`);
        },
        onSuccess: (_, photo: Photo) => {

            queryClient.setQueryData<User>(["currentUser"], (userData) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    imageUrl: photo.url,
                };
            });
            queryClient.setQueryData<Profile>(["profile", id], (profile) => {
                if (!profile) return profile;
                return {
                    ...profile,
                    imageUrl: photo.url,
                };
            });
        }
    });
    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await agent.delete(`/profiles/${photoId}/photos`);
        },
        onSuccess: (_, photoId) =>
            // 成功删除照片后，调用 queryClient.setQueryData 来更新查询缓存中的照片列表，过滤掉已删除的照片。
            queryClient.setQueryData(["photos", id], (photos: Photo[]) => {
                return photos?.filter((x) => x.id !== photoId);
            }),
    });

    const updateProfile = useMutation({
        mutationFn: async (profile: EditProfileSchema) => {
            await agent.put("/profiles/", profile);
        },
        onSuccess: (_, profile) => {
            queryClient.setQueryData(["profile", id], (data: Profile) => {
                if (!data) return data;
                return {
                    ...data,
                    displayName: profile.displayName,
                    bio: profile.bio,
                };
            });
            queryClient.setQueryData(["currentUser"], (userData: User) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    displayName: profile.displayName,
                };
            });
        },
    });


    // 判断是否是当前用户
    const isCurrentUser = useMemo(() => {
        // 从查询缓存中获取当前用户的信息 与 profile 的 id 进行比较
        return id === queryClient.getQueryData<User>(["currentUser"])?.id;
    }, [id, queryClient]);


    return {
        profile, loadingProfile, photos,
        loadingPhotos, isCurrentUser,
        uploadPhoto,
        setMainPhoto,
        deletePhoto,
        updateProfile
    };
}