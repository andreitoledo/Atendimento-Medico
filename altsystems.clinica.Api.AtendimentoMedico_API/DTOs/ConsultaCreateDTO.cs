namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class ConsultaCreateDTO
    {
        public int AgendamentoId { get; set; }
        public DateTime DataConsulta { get; set; }
        public string Diagnostico { get; set; }
        public List<PrescricaoDTO> Prescricoes { get; set; }
        public List<ExameDTO> ExamesSolicitados { get; set; }
    }

}
