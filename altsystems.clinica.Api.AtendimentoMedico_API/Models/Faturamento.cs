using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Models
{
    public class Faturamento
    {
        public int Id { get; set; }
        public int AgendamentoId { get; set; }
        public int PacienteId { get; set; }
        public DateTime Data { get; set; }
        public decimal Valor { get; set; }
        public string FormaPagamento { get; set; }
        public string? Descricao { get; set; }

        // Navegações
        public Agendamento Agendamento { get; set; }
        public Paciente Paciente { get; set; }

        // Para Pagamentos
        public string CodigoTransacao { get; internal set; }
        public string StatusPagamento { get; internal set; }
    }
}