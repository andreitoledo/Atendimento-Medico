using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class PacienteDetalheDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string CPF { get; set; }
        public string Genero { get; set; }
        public string Telefone { get; set; }
        public string Endereco { get; set; }
        public DateTime? DataNascimento { get; set; }
        public int UsuarioId { get; set; }
    }
}
