namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class AgendamentoRecepcaoDTO
    {
        public int Id { get; set; }
        public string PacienteNome { get; set; }
        public string MedicoNome { get; set; }
        public DateTime DataConsulta { get; set; }
        public string Status { get; set; }
        public bool CheckIn { get; set; }
    }
}