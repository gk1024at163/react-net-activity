import { Grid2 } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDtail from "../detail/ActivityDtail";
// 定义要接收的属性的类型
type Props = {
    activities: Activity[];
}
export default function ActivityDashboard({ activities }: Props) {
    return (
        <Grid2 container spacing={3}>
            <Grid2 size={7}>
                <ActivityList activities={activities} />
            </Grid2>
            <Grid2 size={5}>
                {activities[0] && <ActivityDtail activity={activities[0]} />}
            </Grid2>
        </Grid2>
    )
}