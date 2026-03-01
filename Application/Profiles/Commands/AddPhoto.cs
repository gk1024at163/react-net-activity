using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Profiles.Commands;

public class AddPhoto
{
    /// <summary>
    /// Command类，表示添加照片的命令
    /// 参数是IFormFile类型，表示上传的文件
    /// 返回值是Result<Photo>类型，表示操作的结果，包含上传成功后的照片信息
    /// </summary>
    public class Command : IRequest<Result<Photo>>
    {
        public required IFormFile File { get; set; }
    }

    /// <summary>
    /// 命令处理程序，负责处理AddPhoto.Command命令
    /// 实现IRequestHandler接口，指定处理的命令类型和返回结果类型
    /// 
    /// </summary>
    public class Handler(
        IUserAccessor userAccessor,
        AppDbContext context,
        IPhotoService photoService) : IRequestHandler<Command, Result<Photo>>
    {
        public async Task<Result<Photo>> Handle(Command request
                , CancellationToken cancellationToken)
        {
            var uploadResult = await photoService.AddPhotoAsync(request.File);
            if (uploadResult == null)
            {
                return Result<Photo>.Failure("Failed to upload photo.", 400);
            }
            //获取当前用户
            var user = await userAccessor.GetUserAsync();
            var photo = new Photo
            {
                Url = uploadResult.Url,
                PublicId = uploadResult.PublicId,
                UserId = user.Id
            };

            user.ImageUrl ??= uploadResult.Url;
            context.Photos.Add(photo); //存图片

            var success = await context.SaveChangesAsync(cancellationToken) > 0;
            return (success)
                ? Result<Photo>.Success(photo)
                : Result<Photo>.Failure("Failed to add photo to database.", 400);
        }
    }
}
