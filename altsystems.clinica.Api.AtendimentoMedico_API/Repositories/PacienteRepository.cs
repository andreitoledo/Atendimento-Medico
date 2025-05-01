using altsystems.clinica.Api.AtendimentoMedico_API.Data;
using altsystems.clinica.Api.AtendimentoMedico_API.Models;
using Microsoft.EntityFrameworkCore;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public class PacienteRepository : IPacienteRepository
    {
        private readonly ClinicaContext _context;
        public PacienteRepository(ClinicaContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Paciente>> ObterTodos()
        {
            return await _context.Pacientes.Include(p => p.Usuario).ToListAsync();
        }

        public async Task<Paciente> ObterPorId(int id)
        {
            return await _context.Pacientes.Include(p => p.Usuario).FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Paciente> Criar(Paciente paciente)
        {
            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();
            return paciente;
        }

        public async Task<Paciente> Atualizar(Paciente paciente)
        {
            _context.Entry(paciente).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return paciente;
        }

        public async Task<bool> Deletar(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null) return false;
            _context.Pacientes.Remove(paciente);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}