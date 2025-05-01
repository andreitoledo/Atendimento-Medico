using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IMedicoRepository
    {
        Task<IEnumerable<Medico>> ObterTodos();
        Task<Medico> ObterPorId(int id);
        Task<Medico> Criar(Medico medico);
        Task<Medico> Atualizar(Medico medico);
        Task<bool> Deletar(int id);
    }
}