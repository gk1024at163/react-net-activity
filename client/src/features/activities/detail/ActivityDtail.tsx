import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"

import { Link, useNavigate, useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";


export default function ActivityDtail() {
    const navigate = useNavigate();
    const { id } = useParams();//获取路由参数中的活动 ID
    const { activity, isLoadingActivity } = useActivities(id);
    if (isLoadingActivity) return <Typography>Loading Activity ... </Typography>;
    if (!activity) return <Typography>Activity not found</Typography>;

    return (
        <Card sx={{ borderRadius: 3 }}>
            {/* 分类图片 */}
            <CardMedia component='img' image={`/images/categoryImages/${activity.category}.jpg`} title={activity.category} />
            <CardContent>
                <Typography variant="h5">{activity.title}</Typography>
                <Typography variant="subtitle1" fontWeight='light'>{activity.date}</Typography>
                <Typography variant="body1">{activity.description}</Typography>
            </CardContent>
            <CardActions>
                <Button component={Link} to={`/manageActivity/${activity.id}`} color="primary" >Edit</Button>
                <Button color="inherit" onClick={() => navigate('/activities')}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

