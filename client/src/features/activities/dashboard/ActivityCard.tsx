import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Divider, Typography } from "@mui/material";
import { Link } from "react-router";
import { AccessTime, Place } from "@mui/icons-material";
import { formatDate } from "../../../lib/util/util";

type Props = {
    activity: Activity;
}
export default function ActivityCard({ activity }: Props) {
    const isHost = true; //是否是活动的主持人，待实现逻辑
    const isGoing = false; //是否参加了活动，待实现逻辑
    const label = isHost ? 'You are hosting' : 'You are going'; //标签文本，待实现逻辑
    const color = isHost ? 'secondary' : isGoing ? 'warning' : 'default';
    const isCanceled = true; //活动是否被取消，待实现逻辑
    return (
        <Card elevation={3} sx={{
            borderRadius: 3
        }}>
            <Box display='flex' alignItems='center' justifyContent='space-between'>
                <CardHeader
                    avatar={<Avatar sx={{ height: 80, width: 80 }} />}
                    title={activity.title}
                    titleTypographyProps={{ fontWeight: 'bold', fontSize: 20 }}
                    subheader={
                        <>
                            Host by{' '}<Link to={`/profile/bob`}>Bob</Link>
                        </>
                    }
                />
                <Box display='flex' flexDirection='column' gap={2} mr={2}>
                    {(isHost || isGoing) && <Chip label={label} color={color} sx={{ borderRadius: 2 }} />}
                    {isCanceled && <Chip label='Canceled' color='error' sx={{ borderRadius: 2 }} />}
                </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <CardContent sx={{ p: 0 }}>
                <Box display='flex' alignItems='center' mb={2} px={2}>
                    <Box display='flex' alignItems='center' flexGrow={0}>
                        <AccessTime sx={{ mr: 1 }} />
                        <Typography variant="body2" noWrap>
                            {formatDate(activity.date)}
                        </Typography>
                    </Box>

                    <Place sx={{ ml: 3, mr: 1 }} />
                    <Typography variant="body2">{activity.venue}, {activity.city}</Typography>
                </Box>
                <Divider />
                <Box display='flex' gap={2} sx={{ backgroundColor: 'grey.200', py: 3, pl: 3 }}>
                    Attendess go here
                </Box>
            </CardContent>
            <CardContent sx={{ pb: 2 }}>
                <Typography variant="body2" >
                    {activity.description}
                </Typography>

                <Button component={Link}
                    to={`/activities/${activity.id}`}
                    variant="contained"
                    sx={{ display: 'flex', justifySelf: 'flex-end', borderRadius: 3 }}
                >View</Button>
            </CardContent>
        </ Card >
    )
}