using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IFaturamentoRepository
    {
        Task<IEnumerable<Faturamento>> ObterTodos();
        Task<Faturamento> ObterPorId(int id);
        Task<Faturamento> Criar(Faturamento faturamento);
        Task<Faturamento> Atualizar(Faturamento faturamento);
        Task<bool> Deletar(int id);
    }
}