import { TextField, type TextFieldProps } from "@mui/material";
import { useController, type UseControllerProps, type FieldValues } from "react-hook-form";

// 定义 Props 类型，支持泛型
type Props<T extends FieldValues = FieldValues> = UseControllerProps<T> & TextFieldProps;

// 组件定义
export default function TextInput<T extends FieldValues = FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController(props);
    return (
        <TextField
            {...field}
            {...props}
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    );
}