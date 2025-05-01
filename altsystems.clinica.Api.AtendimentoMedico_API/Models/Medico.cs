namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;
public class Medico
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string CRM { get; set; }
    public string Especialidade { get; set; }

    public Usuario Usuario { get; set; }
}