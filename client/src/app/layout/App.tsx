import { Box, Container, CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";//1.引入NavBar组件
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";


function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  useEffect(() => {
    axios
      .get("https://localhost:5001/api/activities")
      .then((response) => setActivities(response.data));
  }, []);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  const handleCancelSelectActivity = () => {
    setSelectedActivity(null);
  }

  return (
    <Box sx={{ backgroundColor: '#eeeeee' }}>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <ActivityDashboard activities={activities}
          selectedActivity={selectedActivity}
          handleSelectActivity={handleSelectActivity}
          handleCancelSelectActivity={handleCancelSelectActivity} />
      </Container>

    </Box>
  );
}
export default App;
