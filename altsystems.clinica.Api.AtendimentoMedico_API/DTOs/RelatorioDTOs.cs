namespace altsystems.clinica.Api.AtendimentoMedico_API.DTOs
{
    public class RelatorioConsultaDTO
    {
        public string NomeMedico { get; set; }
        public string Especialidade { get; set; }
        public int TotalConsultas { get; set; }
        public DateTime? Dia { get; set; }
    }

    public class RelatorioFaturamentoDTO
    {
        public DateTime Dia { get; set; }
        public decimal Total { get; set; }
    }

    public class RelatorioComparecimentoDTO
    {
        public string Status { get; set; }
        public int Quantidade { get; set; }
    }

    public class RelatorioPacienteDTO
    {
        public string NomePaciente { get; set; }
        public int TotalConsultas { get; set; }
    }
}