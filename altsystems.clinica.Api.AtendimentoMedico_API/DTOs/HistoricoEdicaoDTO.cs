using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class HistoricoEdicaoDTO
    {
        public int Id { get; set; }
        public string Entidade { get; set; }
        public int RegistroId { get; set; }
        public string SnapshotAnterior { get; set; }
        public string SnapshotNovo { get; set; }
        public int UsuarioId { get; set; }
        public string UsuarioNome { get; set; }
        public DateTime DataAlteracao { get; set; }
    }
}