using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Models
{
    public class HistoricoEdicao
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public string Entidade { get; set; }
        public int RegistroId { get; set; }
        public string SnapshotAnterior { get; set; }
        public string SnapshotNovo { get; set; }
        public int UsuarioId { get; set; }
        public DateTime DataAlteracao { get; set; }
    }
}