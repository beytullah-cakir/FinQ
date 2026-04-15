using Microsoft.EntityFrameworkCore;
using PersonalFinanceTracker.Infrastructure.Data;
using PersonalFinanceTracker.Infrastructure.ExceptionHandling;
using PersonalFinanceTracker.Features.Transactions;
using PersonalFinanceTracker.Features.Auth;
using PersonalFinanceTracker.Features.Profile;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Global Exception Handler
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

// CORS Yapılandırması
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5174")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Supabase Configuration
var supabaseUrl = builder.Configuration["Supabase:Url"] ?? throw new Exception("Supabase Url is missing");
var supabaseKey = builder.Configuration["Supabase:Key"] ?? throw new Exception("Supabase Key is missing");
var jwtSecret = builder.Configuration["Supabase:JwtSecret"] ?? throw new Exception("Supabase JwtSecret is missing");

// JWT Authentication Configuration
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = $"{supabaseUrl}/auth/v1",
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

// Entity Framework Core Configuration
builder.Services.AddDbContext<AppDbContext>(options => {
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions => {
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorCodesToAdd: null);
        });
    options.EnableDetailedErrors();
    options.EnableSensitiveDataLogging();
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// API Endpoints
app.MapAuthEndpoints();
app.MapTransactionEndpoints();
app.MapProfileEndpoints();

app.Run();
