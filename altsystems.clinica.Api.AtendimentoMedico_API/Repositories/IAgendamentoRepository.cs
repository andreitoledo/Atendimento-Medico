using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IAgendamentoRepository
    {
        Task<IEnumerable<Agendamento>> ObterTodos(string status);
        Task<Agendamento> ObterPorId(int id);
        Task<Agendamento> Criar(Agendamento agendamento);
        Task<Agendamento> Atualizar(Agendamento agendamento);
        Task<bool> Deletar(int id);
        Task<bool> MarcarCheckIn(int id);
        Task<IEnumerable<Agendamento>> ObterNaoAtendidosAsync();
        Task<IEnumerable<Agendamento>> ObterNaoPagosAsync(); 


    }
}