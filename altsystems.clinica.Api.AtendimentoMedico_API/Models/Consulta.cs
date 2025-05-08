using System.Xml.Linq;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Models
{
    public class Consulta
    {
        public int Id { get; set; }
        public int AgendamentoId { get; set; }
        public Agendamento Agendamento { get; set; }
        public DateTime DataConsulta { get; set; }
        public string Diagnostico { get; set; }

        public List<Prescricao> Prescricoes { get; set; }
        public List<Exame> ExamesSolicitados { get; set; }
        public string? Observacoes { get; set; }

    }

}
