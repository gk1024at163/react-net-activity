import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";

export default function ActivityForm() {
  const { id } = useParams();
  const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);
  const navigate = useNavigate();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();//阻止表单默认提交行为,会刷新页面
    // 提交表单逻辑待添加
    const formData = new FormData(event.currentTarget);

    const data: { [key: string]: FormDataEntryValue } = {};
    formData.forEach((value, key) => {
      data[key] = value; //key是TextField的name属性值，value是用户输入的值
    })

    if (activity) { // 更新活动
      data.id = activity.id;
      await updateActivity.mutateAsync(data as unknown as Activity);
      navigate(`/activities/${activity.id}`);
    } else { // 创建新活动
      await createActivity.mutateAsync(data as unknown as Activity);
    }
  }
  if (isLoadingActivity) return <Typography>Loading activity...</Typography>
  return (
    <Paper sx={{ padding: 3, borderRadius: 3 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        {activity ? "Edit activity" : "Create activity"}
      </Typography>
      <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection='column' gap={2}>
        {/* 表单内容待添加 */}
        <TextField name='title' label='Title' defaultValue={activity?.title} />
        <TextField name='description' label='Description' multiline rows={3} defaultValue={activity?.description} />
        <TextField name='category' label='Category' defaultValue={activity?.category} />
        <TextField name='date' label='Date' type="date"
          defaultValue={activity?.date
            ? new Date(activity.date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
          } />
        <TextField name='city' label='City' defaultValue={activity?.city} />
        <TextField name='venue' label='Venue' defaultValue={activity?.venue} />
        <Box display='flex' justifyContent='end' gap={3}>
          <Button variant='contained' color='inherit' onClick={() => { }}>Cancel</Button>
          <Button
            variant='contained'
            color='success' type="submit"
            disabled={updateActivity.isPending || createActivity.isPending}>Submit</Button>
        </Box>
      </Box>
    </Paper>
  )
}