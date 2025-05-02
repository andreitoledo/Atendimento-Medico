using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class ProntuarioClinicoDTO
    {
        public int Id { get; set; }
        public int AgendamentoId { get; set; }
        public string NomePaciente { get; set; }
        public string NomeMedico { get; set; }

        public string QueixaPrincipal { get; set; }
        public string HistoriaDoencaAtual { get; set; }
        public string HistoricoMedico { get; set; }
        public string HistoricoFamiliar { get; set; }
        public string HistoricoSocial { get; set; }
        public string HistoricoOcupacional { get; set; }

        public string SinaisVitais { get; set; }
        public string ExameFisico { get; set; }
        public string HipotesesDiagnosticas { get; set; }
        public string SolicitacaoExames { get; set; }

        public string Prescricao { get; set; }
        public string PlanoTerapeutico { get; set; }
        public string EvolucaoClinica { get; set; }

        public string Consentimentos { get; set; }
        public string ObservacoesEncerramento { get; set; }

        public DateTime DataCriacao { get; set; }
    }
}