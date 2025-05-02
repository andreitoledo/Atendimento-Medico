namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;

public class Medico
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string CRM { get; set; }
    public string Especialidade { get; set; } // Voc� pode manter para exibi��o r�pida

    public Usuario Usuario { get; set; }

    public ICollection<MedicoEspecialidade> MedicoEspecialidades { get; set; } = new List<MedicoEspecialidade>();
}
