namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class MedicoCreateDTO
    {
        public int UsuarioId { get; set; }
        public string CRM { get; set; }
        public string Especialidade { get; set; }
    }
}