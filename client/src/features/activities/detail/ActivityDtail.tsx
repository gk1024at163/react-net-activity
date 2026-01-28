import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import { useActivities } from "../../../lib/hooks/useActivities";

type Props = {
    selectedActivity: Activity;
    cancelSelectActivity: () => void;
    openForm: (id: string) => void;
}
export default function ActivityDtail({ selectedActivity, cancelSelectActivity, openForm }: Props) {
    //获取活动数据
    const { activities } = useActivities();
    //根据 selectedActivity 的 id 查找对应的活动
    const activity = activities?.find(x => x.id === selectedActivity.id);
    if (!activity) return <Typography>Loading .... Activity not found</Typography>;

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
                <Button color="primary" onClick={() => openForm(activity.id)}>Edit</Button>
                <Button color="inherit" onClick={cancelSelectActivity}>Cancel</Button>
            </CardActions>
        </Card>
    )
}

