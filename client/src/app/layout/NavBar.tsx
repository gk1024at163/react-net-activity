import { Group } from "@mui/icons-material";
import { AppBar, Box, Toolbar, Typography, Container, MenuItem } from "@mui/material";
import MenuItemLink from "../shared/components/MenuItemLink";
export default function NavBar() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{
          backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
        }
        }>
          <Container maxWidth="xl">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <MenuItemLink to='/'>
                  <Group fontSize="large" />
                  <Typography variant="h4" fontWeight='bold'>Reactivities</Typography>
                </MenuItemLink>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <MenuItemLink to='/activities'>Activities</MenuItemLink>
                <MenuItemLink to='/createActivity'>Create Activity</MenuItemLink>
              </Box>
              <MenuItem>
                User menu
              </MenuItem>
            </Toolbar>
          </Container>
        </AppBar>
      </Box >
    </>
  )
}