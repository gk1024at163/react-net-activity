import { Grid2, Typography } from "@mui/material"

import { useNavigate, useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityDetailHeader from "./ActivityDetailHeader";
import ActivityDetailInfo from "./ActivityDetailInfo";
import ActivityDtailChat from "./ActivityDtailChat";
import ActivityDetailSidebar from "./ActivityDetailSidebar";


export default function ActivityDtailPage() {
    const navigate = useNavigate();
    const { id } = useParams();//获取路由参数中的活动 ID
    const { activity, isLoadingActivity } = useActivities(id);
    if (isLoadingActivity) return <Typography>Loading Activity ... </Typography>;
    if (!activity) return <Typography>Activity not found</Typography>;

    return (
        <Grid2 container spacing={2}>
            <Grid2 size={8}>
                <ActivityDetailHeader activity={activity} />
                <ActivityDetailInfo activity={activity} />
                <ActivityDtailChat />
            </Grid2>
            <Grid2 size={4}><ActivityDetailSidebar /></Grid2>
        </Grid2>
    )
}

