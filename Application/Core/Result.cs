using System;

namespace Application.Core;

public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T? Value { get; set; }
    public string? Error { get; set; }
    public int Code { get; set; }
    /// <summary>
    /// 创建一个成功的结果
    /// </summary>
    /// <param name="value"></param>
    /// <returns></returns>
    public static Result<T> Success(T value)
    {
        return new Result<T> { IsSuccess = true, Value = value, Code = 200 };
    }
    /// <summary>
    /// 创建一个失败的结果
    /// </summary>
    /// <param name="error"></param>
    /// <param name="code"></param>
    /// <returns></returns>
    public static Result<T> Failure(string error, int code)
    {
        return new Result<T> { IsSuccess = false, Error = error, Code = code };
    }
}
