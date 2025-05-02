using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IMedicoEspecialidadeRepository
    {
        Task<IEnumerable<Especialidade>> ObterEspecialidadesDoMedico(int medicoId);
        Task<bool> AtribuirEspecialidades(int medicoId, List<int> especialidadesIds);
    }
}
