namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;
public class Atestado
{
    public int Id { get; set; }
    public int AgendamentoId { get; set; }
    public string Tipo { get; set; }
    public string Descricao { get; set; }
    public string CID { get; set; }
    public int DiasAfastado { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;

    public Agendamento Agendamento { get; set; }
}