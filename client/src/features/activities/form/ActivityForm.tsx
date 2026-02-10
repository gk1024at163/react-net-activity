import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useForm, type Resolver } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, type ActivitySchema, } from "../../../lib/schemas/activitySchema";
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import { type Activity } from "../../../lib/types";

import { categoryOptions } from "./CategoryOptions";
import LocationInput from "../../../app/shared/components/LocationInput";

export default function ActivityForm() {
  const { control, reset, handleSubmit } = useForm<ActivitySchema>({
    mode: "onTouched",
    resolver: zodResolver(activitySchema) as Resolver<ActivitySchema>,
    defaultValues: {
      title: "",
      description: "",
      category: "",
      date: new Date(Date.now() + 3600000), // 设置为1小时后，确保满足"未来时间"验证
    },
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateActivity, createActivity, activity, isLoadingActivity } =
    useActivities(id);

  useEffect(() => {
    // 当活动数据更新时，将数据填充到表单中
    if (activity)
      reset({
        ...activity,
        date: activity.date ? new Date(activity.date) : undefined,
        location: {
          city: activity.city,
          venue: activity.venue,
          latitude: activity.latitude,
          longitude: activity.longitude,
        },
      });
  }, [activity, reset]);

  //提交表单
  const onSubmit = async (data: ActivitySchema) => {
    const { location, ...rest } = data; // ...rest表示其余属性 location的所有属性会解构到 location 对象中
    const flattenedData = { ...rest, ...location };//扁平结构对象

    // 创建活动时的数据类型（不包含id和isCancelled）
    type CreateActivityData = Omit<Activity, 'id' | 'isCancelled'>;

    try {
      if (activity) {//修改
        updateActivity.mutate(
          { ...activity, ...flattenedData },
          {
            onSuccess: () => navigate(`/activities/${activity.id}`),
          }
        );
      } else {//创建，但这里没有id属性isCancelled，需要调整 createActvity 逻辑
        createActivity.mutate(flattenedData as CreateActivityData, {
          onSuccess: (id) => navigate(`/activities/${id}`),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoadingActivity) return <Typography>Loading activity...</Typography>

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {activity ? "Edit Activity" : "Create Activity"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <TextInput label="Title" control={control} name="title" />
        <TextInput
          label="Description"
          control={control}
          name="description"
          multiline
          rows={3}
        />
        <Box display="flex" gap={3}>
          <SelectInput
            items={categoryOptions}
            label="Category"
            control={control}
            name="category"
          />
          <DateTimeInput label="Date" control={control} name="date" />
        </Box>
        <LocationInput
          control={control}
          label="Enter the location"
          name="location"
        />
        <Box display="flex" justifyContent="end" gap={3}>
          <Button color="inherit">Cancel</Button>
          <Button
            type="submit"
            color="success"
            variant="contained"
            disabled={updateActivity.isPending || createActivity.isPending}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}