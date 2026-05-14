import { jsPDF } from 'jspdf';

interface AnalysisResult {
  score: number;
  grade: string;
  summary: string;
  details: {
    market: { score: number; feedback: string };
    financial: { score: number; feedback: string };
    team: { score: number; feedback: string };
    product: { score: number; feedback: string };
  };
  recommendations: string[];
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  nextSteps?: string[];
}

const SECTOR_LABELS: Record<string, string> = {
  tech: 'Technologie / Digital',
  commerce: 'Commerce / Distribution',
  services: 'Services',
  artisanat: 'Artisanat',
  agriculture: 'Agriculture / Agroalimentaire',
  industrie: 'Industrie',
  sante: 'Santé / Bien-être',
  education: 'Éducation / Formation',
  tourisme: 'Tourisme / Hôtellerie',
  immobilier: 'Immobilier',
  finance: 'Finance / Assurance',
  autre: 'Autre'
};

function getGradeColor(grade: string): [number, number, number] {
  switch (grade) {
    case 'A': return [16, 185, 129]; // emerald
    case 'B': return [20, 184, 166]; // teal
    case 'C': return [245, 158, 11]; // amber
    case 'D': return [249, 115, 22]; // orange
    default: return [239, 68, 68]; // red
  }
}

function wrapText(text: string, maxWidth: number, doc: jsPDF): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = doc.getTextWidth(testLine);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function generateBusinessPlanPDF(
  analysis: AnalysisResult,
  projectName: string,
  sector: string
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  const sectorLabel = SECTOR_LABELS[sector] || sector;
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(projectName, pageWidth / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Analyse Business Plan - ${sectorLabel}`, pageWidth / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(10);
  doc.text(`Généré le ${date}`, pageWidth / 2, y, { align: 'center' });
  y += 10;

  // Divider
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Score Section
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.roundedRect(margin, y, contentWidth, 50, 5, 5, 'F');

  // Grade
  const gradeColor = getGradeColor(analysis.grade);
  doc.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(analysis.grade, pageWidth / 2 - 20, y + 25, { align: 'center' });

  // Score
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(28);
  doc.text(`${analysis.score}/100`, pageWidth / 2 + 20, y + 25, { align: 'center' });

  // Summary
  doc.setTextColor(60);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  const summaryLines = wrapText(analysis.summary, contentWidth - 20, doc);
  doc.text(summaryLines, pageWidth / 2, y + 42, { align: 'center' });
  y += 60;

  // Detailed Analysis
  doc.setTextColor(30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Analyse détaillée', margin, y);
  y += 10;

  const categories = [
    { label: 'Marché', data: analysis.details.market },
    { label: 'Financier', data: analysis.details.financial },
    { label: 'Équipe', data: analysis.details.team },
    { label: 'Produit', data: analysis.details.product }
  ];

  const cardWidth = (contentWidth - 10) / 2;
  const cardHeight = 35;

  categories.forEach((cat, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = margin + col * (cardWidth + 10);
    const cardY = y + row * (cardHeight + 8);

    // Card background
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 3, 3, 'F');

    // Left border
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(2);
    doc.line(x, cardY + 2, x, cardY + cardHeight - 2);

    // Label
    doc.setTextColor(60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(cat.label, x + 8, cardY + 10);

    // Score
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(16);
    doc.text(`${cat.data.score}/100`, x + 8, cardY + 22);

    // Feedback (truncated if needed)
    doc.setTextColor(100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const feedbackLines = wrapText(cat.data.feedback, cardWidth - 16, doc);
    const truncatedFeedback = feedbackLines.slice(0, 2).join(' ').substring(0, 80) + (feedbackLines.length > 2 || feedbackLines.join(' ').length > 80 ? '...' : '');
    doc.text(truncatedFeedback, x + 8, cardY + 30);
  });

  y += 2 * (cardHeight + 8) + 15;

  // Check if we need a new page
  if (y > pageHeight - 100) {
    doc.addPage();
    y = margin;
  }

  // Recommendations
  doc.setTextColor(30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommandations', margin, y);
  y += 8;

  analysis.recommendations.forEach((rec, index) => {
    // Check for page break
    if (y > pageHeight - 30) {
      doc.addPage();
      y = margin;
    }

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');

    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(1);
    doc.line(margin, y + 2, margin, y + 10);

    doc.setTextColor(60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const recLines = wrapText(rec, contentWidth - 10, doc);
    const truncatedRec = recLines[0].substring(0, 100) + (recLines[0].length > 100 || recLines.length > 1 ? '...' : '');
    doc.text(truncatedRec, margin + 5, y + 8);

    y += 15;
  });

  // SWOT Analysis
  if (analysis.swot) {
    if (y > pageHeight - 100) {
      doc.addPage();
      y = margin;
    }

    doc.setTextColor(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Analyse SWOT', margin, y);
    y += 10;

    const swotData = [
      { label: 'Forces', items: analysis.swot.strengths, color: [16, 185, 129] },
      { label: 'Faiblesses', items: analysis.swot.weaknesses, color: [239, 68, 68] },
      { label: 'Opportunités', items: analysis.swot.opportunities, color: [59, 130, 246] },
      { label: 'Menaces', items: analysis.swot.threats, color: [245, 158, 11] }
    ];

    const swotCardWidth = (contentWidth - 10) / 2;
    const swotCardHeight = 45;

    swotData.forEach((swot, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = margin + col * (swotCardWidth + 10);
      const cardY = y + row * (swotCardHeight + 8);

      // Card background
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, cardY, swotCardWidth, swotCardHeight, 3, 3, 'F');
      doc.setDrawColor(swot.color[0], swot.color[1], swot.color[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, cardY, swotCardWidth, swotCardHeight, 3, 3, 'S');

      // Label
      doc.setTextColor(swot.color[0], swot.color[1], swot.color[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(swot.label, x + 5, cardY + 8);

      // Items
      doc.setTextColor(80);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const items = swot.items.slice(0, 3);
      items.forEach((item, i) => {
        const truncatedItem = item.substring(0, 50) + (item.length > 50 ? '...' : '');
        doc.text(`• ${truncatedItem}`, x + 5, cardY + 16 + i * 8);
      });
    });

    y += 2 * (swotCardHeight + 8) + 10;
  }

  // Next Steps
  if (analysis.nextSteps && analysis.nextSteps.length > 0) {
    if (y > pageHeight - 60) {
      doc.addPage();
      y = margin;
    }

    doc.setTextColor(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Prochaines étapes', margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    analysis.nextSteps.forEach((step, index) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = margin;
      }

      doc.setTextColor(60);
      const stepLines = wrapText(`${index + 1}. ${step}`, contentWidth - 10, doc);
      stepLines.forEach((line, lineIndex) => {
        doc.text(line, margin, y + lineIndex * 6);
      });
      y += stepLines.length * 6 + 4;
    });
  }

  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setTextColor(150);
  doc.setFontSize(9);
  doc.text('Document généré automatiquement par Pathfinder - Analyse IA', pageWidth / 2, footerY, { align: 'center' });

  // Save
  doc.save(`business-plan-${projectName.replace(/\s+/g, '-')}.pdf`);
}
