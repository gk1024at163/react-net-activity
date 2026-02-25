import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "../../lib/hooks/useAccount"
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { useForm } from "react-hook-form";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { useNavigate, useLocation, Link } from "react-router";


export default function LoginForm() {
    const { loginUser } = useAccount();
    const navigate = useNavigate();
    const location = useLocation();

    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema),
    });
    //处理提交的函数
    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                console.log('Login successful');
                navigate(location.state?.from || '/activities');//登录成功后跳转到登录前的页面
            },
        });
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
            {/* 注册 */}
            <Box
                display="flex"
                sx={{ justifyContent: "center", alignItems: "center" }}
            >
                <Typography>Don't have an account?</Typography>
                <Typography
                    sx={{ ml: 2 }}
                    component={Link}
                    to="/register"
                    color="primary"
                >
                    Sign up
                </Typography>
            </Box>
        </Paper >
    )
}