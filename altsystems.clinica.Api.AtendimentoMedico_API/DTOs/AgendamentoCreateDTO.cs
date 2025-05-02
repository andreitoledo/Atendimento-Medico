namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class AgendamentoCreateDTO
    {
        public int MedicoId { get; set; }
        public int PacienteId { get; set; }
        public DateTime DataConsulta { get; set; }
        public string Plataforma { get; set; }
        public string LinkVideo { get; set; }
    }
}