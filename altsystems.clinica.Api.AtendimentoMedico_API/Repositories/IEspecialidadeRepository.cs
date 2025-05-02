using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IEspecialidadeRepository
    {
        Task<IEnumerable<Especialidade>> ObterTodas();
        Task<Especialidade> ObterPorId(int id);
        Task<Especialidade> Criar(Especialidade especialidade);
        Task<Especialidade> Atualizar(Especialidade especialidade);
        Task<bool> Deletar(int id);
    }
}