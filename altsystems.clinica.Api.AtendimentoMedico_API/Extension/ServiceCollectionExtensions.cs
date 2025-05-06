using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using altsystems.clinica.Api.AtendimentoMedico_API.Services;
using Microsoft.Extensions.DependencyInjection;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddClinicaServices(this IServiceCollection services)
        {
            services.AddScoped<HistoricoEdicaoService>();
            return services;
        }
    }
}