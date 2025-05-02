using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class MedicoEspecialidadeRepository : IMedicoEspecialidadeRepository
    {
        private readonly ClinicaContext _context;

        public MedicoEspecialidadeRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Especialidade>> ObterEspecialidadesDoMedico(int medicoId)
        {
            return await _context.MedicoEspecialidades
                .Where(me => me.MedicoId == medicoId)
                .Select(me => me.Especialidade)
                .ToListAsync();
        }

        public async Task<bool> AtribuirEspecialidades(int medicoId, List<int> especialidadesIds)
        {
            var existentes = _context.MedicoEspecialidades.Where(me => me.MedicoId == medicoId);
            _context.MedicoEspecialidades.RemoveRange(existentes);

            foreach (var especialidadeId in especialidadesIds)
            {
                _context.MedicoEspecialidades.Add(new MedicoEspecialidade
                {
                    MedicoId = medicoId,
                    EspecialidadeId = especialidadeId
                });
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
