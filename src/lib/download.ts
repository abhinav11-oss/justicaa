import html2pdf from "html2pdf.js";

export const downloadAsPdf = (htmlContent: string, filename: string) => {
  const element = document.createElement('div');
  element.innerHTML = htmlContent;

  const opt = {
    margin: 0,
    filename: `${filename.replace(/ /g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(element.querySelector('.document-container') || element).set(opt).save();
};

export const downloadAsWord = (htmlContent: string, filename:string) => {
  const htmlDocx = (window as any).htmlDocx;
  if (!htmlDocx) {
    console.error("html-docx-js library not found on window object.");
    throw new Error("Word document generation library not loaded.");
  }

  const fileBuffer = htmlDocx.asBlob(htmlContent);
  const url = URL.createObjectURL(fileBuffer);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename.replace(/ /g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};