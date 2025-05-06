using altsystems.clinica.Api.AtendimentoMedico_API.DTOs;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestPDF.Drawing;
using QuestPDF.Elements;

namespace altsystems.clinica.Api.AtendimentoMedico_API.Services
{
    public class ReciboPdfService
    {
        public byte[] GerarRecibo(ReciboDTO dto)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header().Element(ComposeHeader);
                    page.Content().Element(c => ComposeContent(c, dto));
                    page.Footer().AlignCenter().Text("Documento gerado automaticamente - Clínica Online").Italic().FontSize(10);
                });
            });

            return document.GeneratePdf();
        }

        void ComposeHeader(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeColumn().Stack(stack =>
                {
                    stack.Item().Text("Clínica Online").FontSize(20).Bold();
                    stack.Item().Text("CNPJ: 00.000.000/0001-00");
                    stack.Item().Text("Endereço: Rua da Saúde, 123 - São Paulo/SP");
                    stack.Item().Text("Telefone: (11) 99999-9999");
                });

                row.ConstantColumn(100).Height(60).Background(Colors.Grey.Lighten3); // espaço para logo
            });
        }

        void ComposeContent(IContainer container, ReciboDTO dto)
        {
            container.PaddingVertical(20).Stack(stack =>
            {
                stack.Item().Text("Recibo de Consulta").FontSize(16).Bold().Underline().AlignCenter();

                stack.Item().PaddingVertical(10).LineHorizontal(1).LineColor(Colors.Grey.Lighten1);

                stack.Item().Text($"Recebemos de: {dto.NomePaciente}").Bold();
                stack.Item().Text($"Profissional: {dto.NomeMedico}");
                stack.Item().Text($"Data da Consulta: {dto.DataConsulta:dd/MM/yyyy}");
                stack.Item().Text($"Valor: R$ {dto.Valor:N2}").Bold();
                if (!string.IsNullOrWhiteSpace(dto.Observacoes))
                {
                    stack.Item().Text($"Observações: {dto.Observacoes}");
                }

                stack.Item().PaddingVertical(10).LineHorizontal(1).LineColor(Colors.Grey.Lighten1);

                stack.Item().AlignRight().Text($"Data: {DateTime.Now:dd/MM/yyyy}");
                stack.Item().PaddingTop(40).AlignRight().Text("____________________________________").FontSize(10);
                stack.Item().AlignRight().Text(dto.NomeMedico).FontSize(10);
                stack.Item().AlignRight().Text("Assinatura do profissional").Italic().FontSize(10);
            });
        }
    }
}