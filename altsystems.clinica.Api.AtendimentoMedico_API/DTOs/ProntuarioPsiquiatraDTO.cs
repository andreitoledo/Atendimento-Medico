using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class ProntuarioPsiquiatraDTO
    {
        public int Id { get; set; }
        public int AgendamentoId { get; set; }
        public string NomePaciente { get; set; }
        public string NomeMedico { get; set; }

        public string QueixaPrincipal { get; set; }
        public string DuracaoSintomas { get; set; }
        public string ImpactoVida { get; set; }

        public string HistoriaDoencaAtual { get; set; }
        public string TratamentosAnteriores { get; set; }

        public string HistoricoMedico { get; set; }
        public string HistoricoPsiquiatrico { get; set; }
        public string HistoricoFamiliar { get; set; }
        public string HistoriaPessoalSocial { get; set; }

        public string ExameEstadoMental { get; set; }

        public string Diagnostico { get; set; }
        public string CID10 { get; set; }

        public string PlanoTerapeutico { get; set; }
        public string EvolucaoClinica { get; set; }

        public string Prescricao { get; set; }
        public string SolicitacaoExames { get; set; }
        public string Consentimentos { get; set; }

        public DateTime DataCriacao { get; set; }
    }
}