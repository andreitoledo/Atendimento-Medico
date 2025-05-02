using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class EspecialidadeRepository : IEspecialidadeRepository
    {
        private readonly ClinicaContext _context;

        public EspecialidadeRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Especialidade>> ObterTodas()
        {
            return await _context.Especialidades.ToListAsync();
        }

        public async Task<Especialidade> ObterPorId(int id)
        {
            return await _context.Especialidades.FindAsync(id);
        }

        public async Task<Especialidade> Criar(Especialidade especialidade)
        {
            _context.Especialidades.Add(especialidade);
            await _context.SaveChangesAsync();
            return especialidade;
        }

        public async Task<Especialidade> Atualizar(Especialidade especialidade)
        {
            _context.Entry(especialidade).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return especialidade;
        }

        public async Task<bool> Deletar(int id)
        {
            var item = await _context.Especialidades.FindAsync(id);
            if (item == null) return false;

            _context.Especialidades.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}