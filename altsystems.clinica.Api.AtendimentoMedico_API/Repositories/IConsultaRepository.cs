using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IConsultaRepository
    {
        Task<IEnumerable<Consulta>> ObterTodos();
        Task<Consulta> ObterPorId(int id);
        Task<Consulta> Criar(ConsultaCreateDTO dto);
        Task Atualizar(Consulta consulta);
        Task<bool> Deletar(int id);


    }
}
