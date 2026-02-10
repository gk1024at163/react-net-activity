import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { DateTimePicker, type DateTimePickerProps } from "@mui/x-date-pickers";

type Props<T extends FieldValues = FieldValues> = UseControllerProps<T> & DateTimePickerProps;

export default function DateTimeInput<T extends FieldValues>(props: Props<T>) {
  const { field, fieldState } = useController({ ...props });
  
  // 处理字符串和 Date 对象两种情况
  const handleChange = (date: Date | null) => {
    if (date === null) {
      field.onChange('');
    } else {
      // 转换为 ISO 字符串格式，以便与 schema 匹配
      field.onChange(date.toISOString());
    }
  };

  return (
    <DateTimePicker
      {...props}  //组件的所有属性
      value={field.value ? new Date(field.value) : null}
      onChange={handleChange}
      sx={{ width: "100%" }}
      slotProps={{  //表现的像个文本字段
        textField: {
          onBlur: field.onBlur,
          error: !!fieldState.error,
          helperText: fieldState.error?.message,
        },
      }}
    />
  );
}