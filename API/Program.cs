using API;
using API.Hubs;
using API.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Configure services
ConfigureServices(builder.Services);

// Build and configure the app
var app = builder.Build();
ConfigureApp(app);

app.Run();

void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy(name: "CorsPolicy",
            builder => builder
                .WithOrigins("http://localhost:4200") 
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()); 
    });

    services.AddSignalR();
    services.AddControllers();
    services.AddSingleton<IUserConnectionManager, UserConnectionManager>();

    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen();
}

void ConfigureApp(WebApplication app)
{
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseCors("CorsPolicy");
    app.MapHub<ChatHub>("/chat");
    app.MapControllers();
}