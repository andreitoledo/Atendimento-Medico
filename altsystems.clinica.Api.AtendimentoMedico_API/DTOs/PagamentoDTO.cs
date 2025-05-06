namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class PagamentoDTO
    {
        public int AgendamentoId { get; set; }
        public int PacienteId { get; set; }
        public decimal Valor { get; set; }
        public string FormaPagamento { get; set; } = null!;
        public string? Descricao { get; set; }
    }
}