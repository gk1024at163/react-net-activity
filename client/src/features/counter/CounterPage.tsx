import { Box, Button, ButtonGroup, List, ListItemText, Typography, Paper } from "@mui/material";
import { useStore } from "../../lib/hooks/useStore";
import { observer } from "mobx-react-lite";
const Counter = observer(
    function CounterPage() {
        const { counterStore } = useStore();
        return (
            <Box display='flex' justifyContent='space-between'>
                <Box width='50%'>
                    <Typography variant="h4">{counterStore.title}</Typography>
                    <Typography variant="h5">The count is: {counterStore.count}</Typography>
                    <ButtonGroup sx={{ mt: 3 }}>
                        <Button onClick={() => counterStore.increment()} variant="contained" color="success">increment +1</Button>
                        <Button onClick={() => counterStore.decrement()} variant="contained" color="error">decrement -1</Button>
                        <Button onClick={() => counterStore.increment(5)} variant="contained" color="primary">increment +5</Button>
                        <Button onClick={() => counterStore.clearEvents()} variant="contained" color="warning">clear events</Button>
                    </ButtonGroup>
                </Box>

                <Paper sx={{ width: '50%', p: 2 }}>
                    <Typography variant="h6">Event Log (Total: {counterStore.eventCount})</Typography>
                    <List>
                        {counterStore.events.map((event, index) => (
                            <ListItemText key={index} >{event}</ListItemText>
                        ))}
                    </List>
                </Paper>
            </Box >
        )
    }
)
export default Counter;