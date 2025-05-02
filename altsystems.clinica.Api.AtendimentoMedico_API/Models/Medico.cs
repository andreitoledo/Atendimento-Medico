namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;

public class Medico
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string CRM { get; set; }
    public string Especialidade { get; set; } // Você pode manter para exibição rápida

    public Usuario Usuario { get; set; }

    public ICollection<MedicoEspecialidade> MedicoEspecialidades { get; set; } = new List<MedicoEspecialidade>();
}
