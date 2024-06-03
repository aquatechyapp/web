import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import generatePDF, { Margin, Options } from 'react-to-pdf';

export const QuixotePdf = ({ pdfData }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
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

  const openPdfInNewTab = async () => {
    try {
      setLoading(true);

      const options: Options = {
        filename: 'report.pdf',
        method: 'open', // Open PDF in new tab
        page: {
          format: 'a4', // A4 page format
          margin: Margin.SMALL
        },
        overrides: {
          pdf: {
            compress: true
          },
          canvas: {
            useCORS: true
          }
        }
      };

      // Generate PDF with options
      await generatePDF(targetRef, options);

      setLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={openPdfInNewTab}
        disabled={loading} // Desabilita o botão durante o carregamento
      >
        {loading ? 'Generating PDF...' : 'Open PDF'}
      </button>

      <div
        ref={targetRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px'
        }}
        className="mt-8 p-8"
      >
        <div className="flex items-center justify-between">
          <img src="./images/logotransparente.jpg" className="h-20 w-20" alt="Logo" />
          <h1 className="text-2xl font-bold">REPORT OF SERVICES AND PAYMENTS</h1>
          <span />
        </div>
        <div className="mt-8 flex items-center justify-between gap-8">
          <div className="flex-inline justify-center">
            <div className="flex items-center">
              <p className=" text-xl font-bold">From company:</p>
              <p className="ml-1  text-lg">Aquatechy Corp</p>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-bold">Technician:</p>
              <p className="ml-1 text-lg">{pdfData.Technician}</p>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-bold">From:</p>
              <p className="ml-1 text-lg">{pdfData.From}</p>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-bold">To:</p>
              <p className="ml-1 text-lg">{pdfData.To}</p>
            </div>
          </div>
          <div className="flex-inline items-center justify-center text-right">
            <p className="h-5  text-lg font-semibold">Total services made</p>
            <p className="h-10  text-4xl font-bold">{pdfData.TotalServicesMade} services</p>
            <p className="mt-2 h-5 text-lg font-semibold">Total to be paid</p>
            <p className="h-10  text-4xl font-bold">US${pdfData.TotalToBePaid ? pdfData.TotalToBePaid : '0.00'}</p>
          </div>
        </div>
        {/* Services By Weekday Section */}
        {pdfData &&
          pdfData.ServicesByWeekday &&
          pdfData.ServicesByWeekday.map((services, index) => (
            <div key={index} className="mt-4">
              {services && services.length > 0 && (
                <div>
                  <div className="flex justify-start py-2">
                    <h2 className=" text-xl font-semibold">{getWeekdayName(index)}</h2>
                    <p className="ml-1 text-lg">({services.length} services)</p>
                  </div>
                  <table className="w-full border-t-2 border-[#5c5cf4]">
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
                        <tr key={serviceIndex} className="w-full border-b">
                          <td onli className="py-2 text-left">
                            {service.pool.name}
                          </td>
                          <td className=" px-4 py-2 text-center">
                            {format(new Date(service.createdAt), "EEEE, MMMM do 'at' h:mm aaaa")}
                          </td>
                          <td className=" px-4 py-2 text-center">
                            {services.chlorineSpent} - {services.phosphateSpent} - {services.saltSpent} -{'\n'}
                            {services.shockSpent} - {services.tabletSpent} - {services.acidSpent}
                          </td>
                          <td className=" py-2 text-right">US${service.paid ? service.paid : '0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        <div className="mt-8 w-full border-b-2 border-slate-500 py-2 text-start">
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
          <img src="./images/logoHor.png" className="h-12" alt="Aquatechy Logo" />
        </div>
      </div>
    </div>
  );
};
