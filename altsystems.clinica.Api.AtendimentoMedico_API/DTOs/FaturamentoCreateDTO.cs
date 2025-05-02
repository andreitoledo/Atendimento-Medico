using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class FaturamentoCreateDTO
    {
        public int AgendamentoId { get; set; }
        public int PacienteId { get; set; }
        public DateTime Data { get; set; }
        public decimal Valor { get; set; }
        public string FormaPagamento { get; set; }
        public string? Descricao { get; set; }
    }
}