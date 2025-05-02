using System;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Models
{
    public class Triagem
    {
        public int Id { get; set; }
        public int AgendamentoId { get; set; }
        public DateTime DataTriagem { get; set; }
        public string PressaoArterial { get; set; }
        public int FrequenciaCardiaca { get; set; }
        public decimal Temperatura { get; set; }
        public int SaturacaoOxigenio { get; set; }
        public decimal Peso { get; set; }
        public decimal Altura { get; set; }
        public decimal IMC { get; set; }
        public string QueixaInicial { get; set; }
        public string Prioridade { get; set; }
    }
}