namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class ReciboDTO
    {
        public string NomePaciente { get; set; } = null!;
        public string NomeMedico { get; set; } = null!;
        public DateTime DataConsulta { get; set; }
        public decimal Valor { get; set; }
        public string? Observacoes { get; set; }
    }
}