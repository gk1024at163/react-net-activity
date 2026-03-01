using API.Middleware;
using Application.Activities;
using Application.Activities.Queries;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Infrastructure.Security;
using Infrastructure.Photos;

var builder = WebApplication.CreateBuilder(args);

// 向容器中注册服务
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
//通过 AddDbContext 注册 ActivityDbContext 服务,并且有数据库配置
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// 注册服务时定义命名策略
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("https://localhost:3000", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();//允许发送cookie，解决跨端跨域
    });
});
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.WriteIndented = true; // 启用缩进格式
});
builder.Services.AddMediatR(x =>
{
    x.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();
    x.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

builder.Services.AddScoped<IUserAccessor, UserAccessor>();
builder.Services.AddScoped<IPhotoService, PhotoService>();

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfiles>();
});
builder.Services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();//注册 FluentValidation 验证器
builder.Services.AddTransient<ExceptionMiddleware>();//注册自定义异常处理中间件,瞬时服务意味着需要时创建一个新的实例，异常处理后就释放
//1. 注册身份验证服务
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>();

//2. 注册授权服务，并添加自定义的授权策略
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("IsActivityHost", policy =>
    {
        policy.Requirements.Add(new IsHostRequirement());
    });
});
//3. 注册自定义的授权处理程序,只需要短暂坚持即可，因为它不需要维护任何状态，每次授权时都会创建一个新的实例
builder.Services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
//注册 CloudinarySettings 配置类，并从 appsettings.json 中绑定配置
builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings"));

var app = builder.Build();

//异常处理中间件必须放到最顶部
app.UseMiddleware<API.Middleware.ExceptionMiddleware>();

//配置跨域的中间件，位置要在 MapControllers 之前，
// 在中间件管道中引用该策略
app.UseCors("ReactApp"); // 必须在 UseRouting 之后（如果显式使用）
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
//2. 使用身份认证中间件，一定要在MapControllers之前
app.UseAuthentication();//认证（先认证）
app.UseAuthorization();//授权（才授权）
app.MapControllers(); //负责路由

//3. 映射api认证端点
app.MapGroup("api").MapIdentityApi<User>();

// 初始化数据库
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<AppDbContext>();//获取数据库上下文
    var userManager = services.GetRequiredService<UserManager<User>>();//获取用户管理器
    await context.Database.MigrateAsync(); //应用所有挂起的迁移,数据库不存在则创建数据库
    await DbInitializer.SeedData(context, userManager); //调用种子数据方法
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
}

app.Run();
