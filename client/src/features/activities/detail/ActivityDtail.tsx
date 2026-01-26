import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"

type Props = {
    activity: Activity;
    cancelSelectActivity: () => void;
    openForm: (id: string) => void;
}
export default function ActivityDtail({ activity, cancelSelectActivity, openForm }: Props) {
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

