using cadastro_de_pessoas.Server.Data;
using cadastro_de_pessoas.Server.Dtos;
using cadastro_de_pessoas.Server.Services;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=cadastro.db"));
builder.Services.AddControllers();
builder.Services.AddValidatorsFromAssemblyContaining<Validator>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:49170")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IValidator<PessoaDto>,Validator>();
builder.Services.AddControllers();
builder.Services.AddScoped<PessoaService>();
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();
