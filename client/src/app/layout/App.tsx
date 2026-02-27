import { Box, Container, CssBaseline } from "@mui/material";
import NavBar from "./NavBar";//1.引入NavBar组件
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import HomePage from "../../features/home/HomePage";

function App() {
  const location = useLocation();
  return (
    <Box sx={{ backgroundColor: '#eeeeee', minHeight: '100vh' }}>
      {/* 有效地恢复我们的滚动位置 */}
      <ScrollRestoration />
      <CssBaseline />
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Outlet />
          </Container>
        </>
      )}

    </Box>
  );
}
export default App;
