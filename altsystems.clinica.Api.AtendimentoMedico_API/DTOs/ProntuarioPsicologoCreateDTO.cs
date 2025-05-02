namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class ProntuarioPsicologoCreateDTO
    {
        public int AgendamentoId { get; set; }
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
    }
}