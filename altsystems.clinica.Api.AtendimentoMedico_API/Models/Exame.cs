namespace altsystems.clinica.Api.AtendimentoMedico_API.Models
{
    public class Exame
    {
        public int Id { get; set; }
        public int ConsultaId { get; set; }
        public string Nome { get; set; }
        public string Observacoes { get; set; }
    }

}
