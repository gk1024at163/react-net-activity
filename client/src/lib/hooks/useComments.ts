import { useLocalObservable } from "mobx-react-lite"
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr"
import { useEffect, useRef } from "react";
import { runInAction } from "mobx";
export const useComments = (activityId?: string) => {
    const created = useRef(false);
    const commentStroe = useLocalObservable(() => ({
        comments: [] as ChatComment[],
        hubConnection: null as HubConnection | null,

        //创建中心连接 普通函数表达式，确保 this 指向 observable 对象
        createHubConnection(activityId: string) {
            if (!activityId) return;
            // 此时 this 正确指向 commentStroe
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_COMMENTS_HUB_URL}?activityId=${activityId}`, {
                    withCredentials: true//添加cookie
                })
                .withAutomaticReconnect()
                .build();

            this.hubConnection.start().catch(error =>
                console.log('Error establishing the connection: ', error));

            //监听 LoadComments 事件，参数是 Result<CommentDto[]> 类型的 comments,并将其赋值给 MobX observable 对象的 comments 属性，UI 会自动更新
            this.hubConnection.on('LoadComments', (result: Result<ChatComment[]>) => {
                console.log('=== LoadComments ===');
                //从 Result<CommentDto[]> 中提取 value
                const comments = result.isSuccess ? result.value : [];
                console.log('Comments count:', comments.length);
                comments.forEach((c: ChatComment, idx: number) => {
                    console.log(`Comment ${idx}:`, {
                        id: c.id,
                        createdAt: c.createdAt,
                        createdAtType: typeof c.createdAt,
                        body: c.body?.substring(0, 20)
                    });
                });

                runInAction(() => { this.comments = comments; });
            });

            //监听 ReceiveComment 事件，参数是 Result<CommentDto> 类型的 comment
            this.hubConnection.on('ReceiveComment', (result: Result<ChatComment>) => {
                console.log('=== ReceiveComment ===');
                console.log('Raw result:', result);

                //从 Result<CommentDto> 中提取 value
                const comment = result.isSuccess ? result.value : null;

                if (!comment) {
                    console.error('Received null comment from server');
                    return;
                }

                console.log('Extracted comment:', comment);
                console.log('Comment properties:', {
                    id: comment.id,
                    createdAt: comment.createdAt,
                    body: comment.body,
                    userId: comment.userId,
                    displayName: comment.displayName
                });

                if (comment.createdAt) {
                    console.log('createdAt as Date:', new Date(comment.createdAt));
                    console.log('createdAt toString:', comment.createdAt.toString());
                }

                //添加评论到 MobX observable 列表中，使用 runInAction 确保在 MobX action 中修改 observable 对象的属性，UI 会自动更新
                runInAction(() => {
                    console.log('Adding comment to MobX store');
                    this.comments.unshift(comment);
                });
            });
        },        //停止中心连接
        stopHubConnection() {
            if (this.hubConnection?.state === HubConnectionState.Connected) {
                this.hubConnection.stop().catch(error =>
                    console.log('Error stopping the connection: ', error));
            }
        },
    }));

    useEffect(() => {
        if (activityId && !created.current) {
            commentStroe.createHubConnection(activityId); //组件加载时创建连接
            created.current = true;
        }

        return () => {
            commentStroe.stopHubConnection();//组件卸载时停止连接
            commentStroe.comments = []; //清空评论列表 Mobx observable 对象的属性直接修改即可触发更新
        }
    }, [activityId, commentStroe])

    return { commentStroe };
}