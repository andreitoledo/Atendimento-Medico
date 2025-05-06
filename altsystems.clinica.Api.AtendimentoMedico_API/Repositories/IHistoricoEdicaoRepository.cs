using System.Collections.Generic;
using System.Threading.Tasks;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IHistoricoEdicaoRepository
    {
        Task Registrar(HistoricoEdicao log);
        Task<IEnumerable<HistoricoEdicao>> ObterPorPaciente(int pacienteId);
    }
}