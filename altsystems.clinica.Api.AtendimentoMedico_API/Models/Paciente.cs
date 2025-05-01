namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;
public class Paciente
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string CPF { get; set; }
    public string Genero { get; set; }
    public string Telefone { get; set; }
    public string Endereco { get; set; }

    public Usuario Usuario { get; set; }
}