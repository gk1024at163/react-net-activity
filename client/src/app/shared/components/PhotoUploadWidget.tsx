import { CloudUpload } from "@mui/icons-material";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from 'react-dropzone'
import Cropper, { type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type Props = {
    uploadPhoto: (file: Blob) => void;
    loading: boolean;
}
export default function PhotoUploadWidget({ uploadPhoto, loading }: Props) {
    // 存储用户选择的文件
    const [files, setFiles] = useState<object & { preview: string }[]>([]);
    const cropperRef = useRef<ReactCropperElement>(null);// 存储裁剪后的图片这样要使用 cropper Ref 进行访问

    // 组件卸载时清理预览 URL，释放内存资源
    useEffect(() => {
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        //1. 拖拽文件后存储文件并生成预览 URL，以便在 UI 中显示预览图像
        setFiles(
            acceptedFiles.map((file) =>
                Object.assign(file,
                    { preview: URL.createObjectURL(file as Blob) }
                )
            )
        );

    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    //裁剪图片
    const onCrop = useCallback(() => {
        //获得裁剪后的图片数据，并调用 uploadPhoto 函数将其上传到服务器。
        // 通过 cropperRef.current?.cropper 获取 Cropper 实例，然后使用 getCroppedCanvas().toBlob() 方法将裁剪后的图像转换为 Blob 对象，最后调用 uploadPhoto(blob) 将其上传。
        const cropper = cropperRef.current?.cropper;
        cropper?.getCroppedCanvas().toBlob((blob) => {
            uploadPhoto(blob as Blob);
        });
    }, [uploadPhoto]);


    return (
        <Grid2 container spacing={3}>
            {/* 拖拽区域 */}
            <Grid2 size={4} >
                <Typography variant="overline" color="secondary">Setp1 - Add Photo</Typography>
                <Box {...getRootProps()}
                    sx={{
                        border: "3px dashed #eee",
                        borderColor: isDragActive ? "green" : "#eee",
                        borderRadius: "5px",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                        height: '280px'
                    }}
                >
                    <input {...getInputProps()} />
                    {/* 图标 */}
                    <CloudUpload sx={{ fontSize: 80, color: "#ccc" }} />
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                    }
                </Box>
            </Grid2>
            {/* 裁剪区域 */}
            <Grid2 size={4}>
                <Typography variant="overline" color="secondary">Setp2 - Resize Photo</Typography>
                {/* 2.显示裁剪区域，用户可以调整裁剪框以选择照片的特定部分。裁剪工具会提供一个预览窗口，显示裁剪后的效果。 */}
                {files[0]?.preview && (
                    <Cropper
                        src={files[0]?.preview}
                        style={{ height: 300, width: "90%" }}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        preview=".img-preview"
                        guides={false}
                        viewMode={1}
                        background={false}
                        ref={cropperRef}
                    />
                )}
            </Grid2>
            {/* 预览上传区域 */}
            <Grid2 size={4}>
                {/* 3. 预览上传区域：在用户调整裁剪框后，显示一个预览窗口，展示裁剪后的照片效果。用户可以在此预览窗口中确认照片的外观，并提供一个上传按钮，允许用户将裁剪后的照片上传到服务器 */}
                {files[0]?.preview && (
                    <>
                        <Typography variant="overline" color="secondary">
                            Step 3 - Preview & upload
                        </Typography>
                        <div
                            className="img-preview"
                            style={{ width: 300, height: 300, overflow: "hidden" }}
                        />
                        <Button
                            sx={{ my: 1, width: 300 }}
                            variant="contained"
                            color="secondary"
                            onClick={onCrop}
                            disabled={loading}
                        >
                            Upload
                        </Button>
                    </>
                )}
            </Grid2>
        </Grid2>

    )
}