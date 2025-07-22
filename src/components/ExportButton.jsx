import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportButton = ({ elementId, fileName }) => {
  const handleExport = () => {
    const input = document.getElementById(elementId);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    });
  };

  return (
    <Button variant="contained" onClick={handleExport} sx={{ mt: 2 }}>
      Export as PDF
    </Button>
  );
};

export default ExportButton;
