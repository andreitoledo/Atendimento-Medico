using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IPacienteRepository
    {
        Task<IEnumerable<Paciente>> ObterTodos();
        Task<Paciente> ObterPorId(int id);
        Task<Paciente> Criar(Paciente paciente);
        Task<Paciente> Atualizar(Paciente paciente);
        Task<bool> Deletar(int id);
    }
}