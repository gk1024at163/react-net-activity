import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "../../lib/hooks/useAccount"
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { useForm } from "react-hook-form";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";


export default function LoginForm() {
    const { loginUser } = useAccount();
    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema),
    });
    //处理提交的函数
    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data);
    }
    return (
        <Paper
            component='form'
            sx={{
                padding: 2, display: 'flex', flexDirection: 'column', gap: 3, p: 3,
                maxWidth: 'md', mx: 'auto', borderRadius: 3
            }}
            onSubmit={handleSubmit(onSubmit)}>
            <Box display='flex' alignItems='center' justifyContent='center' gap={3} color='secondary.main'>
                <LockOpen fontSize='large' />
                <Typography variant='h4'>Sign in</Typography>
            </Box>
            <TextInput label='Email' control={control} name="email" />
            <TextInput label='Password' control={control} name="password" type="password" />
            <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                variant="contained"
                size="large"
            >
                Login
            </Button>
        </Paper >
    )
}