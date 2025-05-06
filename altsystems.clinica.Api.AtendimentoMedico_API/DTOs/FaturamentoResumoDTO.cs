namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class FaturamentoResumoDTO
    {
        public int Id { get; set; }
        public string Paciente { get; set; } = string.Empty;
        public string Medico { get; set; } = string.Empty;
        public DateTime Data { get; set; }
        public decimal Valor { get; set; }
        public string FormaPagamento { get; set; } = string.Empty;
        public string StatusPagamento { get; set; } = string.Empty;
    }
}