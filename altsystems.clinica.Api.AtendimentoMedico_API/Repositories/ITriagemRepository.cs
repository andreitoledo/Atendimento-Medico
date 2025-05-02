using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface ITriagemRepository
    {
        Task<IEnumerable<Triagem>> ObterTodas();
        Task<Triagem> ObterPorId(int id);
        Task<Triagem> Criar(Triagem triagem);
        Task<Triagem> Atualizar(Triagem triagem);
        Task<bool> Deletar(int id);
    }
}