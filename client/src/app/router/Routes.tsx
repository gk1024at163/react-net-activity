import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import ActivityDtailPage from "../../features/activities/detail/ActivityDtailPage";
import CounterPage from "../../features/counter/CounterPage";
import TestErrors from "../../features/errors/TestErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "activities", element: <ActivityDashboard /> },
            { path: "activities/:id", element: <ActivityDtailPage /> },
            { path: "createActivity", element: <ActivityForm key='create' /> },
            { path: "manageActivity/:id", element: <ActivityForm key='manage' /> },
            { path: 'counter', element: <CounterPage /> },
            { path: "errors", element: <TestErrors /> },
            { path: "not-found", element: <NotFound /> },
            { path: "server-error", element: <ServerError /> },
            { path: "*", element: <Navigate replace to="/not-found" /> }
        ]
    },
]);