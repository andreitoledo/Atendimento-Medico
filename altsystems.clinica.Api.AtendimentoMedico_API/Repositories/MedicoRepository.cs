using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class MedicoRepository : IMedicoRepository
    {
        private readonly ClinicaContext _context;
        public MedicoRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Medico>> ObterTodos()
        {
            return await _context.Medicos.Include(m => m.Usuario).ToListAsync();
        }

        public async Task<Medico> ObterPorId(int id)
        {
            return await _context.Medicos.Include(m => m.Usuario).FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Medico> Criar(Medico medico)
        {
            _context.Medicos.Add(medico);
            await _context.SaveChangesAsync();
            return medico;
        }

        public async Task<Medico> Atualizar(Medico medico)
        {
            _context.Entry(medico).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return medico;
        }

        public async Task<bool> Deletar(int id)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico == null) return false;
            _context.Medicos.Remove(medico);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}