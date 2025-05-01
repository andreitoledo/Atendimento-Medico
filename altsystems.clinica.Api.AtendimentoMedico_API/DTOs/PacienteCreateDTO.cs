namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class PacienteCreateDTO
    {
        public int UsuarioId { get; set; }
        public string CPF { get; set; }
        public string Genero { get; set; }
        public string Telefone { get; set; }
        public string Endereco { get; set; }
        public DateTime? DataNascimento { get; set; }
    }
}