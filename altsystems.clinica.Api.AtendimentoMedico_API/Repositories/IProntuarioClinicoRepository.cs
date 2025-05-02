using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IProntuarioClinicoRepository
    {
        Task<IEnumerable<ProntuarioClinico>> ObterTodos();
        Task<ProntuarioClinico> ObterPorId(int id);
        Task<ProntuarioClinico> Criar(ProntuarioClinico prontuario);
        Task<ProntuarioClinico> Atualizar(ProntuarioClinico prontuario);
        Task<bool> Deletar(int id);
    }
}