import { Box, Container, CssBaseline } from "@mui/material";
import NavBar from "./NavBar";//1.引入NavBar组件
import { Outlet } from "react-router";

function App() {
  return (
    <Box sx={{ backgroundColor: '#eeeeee', minHeight: '100vh' }}>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
export default App;
