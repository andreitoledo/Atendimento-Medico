namespace altsystems.clinica.Api.AtendimentoMedico_API.Models;
public class CAT
{
    public int Id { get; set; }
    public int AgendamentoId { get; set; }
    public DateTime DataAcidente { get; set; }
    public string Local { get; set; }
    public string TipoAcidente { get; set; }
    public string ParteCorpoAtingida { get; set; }
    public string Descricao { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;

    public Agendamento Agendamento { get; set; }
}