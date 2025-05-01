namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class UsuarioDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Tipo { get; set; }
        public bool Ativo { get; set; }
    }
}