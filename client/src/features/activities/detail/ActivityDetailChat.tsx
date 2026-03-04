import { Box, Typography, Card, CardContent, TextField, Avatar } from "@mui/material";
import { Link, useParams } from "react-router";
import { useComments } from "../../../lib/hooks/useComments";
import { timeAgo } from "../../../lib/util/util";
import { useForm, type FieldValues } from "react-hook-form";
import { observer } from "mobx-react-lite";

const ActivityDetailsChat = observer(function ActivityDetailsChat() {
    const { id } = useParams();
    //使用到useComments 就会自动创建中心连接并监听 LoadComments 和 ReceiveComment 事件，获取评论列表并实时更新
    const { commentStroe } = useComments(id);
    const { register, handleSubmit, reset } = useForm();

    //提交评论
    const addComment = async (data: FieldValues) => {
        try {
            //调用中心连接的 SendComment 方法，参数是一个对象，包含 activityId 和 body 属性，分别是活动 ID 和评论内容
            await commentStroe.hubConnection?.invoke('SendComment',
                {
                    activityId: id, body: data.body
                });
            reset();//清空输入框
        } catch (error) {
            console.log(error);
        }
    }
    //监听键盘事件，Enter 提交，Shift + Enter 换行
    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            handleSubmit(addComment)();
        } else if (event.key === 'Enter' && event.shiftKey) {
            // 换行
            event.preventDefault();
            const textarea = event.currentTarget;
            textarea.innerHTML += '\n';
        }
    }
    return (
        <>
            <Box
                sx={{
                    textAlign: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    padding: 2
                }}
            >
                <Typography variant="h6">Chat about this event</Typography>
            </Box>
            <Card>
                <CardContent>
                    <div>
                        <form>
                            <TextField
                                {...register('body', { required: 'Comment body is required' })}
                                onKeyDown={handleKeyPress}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Enter your comment (Enter to submit, SHIFT + Enter for new line)"

                            />
                        </form>
                    </div>
                    {/* 评论列表 */}
                    <Box sx={{ height: 300, overflow: 'auto', mt: 2 }}>
                        {commentStroe.comments.map(comment => (

                            <Box key={comment.id} sx={{ display: 'flex', my: 2 }}>
                                <Avatar src={comment.imageUrl} alt={'user image'} sx={{ mr: 2 }} />
                                <Box display='flex' flexDirection='column'>
                                    <Box display='flex' alignItems='center' gap={3}>
                                        <Typography component={Link}
                                            to={`/profiles/${comment.userId}`}
                                            variant="subtitle1"
                                            sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                                            {comment.displayName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {timeAgo(comment.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Typography>
                                </Box>
                            </Box>))}
                    </Box>
                </CardContent>
            </Card>
        </>
    )
})
export default ActivityDetailsChat;