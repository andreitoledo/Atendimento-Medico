using System;
using System.Threading.Tasks;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.Repositories;
using Newtonsoft.Json;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Services
{
    public class HistoricoEdicaoService
    {
        private readonly IHistoricoEdicaoRepository _repo;

        public HistoricoEdicaoService(IHistoricoEdicaoRepository repo)
        {
            _repo = repo;
        }

        public async Task RegistrarAlteracao<T>(
            string entidade,
            int pacienteId,
            int registroId,
            T snapshotAntes,
            T snapshotDepois,
            int usuarioId)
        {
            var historico = new HistoricoEdicao
            {
                Entidade = entidade,
                PacienteId = pacienteId,
                RegistroId = registroId,
                SnapshotAnterior = JsonConvert.SerializeObject(snapshotAntes),
                SnapshotNovo = JsonConvert.SerializeObject(snapshotDepois),
                UsuarioId = usuarioId,
                DataAlteracao = DateTime.Now
            };

            await _repo.Registrar(historico);
        }
    }
}