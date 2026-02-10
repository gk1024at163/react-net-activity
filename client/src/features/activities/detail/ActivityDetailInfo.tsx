import { CalendarToday, Info, Place } from "@mui/icons-material";
import { Box, Button, Divider, Grid2, Paper, Typography } from "@mui/material";
import { formatDate } from "../../../lib/util/util";
import type { Activity } from "../../../lib/types";
import { useState } from "react";
import MapComponent from "../../../app/shared/MapComponent";
type Props = {
    activity: Activity;
};
export default function ActivityDetailsInfo({ activity }: Props) {
    //本地状态记录地图是否已经打开
    const [mapOpen, setMapOpen] = useState(false);
    return (
        <Paper sx={{ mb: 2 }}>

            <Grid2 container alignItems="center" pl={2} py={1}>
                <Grid2 size={1}>
                    <Info color="info" fontSize="large" />
                </Grid2>
                <Grid2 size={11}>
                    <Typography>{activity.description}</Typography>
                </Grid2>
            </Grid2>
            <Divider />
            <Grid2 container alignItems="center" pl={2} py={1}>
                <Grid2 size={1}>
                    <CalendarToday color="info" fontSize="large" />
                </Grid2>
                <Grid2 size={11}>
                    <Typography>
                        {formatDate(activity.date)}
                    </Typography>
                </Grid2>
            </Grid2>
            <Divider />

            <Grid2 container alignItems="center" pl={2} py={1}>
                <Grid2 size={1}>
                    <Place color="info" fontSize="large" />
                </Grid2>
                <Grid2 size={11} display="flex"
                    justifyContent="space-between"
                    alignItems="center">
                    <Typography>
                        {activity.venue}, {activity.city}
                    </Typography>
                    {/* 打开或关闭地图 */}
                    <Button
                        sx={{ whiteSpace: "nowrap", mx: 2 }}
                        onClick={() => setMapOpen(!mapOpen)}
                    >
                        {mapOpen ? "Hide Map" : "Show map"}
                    </Button>
                </Grid2>
            </Grid2>
            {mapOpen && (
                <Box sx={{ height: 400, zIndex: 1000, display: "block" }}>
                    <MapComponent
                        position={[activity.latitude, activity.longitude]}
                        venue={activity.venue}
                    />
                </Box>
            )}
        </Paper>
    )
}