import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import ActivityDtail from "../../features/activities/detail/ActivityDtail";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "/activities", element: <ActivityDashboard /> },
            { path: "/activities/:id", element: <ActivityDtail /> },
            { path: "/createActivity", element: <ActivityForm key='create' /> },
            { path: "/manageActivity/:id", element: <ActivityForm key='manage' /> },
        ]
    },
]);