import { Box, Button } from "@mui/material";
import TextInput from "../../../app/shared/components/TextInput";
import { useParams } from "react-router";
import { useProfile } from "../../../lib/hooks/useProfile";
import { useForm } from "react-hook-form";
import { editProfileSchema, type EditProfileSchema } from "../../../lib/schemas/editProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

type Props = {
    setEditMode: (editMode: boolean) => void;
}
export default function ProfileEditForm({ setEditMode }: Props) {
    const { id } = useParams();
    const { updateProfile, profile } = useProfile(id);
    //isDirty	表单是否有修改 isValid	表单是否通过验证
    const { control, handleSubmit, reset,
        formState: { isDirty, isValid } } = useForm<EditProfileSchema>({
            mode: 'onTouched',  // 验证触发时机：字段失去焦点时
            resolver: zodResolver(editProfileSchema),// Zod 验证器
            defaultValues: {    // 初始值
                displayName: profile?.displayName || '',
                bio: profile?.bio || ''
            }
        });

    const onSubmit = (data: EditProfileSchema) => {
        updateProfile.mutate(data, {
            onSuccess: () => setEditMode(false)
        });
    }

    // 当 profile 数据变化时，重置表单为最新数据
    useEffect(() => {
        reset({
            displayName: profile?.displayName,
            bio: profile?.bio || ''
        });
    }, [profile, reset]); // 依赖项：profile 变化或 reset 函数变化时触发

    return (
        <Box component='form' display='flex' flexDirection='column'
            mt={3} gap={3} alignContent='center'
            onSubmit={handleSubmit(onSubmit)}>
            <TextInput label='Display Name' name='displayName' control={control} />
            <TextInput
                label='Add your bio'
                name='bio'
                control={control}
                multiline
                rows={4}
            />
            <Button
                type='submit'
                variant='contained'
                disabled={!isDirty || !isValid || updateProfile.isPending}
            >
                Update profile
            </Button>
        </Box>
    )
}