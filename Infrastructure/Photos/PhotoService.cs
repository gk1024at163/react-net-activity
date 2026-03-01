
using Application.Interfaces;
using Application.Profiles.DTOs;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        //从配置文件中读取Cloudinary的配置信息
        var cloudinaryConfig = config.Value;
        var account = new Account(
            cloudinaryConfig.CloudName,
            cloudinaryConfig.ApiKey,
            cloudinaryConfig.ApiSecret
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<PhotoUploadResult?> AddPhotoAsync(IFormFile file)
    {
        //收到了文件才进行处理
        if (file == null || file.Length <= 0)
        {
            return null;
        }
        await using var stream = file.OpenReadStream();//文件读到内存中
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            //对图片进行裁剪，裁剪成500*500的正方形，裁剪方式为填充，重心为人脸
            // Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
            Folder = "Reactivities2026" //指定上传到Cloudinary的哪个文件夹下
        };
        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        if (uploadResult.Error != null)
            throw new Exception(uploadResult.Error.Message);

        return new PhotoUploadResult
        {
            Url = uploadResult.SecureUrl.ToString(),
            PublicId = uploadResult.PublicId
        };
    }

    public async Task<string> DeletePhotoAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParams);
        if (result.Error != null)
            throw new Exception(result.Error.Message);
        return result.Result;
    }
}
