namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class FiltroFinanceiroDTO
    {
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public string? FormaPagamento { get; set; }
        public string? StatusPagamento { get; set; }
        public int? MedicoId { get; set; }
        public int? PacienteId { get; set; }
    }
}