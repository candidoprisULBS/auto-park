using CarServiceAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Car Service API",
        Version = "v1",
        Description = "API for managing cars, drivers, driver alerts, and service entries"
    });
});

// Register services
builder.Services.AddScoped<ICarService, CarService>();
builder.Services.AddScoped<IDriverService, DriverService>();
builder.Services.AddScoped<IDriverAlertService, DriverAlertService>();
builder.Services.AddScoped<IServiceEntryService, ServiceEntryService>();
builder.Services.AddScoped<IServiceEntryActionsService, ServiceEntryActionsService>();

// Allow the front-end (opened from file:// or a local web server) to call the API
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI(c =>
//    {
//        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Car Service API v1");
//        c.RoutePrefix = string.Empty;
//    });
//}
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Car Service API v1");
});


app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
