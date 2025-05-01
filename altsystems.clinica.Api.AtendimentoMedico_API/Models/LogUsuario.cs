namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;
public class LogUsuario
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string Acao { get; set; }
    public DateTime DataHora { get; set; } = DateTime.Now;

    public Usuario Usuario { get; set; }
}