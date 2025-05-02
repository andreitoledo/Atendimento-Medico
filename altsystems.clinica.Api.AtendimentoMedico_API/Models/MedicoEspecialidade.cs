namespace altsystems.clinica.Api.AtendimentoMedico_API.Models
{
    public class MedicoEspecialidade
    {
        public int MedicoId { get; set; }
        public Medico Medico { get; set; }

        public int EspecialidadeId { get; set; }
        public Especialidade Especialidade { get; set; }
    }
}
