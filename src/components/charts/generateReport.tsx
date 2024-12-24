import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import React from 'react';
import { Button } from '../ui/button';

type PurchaseStatusCounts = {
  [key: string]: number;
};

type TopUser = {
  userId: string;
  name: string;
  email: string;
  image?: string;
  totalContribution: number;
};

type AdminDashboardResponse = {
  data: {
    productCount: number;
    feedbackCount: number;
    quoteCount: number;
    purchaseCount: number;
    purchaseStatus: PurchaseStatusCounts;
    categoryCountMap: { [key: string]: number };
    topUsers: TopUser[];
    dailySummary: Array<{
      date: string;
      order: number;
    }>;
  } | undefined;
};

const GenerateReport = ({ data }: AdminDashboardResponse) => {
  const generatePDF = async () => {
    if (!data) return;

    const doc = await PDFDocument.create();
    const page = doc.addPage([600, 800]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { width, height } = page.getSize();

    // Embed fonts
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

    // Define common style variables
    const headerColor = rgb(0.2, 0.2, 0.2);
    const textColor = rgb(0, 0, 0);
    const sectionTitleColor = rgb(0.1, 0.1, 0.1);

    const margin = 50;
    const lineHeight = 18; // Adjust line height for padding

    // Title
    page.drawText('Admin Dashboard Report', {
      x: margin,
      y: height - 50,
      size: 26,
      color: headerColor,
      font: boldFont,
    });

    // Dashboard Summary Section
    let yPosition = height - 140;
    page.drawText('Dashboard Summary:', {
      x: margin,
      y: yPosition,
      size: 18,
      color: sectionTitleColor,
      font: boldFont,
    });

    yPosition -= lineHeight;
    page.drawText(`Products Available: ${data.productCount}`, {
      x: margin,
      y: yPosition,
      size: 14,
      color: textColor,
      font: font,
    });

    yPosition -= lineHeight;
    page.drawText(`Total Feedbacks: ${data.feedbackCount}`, {
      x: margin,
      y: yPosition,
      size: 14,
      color: textColor,
      font: font,
    });

    yPosition -= lineHeight;
    page.drawText(`Total Quotes: ${data.quoteCount}`, {
      x: margin,
      y: yPosition,
      size: 14,
      color: textColor,
      font: font,
    });

    yPosition -= lineHeight;
    page.drawText(`Total Purchases: ${data.purchaseCount}`, {
      x: margin,
      y: yPosition,
      size: 14,
      color: textColor,
      font: font,
    });
    

    // Purchase Status Section
    yPosition -= 3 * lineHeight; // Add more padding between sections
    page.drawText('Purchase Status Breakdown:', {
      x: margin,
      y: yPosition,
      size: 18,
      color: sectionTitleColor,
      font: boldFont,
    });

    yPosition -= 2 * lineHeight; // Space for status list
    for (const [status, count] of Object.entries(data.purchaseStatus)) {
      page.drawText(`${status}: ${count}`, {
        x: margin,
        y: yPosition,
        size: 14,
        color: textColor,
        font: font,
      });
      yPosition -= lineHeight;
    }

    // Top Users Section
    yPosition -= 3 * lineHeight;
    page.drawText('Top Contributing Users:', {
      x: margin,
      y: yPosition,
      size: 18,
      color: sectionTitleColor,
      font: boldFont,
    });


    yPosition -= 2 * lineHeight;
    for (const user of data.topUsers) {
      page.drawText(`${user.name} - ${user.totalContribution} contributions`, {
        x: margin,
        y: yPosition,
        size: 14,
        color: textColor,
        font: font,
      });
      yPosition -= lineHeight;
    }

    // Daily Summary Section
    yPosition -= 3 * lineHeight;
    page.drawText('Daily Order Summary:', {
      x: margin,
      y: yPosition,
      size: 18,
      color: sectionTitleColor,
      font: boldFont,
    });

    yPosition -= 2 * lineHeight;
    for (const summary of data.dailySummary) {
      page.drawText(`Date: ${summary.date} - Orders: ${summary.order}`, {
        x: margin,
        y: yPosition,
        size: 14,
        color: textColor,
        font: font,
      });
      yPosition -= lineHeight;
    }

    // Save the document as a Blob
    const pdfBytes = await doc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Trigger file download
    saveAs(pdfBlob, 'AdminDashboardReport.pdf');
  };

  return (
    <Button onClick={generatePDF} className="w-full bg-main hover:bg-main2 text-white">
      Generate PDF
    </Button>
  );
};

export default GenerateReport;
