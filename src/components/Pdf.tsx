import { format } from 'date-fns';
import jsPDF from 'jspdf';
import React, { useRef } from 'react';
import generatePDF from 'react-to-pdf';

export const QuixotePdf = ({ pdfData }) => {
  const targetRef = useRef<HTMLDivElement>(null); // Specify the correct type for targetRef

  // const handleClick = async () => {
  //   try {
  //     // Gerar o PDF
  //     const pdf = new jsPDF();
  //     await generatePDF(targetRef.current, { pdf });

  //     // Converter o jsPDF para Blob
  //     const blob = pdf.output('blob');

  //     // Verificar se o blob foi gerado corretamente
  //     if (!blob) {
  //       console.error('Erro: Blob não foi gerado.');
  //       return;
  //     }

  //     // Converter o blob para uma URL temporária
  //     const url = window.URL.createObjectURL(blob);

  //     // Criar um link de download
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'page.pdf';

  //     // Simular um clique no link para iniciar o download
  //     a.click();

  //     // Liberar a URL temporária
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('Erro ao gerar o PDF:', error);
  //   }
  // };

  // Função para obter o nome do dia da semana

  const handleClick = () => {
    generatePDF(targetRef, { filename: 'page.pdf' });
  };

  const getWeekdayName = (index: number) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[index];
  };

  const calculateChemicalMetrics = (chemicalSpentArray: number[]) => {
    const total = chemicalSpentArray.reduce((acc, curr) => acc + curr, 0);
    const mean = total / chemicalSpentArray.length;
    const sortedArray = [...chemicalSpentArray].sort((a, b) => a - b);
    const median =
      sortedArray.length % 2 === 0
        ? (sortedArray[sortedArray.length / 2 - 1] + sortedArray[sortedArray.length / 2]) / 2
        : sortedArray[Math.floor(sortedArray.length / 2)];
    return { total, mean, median };
  };

  const calculateChemicalMetricsForDay = (services: any[]) => {
    if (services.length === 0) {
      return {
        chlorineMetrics: { total: 0, mean: 0, median: 0 },
        tabletMetrics: { total: 0, mean: 0, median: 0 },
        phosphateMetrics: { total: 0, mean: 0, median: 0 },
        cyanAcidMetrics: { total: 0, mean: 0, median: 0 }
      };
    }

    const flattenAndReplaceNaN = (arr: any[]) => arr.flatMap((val) => (typeof val === 'number' ? val : 0));

    const chlorineSpentArray = flattenAndReplaceNaN(services.map((day) => day.map((service) => service.chlorineSpent)));
    const tabletSpentArray = flattenAndReplaceNaN(services.map((day) => day.map((service) => service.tabletSpent)));
    const phosphateSpentArray = flattenAndReplaceNaN(
      services.map((day) => day.map((service) => service.phosphateSpent))
    );
    const cyanAcidArray = flattenAndReplaceNaN(services.map((day) => day.map((service) => service.cyanAcid)));

    const chlorineMetrics = calculateChemicalMetrics(chlorineSpentArray);
    const tabletMetrics = calculateChemicalMetrics(tabletSpentArray);
    const phosphateMetrics = calculateChemicalMetrics(phosphateSpentArray);
    const cyanAcidMetrics = calculateChemicalMetrics(cyanAcidArray);

    return { chlorineMetrics, tabletMetrics, phosphateMetrics, cyanAcidMetrics };
  };

  return (
    <div className="p-8">
      <button onClick={handleClick} className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Download PDF
      </button>
      <div ref={targetRef} className="mt-8 border p-6">
        {/* Conteúdo a ser incluído no PDF */}
        <div className="flex items-center justify-between">
          <img src="https://aquatechybeta.s3.amazonaws.com/signinlogo.png" className="mr-4 h-12 w-12" alt="Logo" />
          <h1 className="text-2xl font-bold">REPORT OF SERVICES AND PAYMENTS</h1>
          <span />
        </div>

        <div className="mt-8 flex items-center justify-between gap-8">
          {/* Use grid for two-column layout */}
          {/* Left Section */}
          <div className="flex-inline text-center">
            <div className="flex items-center">
              <p className="text-xl font-bold">From company:</p>
              <p className="ml-1 text-center  text-sm">Aquatechy Corp.</p>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-bold">Technician:</p>
              <p className="ml-1 text-center text-sm">{pdfData.Technician}</p>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-bold">From:</p>
              <p className="ml-1 text-center text-sm">{pdfData.From}</p>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-bold">To:</p>
              <p className="ml-1 text-center text-sm">{pdfData.To}</p>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex-inline text-right">
            <div>
              <p className="text-lg font-semibold ">Total services made</p>
              <p className="ml-1 text-4xl font-bold">{pdfData.TotalServicesMade} services</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Total to be paid</p>
              <p className="ml-1 text-3xl font-bold">US${pdfData.TotalToBePaid}</p>
            </div>
          </div>
        </div>

        {/* Services By Weekday Section */}
        {pdfData &&
          pdfData.ServicesByWeekday &&
          pdfData.ServicesByWeekday.map((services, index) => (
            <div key={index} className="mt-8">
              {services && services.length > 0 && (
                <div>
                  <div className="flex justify-start">
                    <h2 className="text-xl font-semibold">{getWeekdayName(index)}</h2>
                    <p className="ml-1 ">({services.length} services)</p>
                  </div>
                  <table className="mt-4 w-full border-t-2 border-[#5c5cf4]">
                    <thead>
                      <tr>
                        <th className="py-2  text-left text-xl">Pool</th>
                        <th className="px-4  py-2 text-xl">Date</th>
                        <th className="px-4  py-2 text-xl">Chemicals Spent</th>
                        <th className="py-2  text-right text-xl">Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service, serviceIndex) => (
                        <tr key={serviceIndex} className="mt-4 w-full border-b">
                          <td className=" py-2 text-left">{service.pool.name}</td>
                          <td className=" px-4 py-2 text-center">
                            {format(new Date(service.createdAt), "EEEE, MMMM do 'at' h:mm aaaa")}
                          </td>
                          <td className=" px-4 py-2 text-center">
                            {services.chlorineSpent} - {services.phosphateSpent} - {services.saltSpent} -{'\n'}
                            {services.shockSpent} - {services.tabletSpent} - {services.acidSpent}
                          </td>
                          {/* so tirar os zeros */}
                          <td className=" py-2 text-right">US${service.paid ? service.paid : '0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        <div className="mt-4 w-full border-b-2 border-slate-500 py-1 text-start">
          <h2 className="text-xl font-bold">Chemicals Spent</h2>
        </div>

        <div className="flex-inline mt-6">
          <div className="flex items-center">
            <p className="text-xl font-bold">Chlorine Liquid:</p>
            <p className="ml-1 text-lg">
              {
                calculateChemicalMetricsForDay(
                  pdfData.ServicesByWeekday.map((day) => day.map((service) => service.chlorineSpent))
                ).chlorineMetrics.total
              }{' '}
              gallons.
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-xl font-bold">Tablets:</p>
            <p className="ml-1 text-lg">
              {
                calculateChemicalMetricsForDay(
                  pdfData.ServicesByWeekday.map((day) => day.map((service) => service.tabletSpent))
                ).tabletMetrics.total
              }{' '}
              tablets.
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-xl font-bold">Phosphate Remover:</p>
            <p className="ml-1 text-lg">
              {
                calculateChemicalMetricsForDay(
                  pdfData.ServicesByWeekday.map((day) => day.map((service) => service.phosphateSpent))
                ).phosphateMetrics.total
              }{' '}
              units.
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-xl font-bold">Muriatic Acid:</p>
            <p className="ml-1 text-lg">
              {
                calculateChemicalMetricsForDay(
                  pdfData.ServicesByWeekday.map((day) => day.map((service) => service.cyanAcid))
                ).cyanAcidMetrics.total
              }{' '}
              units.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <img src="https://aquatechybeta.s3.amazonaws.com/signinlogo.png" className="h-12" alt="Aquatechy Logo" />
        </div>
      </div>
    </div>
  );
};
