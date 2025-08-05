import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Service } from '@/ts/interfaces/Service';

export const generateServicePDF = async (service: Service) => {
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(24);
  doc.setTextColor(54, 77, 157); // Your brand color #364D9D
  doc.text('Aquatechy', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Service Report', 20, 35);
  
  // Service details section
  doc.setFontSize(12);
  doc.text(`Service Date: ${format(new Date(service.completedAt || ''), 'MMM dd, yyyy')}`, 20, 50);
  doc.text(`Technician: ${service.completedByUser?.firstName} ${service.completedByUser?.lastName}`, 20, 60);
  doc.text(`Pool Address: ${service.pool?.address}, ${service.pool?.city}, ${service.pool?.state} ${service.pool?.zip}`, 20, 70);
  
  // Chemical Readings Table
  doc.setFontSize(14);
  doc.setTextColor(54, 77, 157);
  doc.text('Chemical Readings', 20, 90);
  
  const readingsData = [
    ['Chlorine (ppm)', service.chemicalsReading?.chlorine || 'N/A'],
    ['P.H', service.chemicalsReading?.ph || 'N/A'],
    ['Salt (ppm)', service.chemicalsReading?.salt || 'N/A'],
    ['Alkalinity (ppm)', service.chemicalsReading?.alkalinity || 'N/A'],
    ['Cyanuric Acid (ppm)', service.chemicalsReading?.cyanuricAcid || 'N/A'],
    ['Calcium (ppm)', service.chemicalsReading?.hardness || 'N/A']
  ];
  
  autoTable(doc, {
    startY: 100,
    head: [['Parameter', 'Value']],
    body: readingsData,
    theme: 'grid',
    headStyles: {
      fillColor: [54, 77, 157],
      textColor: 255,
      fontSize: 12
    },
    styles: {
      fontSize: 10
    }
  });
  
  // Chemicals Spent Table
  const currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setTextColor(54, 77, 157);
  doc.text('Chemicals Spent', 20, currentY);
  
  const chemicalsData = [
    ['Liquid Chlorine', `${service.chemicalsSpent?.liquidChlorine || 0} gallon`],
    ['Muriatic Acid', `${service.chemicalsSpent?.muriaticAcid || 0} gallon`],
    ['Salt', `${service.chemicalsSpent?.salt || 0} lb`],
    ['Shock', `${service.chemicalsSpent?.shock || 0} oz`],
    ['Tablet', `${service.chemicalsSpent?.tablet || 0} unit`],
    ['Phosphate Remover', `${service.chemicalsSpent?.phosphateRemover || 0} oz`]
  ];
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Chemical', 'Amount Used']],
    body: chemicalsData,
    theme: 'grid',
    headStyles: {
      fillColor: [54, 77, 157],
      textColor: 255,
      fontSize: 12
    },
    styles: {
      fontSize: 10
    }
  });
  
  // Service Checklist
  const checklistY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setTextColor(54, 77, 157);
  doc.text('Service Checklist', 20, checklistY);
  
  const checklistData = [
    ['Skimmer cleaned', service.checklist?.skimmerCleaned ? '✓' : '✗'],
    ['Tiles brushed', service.checklist?.tilesBrushed ? '✓' : '✗'],
    ['Baskets cleaned', service.checklist?.pumpBasketCleaned ? '✓' : '✗'],
    ['Filter washed', service.checklist?.filterWashed ? '✓' : '✗'],
    ['Water tested', service.checklist?.chemicalsAdjusted ? '✓' : '✗'],
    ['Pool vacuumed', service.checklist?.poolVacuumed ? '✓' : '✗']
  ];
  
  autoTable(doc, {
    startY: checklistY + 5,
    head: [['Task', 'Completed']],
    body: checklistData,
    theme: 'grid',
    headStyles: {
      fillColor: [54, 77, 157],
      textColor: 255,
      fontSize: 12
    },
    styles: {
      fontSize: 10
    }
  });
  
  // Add Photos Section if photos exist
  if (service.photos && service.photos.length > 0) {
    const photosY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(54, 77, 157);
    doc.text('Service Photos', 20, photosY);
    
    let currentPhotoY = photosY + 10;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const availableWidth = pageWidth - (2 * margin);
    const photoWidth = availableWidth / 2 - 5; // 2 photos per row with gap
    const photoHeight = 40; // Fixed height for consistency
    
    for (let i = 0; i < service.photos.length; i++) {
      const x = margin + (i % 2) * (photoWidth + 10);
      
      try {
        // Check if we need a new page
        if (currentPhotoY + photoHeight > doc.internal.pageSize.height - 30) {
          doc.addPage();
          currentPhotoY = 20;
        }
        
        // Add photo caption
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Photo ${i + 1}`, x, currentPhotoY - 2);
        
        // Add the image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = service.photos[i];
        });
        
        doc.addImage(img, 'JPEG', x, currentPhotoY, photoWidth, photoHeight);
        
        // Move to next row if this was the second photo in the row
        if (i % 2 === 1) {
          currentPhotoY += photoHeight + 15;
        }
        
      } catch (error) {
        console.error(`Error adding photo ${i + 1}:`, error);
        // Add placeholder text if image fails to load
        doc.setFontSize(10);
        doc.setTextColor(255, 0, 0);
        doc.text(`Photo ${i + 1} - Failed to load`, x, currentPhotoY + photoHeight / 2);
      }
    }
  }
  
  // Footer
  const footerY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Report generated on ${format(new Date(), 'MMM dd, yyyy at h:mm a')}`, 20, footerY);
  
  // Save the PDF
  doc.save(`service-report-${service.id}-${format(new Date(service.completedAt || ''), 'yyyy-MM-dd')}.pdf`);
}; 