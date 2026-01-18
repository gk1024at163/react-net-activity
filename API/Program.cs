using Application.Activities.Queries;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// 向容器中注册服务
builder.Services.AddControllers();
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
              .AllowAnyMethod();
    });
});
builder.Services.AddMediatR(x =>
        x.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>());
// Ensure we call the overload that accepts assemblies by providing
// an explicit configuration action and the assembly to scan.
builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);

var app = builder.Build();

//配置跨域的中间件，位置要在 MapControllers 之前，
// 在中间件管道中引用该策略
app.UseCors("ReactApp"); // 必须在 UseRouting 之后（如果显式使用）
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers(); //负责路由

// 初始化数据库
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<AppDbContext>();//获取数据库上下文
    await context.Database.MigrateAsync(); //应用所有挂起的迁移,数据库不存在则创建数据库
    await DbInitializer.SeedData(context); //调用种子数据方法
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
}

app.Run();
