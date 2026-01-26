import { Box, Button, Paper, TextField, Typography } from "@mui/material";

type Props = {
  activity?: Activity;
  closeForm: () => void;
}
export default function ActivityForm({ activity, closeForm }: Props) {
  return (
    <Paper sx={{ padding: 3, borderRadius: 3 }}>
      <Typography variant="h5" color="primary" gutterBottom>Create activity</Typography>
      <Box component='form' display='flex' flexDirection='column' gap={2}>
        {/* 表单内容待添加 */}
        <TextField label='Title' value={activity?.title} />
        <TextField label='Description' multiline rows={3} value={activity?.description} />
        <TextField label='Category' value={activity?.category} />
        <TextField label='Date' type="date" value={activity?.date} />
        <TextField label='City' value={activity?.city} />
        <TextField label='Venue' value={activity?.venue} />
        <Box display='flex' justifyContent='end' gap={3}>
          <Button variant='contained' color='inherit' onClick={closeForm}>Cancel</Button>
          <Button variant='contained' color='success'>Submit</Button>
        </Box>
      </Box>
    </Paper>
  )
}