namespace altsystems.clinica.Api.AtendimentoMedico_API.Services
{
    public class JwtSettings
    {
        public string SecretKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpiracaoHoras { get; set; }
    }
}