using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IProntuarioPsicologoRepository
    {
        Task<IEnumerable<ProntuarioPsicologo>> ObterTodos();
        Task<ProntuarioPsicologo> ObterPorId(int id);
        Task<ProntuarioPsicologo> Criar(ProntuarioPsicologo prontuario);
        Task<ProntuarioPsicologo> Atualizar(ProntuarioPsicologo prontuario);
        Task<bool> Deletar(int id);
    }
}