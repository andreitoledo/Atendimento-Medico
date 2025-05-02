using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IRecepcaoRepository
    {
        Task<List<AgendamentoRecepcaoDTO>> ObterAgendamentosDoDia();
        Task<bool> MarcarCheckIn(int id);
        Task<bool> AtualizarStatus(int id, string status);
    }
}