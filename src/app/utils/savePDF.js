import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
export async function savePDF() {
  const element = document.getElementById("pdf-content");
  if (!element) return;

  const originalStyle = {
    display: element.style.display,
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    width: element.style.width,
  };

  element.style.display = "block";
  element.style.position = "fixed";
  element.style.left = "-9999px";
  element.style.top = "0";
  element.style.width = "800px";

  let canvas;
  let blockBottoms;
  try {
    canvas = await html2canvas(element, { scale: 2, useCORS: true });

    const elementRect = element.getBoundingClientRect();
    const canvasScale = canvas.width / elementRect.width;
    blockBottoms = [...element.querySelectorAll(".pdf-block")]
      .map((block) => {
        const rect = block.getBoundingClientRect();
        return {
          top: Math.round((rect.top - elementRect.top) * canvasScale),
          bottom: Math.round((rect.bottom - elementRect.top) * canvasScale),
        };
      });
  } finally {
    Object.assign(element.style, originalStyle);
  }

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const margin = 8; // mm of white space around the content on every page
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;
  const pageCanvasHeight = Math.floor((canvas.width * contentHeight) / contentWidth);

  for (let offsetY = 0, pageIndex = 0; offsetY < canvas.height; pageIndex += 1) {
    if (pageIndex > 0) pdf.addPage();

    const pageEnd = Math.min(offsetY + pageCanvasHeight, canvas.height);
    const crossingBlock = blockBottoms.find(
      (block) => block.top > offsetY && block.top < pageEnd && block.bottom > pageEnd
    );
    const sliceEnd = crossingBlock ? crossingBlock.top : pageEnd;
    const sliceHeight = Math.max(1, sliceEnd - offsetY);
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const context = pageCanvas.getContext("2d");
    context.drawImage(
      canvas,
      0,
      offsetY,
      canvas.width,
      sliceHeight,
      0,
      0,
      pageCanvas.width,
      pageCanvas.height
    );

    const sliceHeightMm = (sliceHeight * contentWidth) / canvas.width;
    pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", margin, margin, contentWidth, sliceHeightMm);

    offsetY = sliceEnd;
  }

  const fileName = "AskMyMoon_Report.pdf";
  const pdfBlob = pdf.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = pdfUrl;
  downloadLink.download = fileName;
  downloadLink.rel = "noopener";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
}