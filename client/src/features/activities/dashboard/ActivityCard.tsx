import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Divider, Typography } from "@mui/material";
import { Link } from "react-router";
import { AccessTime, Place } from "@mui/icons-material";
import { formatDate } from "../../../lib/util/util";
import ProfileCard from "../../profiles/ProfileCard";
import AvatarPopover from "../../../app/shared/components/AvatarPopover";

type Props = {
    activity: Activity;
}
export default function ActivityCard({ activity }: Props) {

    const label = activity.isHost ? 'You are hosting' : 'You are going'; //标签文本，待实现逻辑
    const color = activity.isHost ? 'secondary' : activity.isGoing ? 'warning' : 'default';

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
                            Host by{' '}<Link to={`/profile/${activity.hostId}`}>{activity.hostDisplayName}</Link>
                        </>
                    }
                />
                <Box display='flex' flexDirection='column' gap={2} mr={2}>
                    {(activity.isHost || activity.isGoing) && <Chip label={label} color={color} sx={{ borderRadius: 2 }} />}
                    {activity.isCancelled && <Chip label='Canceled' color='error' sx={{ borderRadius: 2 }} />}
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
                    {activity.attendees.map(attendee => (
                        <AvatarPopover key={attendee.id} profile={attendee} />
                    ))}
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