using System;
using Application.Profiles.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

public interface IPhotoService
{
    Task<PhotoUploadResult?> AddPhotoAsync(IFormFile file);
    Task<string> DeletePhotoAsync(string publicId);
}
