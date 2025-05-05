namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class AgendamentoDTO
    {
        public int Id { get; set; }
        public int MedicoId { get; set; }
        public string NomeMedico { get; set; }
        public int PacienteId { get; set; }
        public string NomePaciente { get; set; }
        public DateTime DataConsulta { get; set; }
        public string Status { get; set; }
        public string Plataforma { get; set; }
        public string LinkVideo { get; set; }
        public bool CheckIn { get; set; }

    }
}