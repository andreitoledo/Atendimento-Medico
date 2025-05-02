using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Models
{
    public class ProntuarioPsicologo
    {
        public int Id { get; set; }
        public int AgendamentoId { get; set; }
        public Agendamento Agendamento { get; set; }

        public string CRP { get; set; }

        public string QueixaPrincipal { get; set; }
        public string ObjetivosTerapia { get; set; }
        public string HistoricoProblema { get; set; }
        public string HistoriaDeVida { get; set; }
        public string ResultadosAvaliacoes { get; set; }

        public string EvolucaoAtendimento { get; set; }
        public string Encaminhamentos { get; set; }
        public string Encerramento { get; set; }

        public string DocumentosAnexos { get; set; }

        public DateTime DataCriacao { get; set; }
    }
}