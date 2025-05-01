using altsystems.clinica.Api.AtendimentoMedico_API.Models;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Repositories
{
    public interface IUsuarioRepository
    {
        Task<IEnumerable<Usuario>> ObterTodos();
        Task<Usuario> ObterPorId(int id);
        Task<Usuario> Criar(Usuario usuario);
        Task<Usuario> Atualizar(Usuario usuario);
        Task<bool> Deletar(int id);
    }
}