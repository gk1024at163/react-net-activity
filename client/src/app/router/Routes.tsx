import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import CounterPage from "../../features/counter/CounterPage";
import TestErrors from "../../features/errors/TestErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/account/LoginForm";
import RequireAuth from "./RequireAuth";
import RegisterForm from "../../features/account/RegisterForm";
import ActivityDetailPage from "../../features/activities/detail/ActivityDetailPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            // 需要身份验证
            {
                element: <RequireAuth />, children: [
                    { path: "activities", element: <ActivityDashboard /> },
                    { path: "activities/:id", element: <ActivityDetailPage /> },
                    { path: "createActivity", element: <ActivityForm key='create' /> },
                    { path: "manage/:id", element: <ActivityForm key='manage' /> },
                ]
            },
            // 不需要身份验证
            { path: "", element: <HomePage /> },
            { path: 'counter', element: <CounterPage /> },
            { path: "errors", element: <TestErrors /> },
            { path: "not-found", element: <NotFound /> },
            { path: "server-error", element: <ServerError /> },
            { path: "login", element: <LoginForm /> },
            { path: "register", element: <RegisterForm /> },
            { path: "*", element: <Navigate replace to="/not-found" /> }
        ]
    },
]);