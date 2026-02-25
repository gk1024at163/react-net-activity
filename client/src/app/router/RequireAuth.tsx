import { Typography } from "@mui/material";
import { useAccount } from "../../lib/hooks/useAccount";
import { Navigate, Outlet, useLocation } from "react-router";
export default function RequireAuth() {
    const { currentUser, isLodingUserInfo } = useAccount();
    const location = useLocation();
    if (isLodingUserInfo) return (<Typography>Loding...</Typography>);
    if (!currentUser) return (<Navigate to="/login" state={{ from: location }} />)
    return (
        <Outlet />
    )
}