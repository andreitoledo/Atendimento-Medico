using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class ProntuarioPsiquiatraRepository : IProntuarioPsiquiatraRepository
    {
        private readonly ClinicaContext _context;

        public ProntuarioPsiquiatraRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProntuarioPsiquiatra>> ObterTodos()
        {
            return await _context.ProntuariosPsiquiatra
                .Include(p => p.Agendamento).ThenInclude(a => a.Paciente).ThenInclude(u => u.Usuario)
                .Include(p => p.Agendamento).ThenInclude(a => a.Medico).ThenInclude(u => u.Usuario)
                .ToListAsync();
        }

        public async Task<ProntuarioPsiquiatra> ObterPorId(int id)
        {
            return await _context.ProntuariosPsiquiatra
                .Include(p => p.Agendamento).ThenInclude(a => a.Paciente).ThenInclude(u => u.Usuario)
                .Include(p => p.Agendamento).ThenInclude(a => a.Medico).ThenInclude(u => u.Usuario)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<ProntuarioPsiquiatra> Criar(ProntuarioPsiquiatra prontuario)
        {
            _context.ProntuariosPsiquiatra.Add(prontuario);
            await _context.SaveChangesAsync();
            return prontuario;
        }

        public async Task<ProntuarioPsiquiatra> Atualizar(ProntuarioPsiquiatra prontuario)
        {
            _context.Entry(prontuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return prontuario;
        }

        public async Task<bool> Deletar(int id)
        {
            var prontuario = await _context.ProntuariosPsiquiatra.FindAsync(id);
            if (prontuario == null) return false;

            _context.ProntuariosPsiquiatra.Remove(prontuario);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}