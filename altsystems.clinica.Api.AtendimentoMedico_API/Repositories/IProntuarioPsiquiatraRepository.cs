using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IProntuarioPsiquiatraRepository
    {
        Task<IEnumerable<ProntuarioPsiquiatra>> ObterTodos();
        Task<ProntuarioPsiquiatra> ObterPorId(int id);
        Task<ProntuarioPsiquiatra> Criar(ProntuarioPsiquiatra prontuario);
        Task<ProntuarioPsiquiatra> Atualizar(ProntuarioPsiquiatra prontuario);
        Task<bool> Deletar(int id);
    }
}