using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using altsystems.clinica.Api.AtendimentoMedico_API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Text;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// CONFIGURAÇÃO OBRIGATÓRIA DO QUESTPDF
QuestPDF.Settings.License = LicenseType.Community;

// Adiciona o serviço de CORS para permitir requisições de qualquer origem (desenvolvimento)
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// Configurações do JWT
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddScoped<JwtService>();

// Autenticação JWT (forma direta e segura)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            builder.Configuration["JwtSettings:SecretKey"]))
    };
});

// Controllers e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositórios
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IPacienteRepository, PacienteRepository>();
builder.Services.AddScoped<IMedicoRepository, MedicoRepository>();
builder.Services.AddScoped<IAgendamentoRepository, AgendamentoRepository>();
builder.Services.AddScoped<IProntuarioClinicoRepository, ProntuarioClinicoRepository>();
builder.Services.AddScoped<IProntuarioPsiquiatraRepository, ProntuarioPsiquiatraRepository>();
builder.Services.AddScoped<IProntuarioPsicologoRepository, ProntuarioPsicologoRepository>();
builder.Services.AddScoped<IEspecialidadeRepository, EspecialidadeRepository>();
builder.Services.AddScoped<IMedicoEspecialidadeRepository, MedicoEspecialidadeRepository>();
builder.Services.AddScoped<IFaturamentoRepository, FaturamentoRepository>();
builder.Services.AddScoped<ITriagemRepository, TriagemRepository>();
builder.Services.AddScoped<IRecepcaoRepository, RecepcaoRepository>();

builder.Services.AddScoped<IConsultaRepository, ConsultaRepository>();
builder.Services.AddScoped<ReciboPdfService>();





// Banco de dados
builder.Services.AddDbContext<ClinicaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("DevPolicy"); // Habilita o CORS para desenvolvimento

app.UseAuthentication(); // Antes do Authorization
app.UseAuthorization();
app.MapControllers();
app.Run();