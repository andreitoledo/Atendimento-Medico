using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class FaturamentoDTO
    {
        public int Id { get; set; }
        public int AgendamentoId { get; set; }
        public int PacienteId { get; set; }
        public DateTime Data { get; set; }
        public decimal Valor { get; set; }
        public string FormaPagamento { get; set; }
        public string? Descricao { get; set; }
        public string? PacienteNome { get; set; }
        public string? MedicoNome { get; set; }

        public string? StatusPagamento { get; set; }
        public string? CodigoTransacao { get; set; }

    }
}