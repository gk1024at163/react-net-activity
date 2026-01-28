import { Grid2 } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDtail from "../detail/ActivityDtail";
import ActivityForm from "../form/ActivityForm";
// 定义要接收的属性的类型
type Props = {
    activities: Activity[];
    cancelSelectActivity: () => void;
    selectActivity: (id: string) => void;
    selectedActivity?: Activity;
    openForm: (id: string) => void;
    closeForm: () => void;
    editMode: boolean;
}
export default function ActivityDashboard({ activities, cancelSelectActivity, selectActivity
    , selectedActivity, openForm, closeForm, editMode }: Props) {
    return (
        <Grid2 container spacing={3}>
            <Grid2 size={7}>
                <ActivityList activities={activities} selectActivity={selectActivity}
                />
            </Grid2>
            <Grid2 size={5}>
                {selectedActivity && !editMode &&
                    <ActivityDtail
                        selectedActivity={selectedActivity}
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm}

                    />
                }
                {editMode &&
                    <ActivityForm
                        activity={selectedActivity} closeForm={closeForm} />}
            </Grid2>
        </Grid2>
    )
}