import React, { useState, useRef, useCallback } from "react";
import "./App.css";
import ConectysLogo from "./conectys.png";
import RonaldoGif from "./ronaldo.gif";
import { PDFDocument, PDFName, PDFDict } from "pdf-lib";

/* ------------------- PDF‑JS IMPORT ------------------- */
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Use local worker file from public folder (works for both local and GitHub Pages)
pdfjsLib.GlobalWorkerOptions.workerSrc = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/pdf.worker.min.js` : "/pdf.worker.min.js";

/* ------------------- ICON COMPONENTS ------------------- */
const IconUpload = () => (
  <svg className='icon icon-large' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
    <polyline points='17 8 12 3 7 8'></polyline>
    <line x1='12' y1='3' x2='12' y2='15'></line>
  </svg>
);
const IconDownload = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
    <polyline points='7 10 12 15 17 10'></polyline>
    <line x1='12' y1='15' x2='12' y2='3'></line>
  </svg>
);
const IconMoon = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
  </svg>
);
const IconSun = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <circle cx='12' cy='12' r='5' />
    <line x1='12' y1='1' x2='12' y2='3' />
    <line x1='12' y1='21' x2='12' y2='23' />
    <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
    <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
    <line x1='1' y1='12' x2='3' y2='12' />
    <line x1='21' y1='12' x2='23' y2='12' />
  </svg>
);
const IconPortugueseFlag = () => (
  <svg className='icon flag-icon' viewBox='0 0 600 400' fill='none'>
    <rect width='600' height='400' fill='#FF0000' />
    <rect width='240' height='400' fill='#006600' />
    <circle cx='240' cy='200' r='80' fill='#FFD700' stroke='#000' strokeWidth='3' />
    <circle cx='240' cy='200' r='60' fill='#FFF' stroke='#000' strokeWidth='2' />
    <circle cx='240' cy='200' r='45' fill='#0000FF' stroke='#000' strokeWidth='2' />
  </svg>
);
const IconEnglishFlag = () => (
  <svg className='icon flag-icon' viewBox='0 0 60 30'>
    <clipPath id='s'>
      <path d='M0,0 v30 h60 v-30 z' />
    </clipPath>
    <clipPath id='t'>
      <path d='M30,15 h30 v15 z v-15 h-30 z h-30 v15 z v-15 h30 z' />
    </clipPath>
    <g clipPath='url(#s)'>
      <path d='M0,0 v30 h60 v-30 z' fill='#012169' />
      <path d='M0,0 L60,30 M60,0 L0,30' stroke='#fff' strokeWidth='6' />
      <path d='M0,0 L60,30 M60,0 L0,30' clipPath='url(#t)' stroke='#C8102E' strokeWidth='4' />
      <path d='M30,0 v30 M0,15 h60' stroke='#fff' strokeWidth='10' />
      <path d='M30,0 v30 M0,15 h60' stroke='#C8102E' strokeWidth='6' />
    </g>
  </svg>
);
const IconGitHub = () => (
  <svg className='github-icon' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.45 7.86 10.98.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.55-3.87-1.55-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.45.11-3.02 0 0 .97-.31 3.18 1.19a11.05 11.05 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.57.24 2.73.12 3.02.73.81 1.17 1.85 1.17 3.11 0 4.42-2.69 5.39-5.25 5.67.41.35.77 1.04.77 2.1v3.12c0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5z' />
  </svg>
);
const IconTrash = () => (
  <svg className='icon icon-danger' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <polyline points='3 6 5 6 21 6'></polyline>
    <path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'></path>
    <path d='M10 11v6'></path>
    <path d='M14 11v6'></path>
  </svg>
);
const IconFile = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'></path>
    <polyline points='13 2 13 9 20 9'></polyline>
  </svg>
);
const IconCompress = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <polyline points='4 14 10 14 10 20'></polyline>
    <polyline points='20 10 14 10 14 4'></polyline>
    <line x1='14' y1='10' x2='21' y2='3'></line>
    <line x1='3' y1='21' x2='10' y2='14'></line>
  </svg>
);
const IconSplit = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <rect x='3' y='3' width='7' height='18' rx='1'></rect>
    <rect x='14' y='3' width='7' height='7' rx='1'></rect>
    <rect x='14' y='14' width='7' height='7' rx='1'></rect>
  </svg>
);
const IconMerge = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <rect x='3' y='3' width='18' height='7' rx='1'></rect>
    <rect x='3' y='14' width='7' height='7' rx='1'></rect>
    <rect x='14' y='14' width='7' height='7' rx='1'></rect>
  </svg>
);
const IconExtract = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path>
    <polyline points='14 2 14 8 20 8'></polyline>
    <line x1='9' y1='15' x2='15' y2='15'></line>
    <line x1='12' y1='12' x2='12' y2='18'></line>
  </svg>
);
const IconZoomIn = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <circle cx='11' cy='11' r='8'></circle>
    <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
    <line x1='11' y1='8' x2='11' y2='14'></line>
    <line x1='8' y1='11' x2='14' y2='11'></line>
  </svg>
);
const IconZoomOut = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <circle cx='11' cy='11' r='8'></circle>
    <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
    <line x1='8' y1='11' x2='14' y2='11'></line>
  </svg>
);
const IconInfo = () => (
  <svg className='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <circle cx='12' cy='12' r='10'></circle>
    <line x1='12' y1='16' x2='12' y2='12'></line>
    <line x1='12' y1='8' x2='12.01' y2='8'></line>
  </svg>
);
const IconCheck = () => (
  <svg className='icon icon-success' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <polyline points='20 6 9 17 4 12'></polyline>
  </svg>
);
const IconAlert = () => (
  <svg className='icon icon-warning' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
    <line x1='12' y1='9' x2='12' y2='13'></line>
    <line x1='12' y1='17' x2='12.01' y2='17'></line>
  </svg>
);

/* ------------------- HELPERS ------------------- */

function arrayBufferToBlobUrl(buf, mime) {
  const blob = new Blob([buf], { type: mime });
  return URL.createObjectURL(blob);
}

async function reEncodeImage(imgBytes, isJpeg, maxDim, jpegQuality) {
  const mimeIn = isJpeg ? "image/jpeg" : "image/png";
  const url = arrayBufferToBlobUrl(imgBytes, mimeIn);

  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = e => rej(e);
    i.src = url;
  });
  URL.revokeObjectURL(url);

  let { width, height } = img;
  if (Math.max(width, height) > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/jpeg", jpegQuality);
  const base64 = dataUrl.split(",")[1];
  const outBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  canvas.remove();
  return outBytes;
}

/* --------------------------------------------------------------
   PDF COMPRESSION FUNCTIONS
   -------------------------------------------------------------- */
async function compressPDFFast(pdfBytes, quality, onProgress) {
  const MAX_DIMENSION = Math.round(500 + (quality / 100) * 2500);
  const JPEG_QUALITY = 0.3 + (quality / 100) * 0.65;

  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const pageCount = pdfDoc.getPageCount();

  onProgress(5, "Stripping metadata…");
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setCreator("");
  pdfDoc.setProducer("");
  pdfDoc.setKeywords([]);
  pdfDoc.setCreationDate(new Date(0));
  pdfDoc.setModificationDate(new Date(0));

  onProgress(15, "Cleaning catalog…");
  const catalog = pdfDoc.catalog;
  ["Metadata", "PieceInfo", "StructTreeRoot", "SpiderInfo", "OutputIntents", "MarkInfo"].forEach(key => {
    try {
      catalog.delete(PDFName.of(key));
    } catch (_) {}
  });

  onProgress(30, "Optimising images…");
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const resources = page.node.Resources();
    const xObjDict = resources.lookupMaybe(PDFName.of("XObject"));
    if (!xObjDict) continue;

    const entries = xObjDict instanceof PDFDict ? xObjDict.entries() : [];

    for (const [key, ref] of entries) {
      const obj = pdfDoc.context.lookup(ref);
      if (!obj || typeof obj.getContents !== "function") continue;

      const subtype = obj.dict.get(PDFName.of("Subtype"));
      if (!subtype || subtype.toString() !== "/Image") continue;

      const filter = obj.dict.get(PDFName.of("Filter"));
      const filterStr = filter?.toString() ?? "";
      const isJpeg = filterStr.includes("DCTDecode");

      const imgBytes = obj.getContents();

      try {
        const newBytes = await reEncodeImage(imgBytes, isJpeg, MAX_DIMENSION, JPEG_QUALITY);
        obj.setContents(newBytes);
        obj.dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
      } catch (e) {
        console.warn(`Failed to re‑encode image ${key}:`, e);
      }
    }

    onProgress(30 + ((i + 1) / pageCount) * 40, `Optimised page ${i + 1}/${pageCount}`);
  }

  onProgress(85, "Saving compressed PDF…");
  const compressed = await pdfDoc.save({ useObjectStreams: true });
  onProgress(100, "Done!");
  return { bytes: compressed, pageCount, success: true };
}

async function compressPDFRaster(pdfBytes, quality, onProgress) {
  const uint8 = new Uint8Array(pdfBytes);
  const loadingTask = pdfjsLib.getDocument({ data: uint8, disableAutoFetch: true });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;

  const SCALE = 0.5 + (quality / 100) * 1.5;
  const JPEG_QUALITY = 0.3 + (quality / 100) * 0.65;

  async function rasterisePage(pageNumber) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    const base64 = dataUrl.split(",")[1];
    const imgBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    canvas.remove();
    return { imgBytes, width: canvas.width, height: canvas.height };
  }

  const newPdf = await PDFDocument.create();

  for (let i = 1; i <= pageCount; i++) {
    onProgress(10 + ((i - 1) / pageCount) * 80, `Rasterising page ${i}/${pageCount}`);
    const { imgBytes, width, height } = await rasterisePage(i);
    const jpg = await newPdf.embedJpg(imgBytes);
    const pg = newPdf.addPage([width, height]);
    pg.drawImage(jpg, { x: 0, y: 0, width, height });
  }

  onProgress(95, "Saving rasterised PDF…");
  const out = await newPdf.save({ useObjectStreams: true });
  onProgress(100, "Done!");
  return { bytes: out, pageCount, success: true };
}

async function compressPDFUnified(pdfBytes, quality, onProgress) {
  try {
    return await compressPDFFast(pdfBytes, quality, onProgress);
  } catch (fastErr) {
    console.warn("Fast compression failed, falling back to rasterisation:", fastErr);
    try {
      return await compressPDFRaster(pdfBytes, quality, onProgress);
    } catch (rasterErr) {
      console.error("Raster fallback also failed:", rasterErr);
      throw new Error(`Both compression methods failed – ${rasterErr instanceof Error ? rasterErr.message : rasterErr}`);
    }
  }
}

/* --------------------------------------------------------------
   PDF SPLITTING FUNCTION
   -------------------------------------------------------------- */
async function splitPDF(pdfBytes, pagesPerSplit, onProgress) {
  onProgress(10, "Loading PDF…");
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  if (pagesPerSplit <= 0 || pagesPerSplit > totalPages) {
    throw new Error(`Invalid pages per split. Must be between 1 and ${totalPages}`);
  }

  const numSplits = Math.ceil(totalPages / pagesPerSplit);
  const splitPdfs = [];

  onProgress(20, `Splitting into ${numSplits} PDF${numSplits > 1 ? "s" : ""}…`);

  for (let i = 0; i < numSplits; i++) {
    const newPdf = await PDFDocument.create();
    const startPage = i * pagesPerSplit;
    const endPage = Math.min(startPage + pagesPerSplit, totalPages);

    onProgress(20 + (i / numSplits) * 70, `Creating split ${i + 1}/${numSplits}…`);

    // Copy pages to new PDF
    const pageIndices = Array.from({ length: endPage - startPage }, (_, idx) => startPage + idx);
    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);

    copiedPages.forEach(page => {
      newPdf.addPage(page);
    });

    const pdfBytes = await newPdf.save();
    splitPdfs.push({
      bytes: pdfBytes,
      startPage: startPage + 1,
      endPage: endPage,
      name: `split_${i + 1}_pages_${startPage + 1}-${endPage}`,
    });
  }

  onProgress(100, "Done!");
  return { splits: splitPdfs, totalPages, numSplits };
}

/* --------------------------------------------------------------
   PDF MERGING FUNCTION
   -------------------------------------------------------------- */
async function mergePDFs(fileObjects, onProgress) {
  onProgress(10, "Creating merged PDF…");
  const mergedPdf = await PDFDocument.create();
  let totalPages = 0;

  for (let i = 0; i < fileObjects.length; i++) {
    const fileObj = fileObjects[i];
    onProgress(10 + (i / fileObjects.length) * 80, `Merging ${fileObj.fileName}…`);

    const pdfDoc = await PDFDocument.load(fileObj.arrayBuffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();
    const pageIndices = Array.from({ length: pageCount }, (_, idx) => idx);

    const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach(page => {
      mergedPdf.addPage(page);
    });

    totalPages += pageCount;
  }

  onProgress(95, "Saving merged PDF…");
  const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
  onProgress(100, "Done!");

  return { bytes: mergedBytes, totalPages, success: true };
}

/* --------------------------------------------------------------
   PDF PAGE EXTRACTION FUNCTION
   -------------------------------------------------------------- */
async function extractPages(pdfBytes, selectedPageIndices, onProgress) {
  onProgress(10, "Loading PDF…");
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  if (selectedPageIndices.length === 0) {
    throw new Error("No pages selected for extraction");
  }

  // Validate page indices
  for (const pageIdx of selectedPageIndices) {
    if (pageIdx < 0 || pageIdx >= totalPages) {
      throw new Error(`Invalid page index: ${pageIdx + 1}. PDF has ${totalPages} pages.`);
    }
  }

  onProgress(30, "Creating new PDF with selected pages…");
  const newPdf = await PDFDocument.create();

  onProgress(50, `Extracting ${selectedPageIndices.length} page${selectedPageIndices.length !== 1 ? "s" : ""}…`);

  // Copy selected pages in order
  const copiedPages = await newPdf.copyPages(pdfDoc, selectedPageIndices);
  copiedPages.forEach(page => {
    newPdf.addPage(page);
  });

  onProgress(90, "Saving extracted PDF…");
  const extractedBytes = await newPdf.save({ useObjectStreams: true });
  onProgress(100, "Done!");

  return { bytes: extractedBytes, pageCount: selectedPageIndices.length, success: true };
}

/* ------------------- VALIDATION ------------------- */
function validatePDF(file) {
  if (!file) return { valid: false, error: "No file selected" };
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) return { valid: false, error: "Please select a valid PDF file" };
  if (file.size === 0) return { valid: false, error: "File is empty" };
  if (file.size > 500 * 1024 * 1024) return { valid: false, error: "File is too large (max 500 MB)" };
  return { valid: true };
}

/* ------------------- MAIN APP COMPONENT ------------------- */
function App() {
  /* ---------- Language ---------- */
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || "en";
  });

  React.useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const translations = {
    en: {
      brand: "PDF Multi-Tool",
      toolCompressor: "PDF Compressor",
      toolSplitter: "PDF Splitter",
      toolMerger: "PDF Merger",
      toolExtractor: "Page Extractor",
      selectTool: "Select a Tool",
      selectToolDesc: "Choose the PDF tool you want to use",

      // Compressor
      selectOrDrop: "Select or Drop PDF to Compress",
      dropHere: "Drop your PDF here",
      subtitle: "Fast, secure, client‑side compression",
      chooseFile: "Choose File",
      qualityLabel: "Compression Quality",
      qualityLow: "Max Compression",
      qualityHigh: "Max Quality",
      qualityDescription: "Lower quality = smaller file size, Higher quality = better visual fidelity",

      // Splitter
      selectOrDropSplit: "Select or Drop PDF to Split",
      subtitleSplit: "Split your PDF into multiple files",
      pagesPerSplit: "Pages per Split",
      pagesPerSplitDesc: "How many pages in each split PDF",
      splitPreview: "Split Preview",
      willCreate: "Will create",
      pdfs: "PDFs",
      pdf: "PDF",

      // Merger
      selectOrDropMerge: "Select or Drop PDFs to Merge",
      dropMultiple: "Drop your PDFs here",
      subtitleMerge: "Combine multiple PDFs into one file",
      chooseFiles: "Choose Files",
      mergeOrder: "Merge Order",
      fileSelected: "file selected",
      filesSelected: "files selected",
      moveUp: "Move up",
      moveDown: "Move down",
      removeThisFile: "Remove this file",
      startMerge: "Start Merge",
      addMoreFiles: "Add More Files",
      mergeAnother: "Merge Another Set",
      merged: "Merged",
      filesInto: "files into",
      totalSize: "Total Size",

      // Extractor
      selectOrDropExtract: "Select or Drop PDF to Extract Pages",
      subtitleExtract: "Choose specific pages to extract",
      selectPages: "Select Pages",
      selectedPages: "Selected Pages",
      noPages: "No pages selected",
      clickPages: "Click on pages to select/deselect them",
      extractPages: "Extract Pages",
      clearSelection: "Clear Selection",
      selectAll: "Select All",
      extractAnother: "Extract From Another File",
      extractSuccessful: "Extraction Successful!",
      extractComplete: "Extraction Complete",
      extracted: "Extracted",
      pagesExtracted: "pages",

      // Common
      originalSize: "Original size",
      pages: "pages",
      page: "page",
      removeFile: "Remove file",
      error: "Error",
      note: "Note",
      processing: "Processing",
      download: "Download",
      downloadAll: "Download All",
      backToTools: "Back to Tools",

      // Results
      compressionSuccessful: "Compression Successful!",
      compressionComplete: "Compression Complete",
      splitSuccessful: "Split Successful!",
      splitComplete: "Split Complete",
      mergeSuccessful: "Merge Successful!",
      mergeComplete: "Merge Complete",
      reducedBy: "Reduced by",
      originalSizeLabel: "Original Size",
      compressedSize: "Compressed Size",
      sizeReduction: "Size Reduction",
      bytesSaved: "Bytes Saved",
      targetLabel: "10 MB Target",
      met: "✓ Met",
      exceeded: "⚠ Exceeded",
      pageCount: "Page Count",
      compressAnother: "Compress Another File",
      splitAnother: "Split Another File",

      footer: "© 2026 PDF Multi-Tool. Free & Open Source.",
      githubText: "View on GitHub",
    },
    pt: {
      brand: "PDF Multi-Ferramenta",
      toolCompressor: "Compressor de PDF",
      toolSplitter: "Divisor de PDF",
      toolMerger: "Unir PDFs",
      toolExtractor: "Extrator de Páginas",
      selectTool: "Seleciona uma Ferramenta",
      selectToolDesc: "Escolhe a ferramenta de PDF que queres usar",

      // Compressor
      selectOrDrop: "Seleciona ou Arrasta o PDF para Comprimir",
      dropHere: "Larga o teu PDF aqui",
      subtitle: "Compressão rápida, segura e local",
      chooseFile: "Escolher Ficheiro",
      qualityLabel: "Qualidade de Compressão",
      qualityLow: "Compressão Máxima",
      qualityHigh: "Qualidade Máxima",
      qualityDescription: "Qualidade baixa = ficheiro mais pequeno, Qualidade alta = melhor fidelidade visual",

      // Splitter
      selectOrDropSplit: "Seleciona ou Arrasta o PDF para Dividir",
      subtitleSplit: "Divide o teu PDF em múltiplos ficheiros",
      pagesPerSplit: "Páginas por Divisão",
      pagesPerSplitDesc: "Quantas páginas em cada PDF dividido",
      splitPreview: "Pré-visualização da Divisão",
      willCreate: "Vai criar",
      pdfs: "PDFs",
      pdf: "PDF",

      // Merger
      selectOrDropMerge: "Seleciona ou Arrasta PDFs para Unir",
      dropMultiple: "Larga os teus PDFs aqui",
      subtitleMerge: "Combina vários PDFs num único ficheiro",
      chooseFiles: "Escolher Ficheiros",
      mergeOrder: "Ordem de União",
      fileSelected: "ficheiro selecionado",
      filesSelected: "ficheiros selecionados",
      moveUp: "Mover para cima",
      moveDown: "Mover para baixo",
      removeThisFile: "Remover este ficheiro",
      startMerge: "Iniciar União",
      addMoreFiles: "Adicionar Mais Ficheiros",
      mergeAnother: "Unir Outro Conjunto",
      merged: "Uniu",
      filesInto: "ficheiros em",
      totalSize: "Tamanho Total",

      // Extractor
      selectOrDropExtract: "Seleciona ou Arrasta PDF para Extrair Páginas",
      subtitleExtract: "Escolhe páginas específicas para extrair",
      selectPages: "Selecionar Páginas",
      selectedPages: "Páginas Selecionadas",
      noPages: "Nenhuma página selecionada",
      clickPages: "Clica nas páginas para selecionar/desselecionar",
      extractPages: "Extrair Páginas",
      clearSelection: "Limpar Seleção",
      selectAll: "Selecionar Todas",
      extractAnother: "Extrair de Outro Ficheiro",
      extractSuccessful: "Extração Bem-Sucedida!",
      extractComplete: "Extração Concluída",
      extracted: "Extraiu",
      pagesExtracted: "páginas",

      // Common
      originalSize: "Tamanho original",
      pages: "páginas",
      page: "página",
      removeFile: "Remover ficheiro",
      error: "Erro",
      note: "Nota",
      processing: "A processar",
      download: "Descarregar",
      downloadAll: "Descarregar Todos",
      backToTools: "Voltar às Ferramentas",

      // Results
      compressionSuccessful: "Compressão Bem-Sucedida!",
      compressionComplete: "Compressão Concluída",
      splitSuccessful: "Divisão Bem-Sucedida!",
      splitComplete: "Divisão Concluída",
      mergeSuccessful: "União Bem-Sucedida!",
      mergeComplete: "União Concluída",
      reducedBy: "Reduzido em",
      originalSizeLabel: "Tamanho Original",
      compressedSize: "Tamanho Comprimido",
      sizeReduction: "Redução de Tamanho",
      bytesSaved: "Bytes Poupados",
      targetLabel: "Meta de 10 MB",
      met: "✓ Atingida",
      exceeded: "⚠ Excedida",
      pageCount: "Número de Páginas",
      compressAnother: "Comprimir Outro Ficheiro",
      splitAnother: "Dividir Outro Ficheiro",

      footer: "© 2026 PDF Multi-Ferramenta. Gratuito e Código Aberto.",
      githubText: "Ver no GitHub",
    },
  };

  const t = translations[language];

  /* ---------- Theme ---------- */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  React.useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* ---------- Tool Selection ---------- */
  const [selectedTool, setSelectedTool] = useState(null); // 'compressor' or 'splitter' or 'merger'

  /* ---------- State ---------- */
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  const [originalSize, setOriginalSize] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  // Compressor specific
  const [quality, setQuality] = useState(60);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState(null);

  // Splitter specific
  const [pagesPerSplit, setPagesPerSplit] = useState(5);
  const [splitResults, setSplitResults] = useState(null);

  // Merger specific
  const [mergeFiles, setMergeFiles] = useState([]);
  const [mergedBlob, setMergedBlob] = useState(null);
  const [mergedSize, setMergedSize] = useState(0);

  // Extractor specific
  const [extractFile, setExtractFile] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [extractedBlob, setExtractedBlob] = useState(null);
  const [extractedSize, setExtractedSize] = useState(0);
  const [loadingPages, setLoadingPages] = useState(false);
  const [thumbnailZoom, setThumbnailZoom] = useState(150); // Default 150px

  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const TARGET_SIZE = 10 * 1024 * 1024; // 10 MB

  const formatBytes = useCallback(bytes => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }, []);

  /* ---------- File handling - COMPRESSOR ---------- */
  const handleCompressFile = async selectedFile => {
    const validation = validatePDF(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setWarning(null);
    setCompressedBlob(null);
    setOriginalSize(selectedFile.size);
    setProcessing(true);
    setProgress(0);
    setProgressMessage("Preparing…");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();

      const onProgress = (pct, msg) => {
        setProgress(Math.round(pct));
        setProgressMessage(msg);
      };

      const result = await compressPDFUnified(arrayBuffer, quality, onProgress);

      const blob = new Blob([result.bytes], { type: "application/pdf" });

      setCompressedBlob(blob);
      setCompressedSize(blob.size);
      setPageCount(result.pageCount);
      setProcessing(false);

      if (blob.size > TARGET_SIZE) {
        setWarning(
          `Compressed file is ${formatBytes(blob.size)} – still above the 10 MB target. ` +
            `The PDF may contain complex graphics that cannot be reduced further without quality loss.`,
        );
      } else if (blob.size >= selectedFile.size * 0.95) {
        setWarning(
          `Only a ${((1 - blob.size / selectedFile.size) * 100).toFixed(1)} % size reduction. ` + `The original PDF may already be optimised.`,
        );
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to compress PDF.");
      setProcessing(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  /* ---------- File handling - SPLITTER ---------- */
  const handleSplitFile = async selectedFile => {
    const validation = validatePDF(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setWarning(null);
    setSplitResults(null);
    setOriginalSize(selectedFile.size);
    setProcessing(true);
    setProgress(0);
    setProgressMessage("Preparing…");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();

      const onProgress = (pct, msg) => {
        setProgress(Math.round(pct));
        setProgressMessage(msg);
      };

      const result = await splitPDF(arrayBuffer, pagesPerSplit, onProgress);

      setSplitResults(result);
      setPageCount(result.totalPages);
      setProcessing(false);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to split PDF.");
      setProcessing(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  /* ---------- Handle file selection based on tool ---------- */
  const handleFileSelect = selectedFile => {
    if (selectedTool === "compressor") {
      handleCompressFile(selectedFile);
    } else if (selectedTool === "splitter") {
      handleSplitFile(selectedFile);
    } else if (selectedTool === "extractor") {
      handleExtractFile(selectedFile);
    }
  };

  /* ---------- Recompress with new quality ---------- */
  const handleRecompress = async () => {
    if (!file) return;
    handleCompressFile(file);
  };

  /* ---------- Re-split with new pages per split ---------- */
  const handleResplit = async () => {
    if (!file) return;
    handleSplitFile(file);
  };

  /* ---------- File handling - MERGER ---------- */
  const handleMergeFiles = async selectedFiles => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = [];
    let totalSize = 0;

    for (const file of selectedFiles) {
      const validation = validatePDF(file);
      if (!validation.valid) {
        setError(`${file.name}: ${validation.error}`);
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      newFiles.push({
        file,
        arrayBuffer,
        fileName: file.name,
        size: file.size,
        id: Date.now() + Math.random(),
      });
      totalSize += file.size;
    }

    if (newFiles.length > 0) {
      setMergeFiles(prev => [...prev, ...newFiles]);
      setOriginalSize(prev => prev + totalSize);
    }
  };

  const handleRemoveMergeFile = id => {
    setMergeFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        setOriginalSize(prevSize => prevSize - fileToRemove.size);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleMoveMergeFile = (id, direction) => {
    setMergeFiles(prev => {
      const index = prev.findIndex(f => f.id === id);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newFiles = [...prev];
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const handleStartMerge = async () => {
    if (mergeFiles.length < 2) {
      setError("Please select at least 2 PDF files to merge");
      return;
    }

    setError(null);
    setWarning(null);
    setMergedBlob(null);
    setProcessing(true);
    setProgress(0);
    setProgressMessage("Preparing…");

    try {
      const onProgress = (pct, msg) => {
        setProgress(Math.round(pct));
        setProgressMessage(msg);
      };

      const result = await mergePDFs(mergeFiles, onProgress);

      const blob = new Blob([result.bytes], { type: "application/pdf" });

      setMergedBlob(blob);
      setMergedSize(blob.size);
      setPageCount(result.totalPages);
      setProcessing(false);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to merge PDFs.");
      setProcessing(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  /* ---------- File handling - EXTRACTOR ---------- */
  const handleExtractFile = async selectedFile => {
    const validation = validatePDF(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setExtractFile(selectedFile);
    setError(null);
    setWarning(null);
    setExtractedBlob(null);
    setSelectedPages(new Set());
    setOriginalSize(selectedFile.size);
    setLoadingPages(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();

      // Load PDF with pdf.js for rendering
      const uint8 = new Uint8Array(arrayBuffer);
      const loadingTask = pdfjsLib.getDocument({ data: uint8, disableAutoFetch: true });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      setPageCount(numPages);

      // Render all pages as thumbnails
      const pages = [];
      const SCALE = 1.5; // Increased scale for better quality (was 0.3)

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: SCALE });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Use PNG for better quality instead of JPEG
        const dataUrl = canvas.toDataURL("image/png");
        canvas.remove();

        pages.push({
          pageNumber: pageNum,
          thumbnail: dataUrl,
          width: viewport.width,
          height: viewport.height,
        });
      }

      setPdfPages(pages);
      setLoadingPages(false);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to load PDF.");
      setLoadingPages(false);
    }
  };

  const togglePageSelection = pageNumber => {
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageNumber)) {
        newSet.delete(pageNumber);
      } else {
        newSet.add(pageNumber);
      }
      return newSet;
    });
  };

  const handleSelectAllPages = () => {
    if (selectedPages.size === pageCount) {
      setSelectedPages(new Set());
    } else {
      setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)));
    }
  };

  const handleClearSelection = () => {
    setSelectedPages(new Set());
  };

  const handleZoomIn = () => {
    setThumbnailZoom(prev => Math.min(prev + 50, 400)); // Max 400px
  };

  const handleZoomOut = () => {
    setThumbnailZoom(prev => Math.max(prev - 50, 100)); // Min 100px
  };

  const handleStartExtraction = async () => {
    if (selectedPages.size === 0) {
      setError("Please select at least one page to extract");
      return;
    }

    if (!extractFile) {
      setError("No file loaded");
      return;
    }

    setError(null);
    setWarning(null);
    setExtractedBlob(null);
    setProcessing(true);
    setProgress(0);
    setProgressMessage("Preparing…");

    try {
      const arrayBuffer = await extractFile.arrayBuffer();

      const onProgress = (pct, msg) => {
        setProgress(Math.round(pct));
        setProgressMessage(msg);
      };

      // Convert page numbers to 0-based indices and sort them
      const pageIndices = Array.from(selectedPages)
        .sort((a, b) => a - b)
        .map(p => p - 1);

      const result = await extractPages(arrayBuffer, pageIndices, onProgress);

      const blob = new Blob([result.bytes], { type: "application/pdf" });

      setExtractedBlob(blob);
      setExtractedSize(blob.size);
      setProcessing(false);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to extract pages.");
      setProcessing(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  /* ---------- Download - MERGER ---------- */
  const handleDownloadMerged = () => {
    if (!mergedBlob) return;
    try {
      const url = URL.createObjectURL(mergedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (e) {
      console.error(e);
      setError("Failed to download file. Please try again.");
    }
  };

  /* ---------- Download - COMPRESSOR ---------- */
  const handleDownloadCompressed = () => {
    if (!compressedBlob || !file) return;
    try {
      const url = URL.createObjectURL(compressedBlob);
      const a = document.createElement("a");
      a.href = url;
      const name = file.name.replace(/\.pdf$/i, "");
      a.download = `${name}_compressed.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (e) {
      console.error(e);
      setError("Failed to download file. Please try again.");
    }
  };

  /* ---------- Download - SPLITTER ---------- */
  const handleDownloadSplit = splitData => {
    try {
      const blob = new Blob([splitData.bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const baseName = file.name.replace(/\.pdf$/i, "");
      a.download = `${baseName}_${splitData.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (e) {
      console.error(e);
      setError("Failed to download file. Please try again.");
    }
  };

  const handleDownloadAllSplits = () => {
    if (!splitResults) return;
    splitResults.splits.forEach(split => {
      setTimeout(() => handleDownloadSplit(split), 100);
    });
  };

  /* ---------- Download - EXTRACTOR ---------- */
  const handleDownloadExtracted = () => {
    if (!extractedBlob || !extractFile) return;
    try {
      const url = URL.createObjectURL(extractedBlob);
      const a = document.createElement("a");
      a.href = url;
      const name = extractFile.name.replace(/\.pdf$/i, "");
      const pagesList = Array.from(selectedPages)
        .sort((a, b) => a - b)
        .join("_");
      a.download = `${name}_pages_${pagesList}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (e) {
      console.error(e);
      setError("Failed to download file. Please try again.");
    }
  };

  /* ---------- Reset ---------- */
  const handleReset = () => {
    setFile(null);
    setCompressedBlob(null);
    setSplitResults(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setPageCount(0);
    setError(null);
    setMergeFiles([]);
    setMergedBlob(null);
    setMergedSize(0);
    setExtractFile(null);
    setPdfPages([]);
    setSelectedPages(new Set());
    setExtractedBlob(null);
    setExtractedSize(0);
    setLoadingPages(false);
    setThumbnailZoom(150);
    setWarning(null);
    setProgress(0);
    setProgressMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBackToTools = () => {
    handleReset();
    setSelectedTool(null);
  };

  /* ---------- Drag & Drop ---------- */
  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsDragging(true);
  };
  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    const files = e.dataTransfer.files;

    if (files && files.length > 0) {
      if (selectedTool === "merger") {
        handleMergeFiles(files);
      } else {
        handleFileSelect(files[0]);
      }
    }
  };

  /* ---------- Statistics ---------- */
  const compressionRatio = originalSize && compressedSize ? ((1 - compressedSize / originalSize) * 100).toFixed(1) : 0;
  const savedBytes = originalSize - compressedSize;
  const metTarget = compressedSize <= TARGET_SIZE;

  const numSplits = pageCount ? Math.ceil(pageCount / pagesPerSplit) : 0;

  /*===================== RENDER =====================*/
  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      {/* ---------- Navbar ---------- */}
      <nav className='navbar'>
        <div className='nav-brand'>
          <img src={ConectysLogo} alt='Conectys Logo' className='brand-logo' />
          <span className='brand-text'>{t.brand}</span>
        </div>
        <div className='nav-actions'>
          <button
            className='btn-icon'
            onClick={() => setLanguage(language === "en" ? "pt" : "en")}
            aria-label='Toggle language'
            title={language === "en" ? "Mudar para Português" : "Switch to English"}
          >
            {language === "en" ? <IconPortugueseFlag /> : <IconEnglishFlag />}
          </button>
          <button
            className='btn-icon'
            onClick={() => setDarkMode(!darkMode)}
            aria-label='Toggle theme'
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </nav>

      {/* ---------- Main content ---------- */}
      <main className='main-content'>
        <div className='compress-container'>
          {/* ==== Tool Selection ==== */}
          {!selectedTool && !file && mergeFiles.length === 0 && (
            <div className='tool-selection'>
              <h2>{t.selectTool}</h2>
              <p className='tool-selection-desc'>{t.selectToolDesc}</p>
              <div className='tool-buttons'>
                <button className='tool-button' onClick={() => setSelectedTool("compressor")}>
                  <IconCompress />
                  <span>{t.toolCompressor}</span>
                </button>
                <button className='tool-button' onClick={() => setSelectedTool("splitter")}>
                  <IconSplit />
                  <span>{t.toolSplitter}</span>
                </button>
                <button className='tool-button' onClick={() => setSelectedTool("merger")}>
                  <IconMerge />
                  <span>{t.toolMerger}</span>
                </button>
                <button className='tool-button' onClick={() => setSelectedTool("extractor")}>
                  <IconExtract />
                  <span>{t.toolExtractor}</span>
                </button>
              </div>
            </div>
          )}

          {/* ==== COMPRESSOR Tool ==== */}
          {selectedTool === "compressor" && !file && (
            <div
              className={`upload-area ${isDragging ? "dragging" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type='file' accept='.pdf,application/pdf' hidden onChange={e => handleFileSelect(e.target.files?.[0])} />
              <IconUpload />
              <h3>{t.selectOrDrop}</h3>
              <p className='upload-subtitle'>{isDragging ? t.dropHere : t.subtitle}</p>

              <div className='quality-control'>
                <label htmlFor='quality-slider'>
                  <strong>{t.qualityLabel}:</strong> {quality}%
                </label>
                <div className='quality-slider-container'>
                  <span className='quality-label-left'>{t.qualityLow}</span>
                  <input
                    id='quality-slider'
                    type='range'
                    min='0'
                    max='100'
                    value={quality}
                    onChange={e => setQuality(parseInt(e.target.value))}
                    className='quality-slider'
                    onClick={e => e.stopPropagation()}
                  />
                  <span className='quality-label-right'>{t.qualityHigh}</span>
                </div>
                <p className='quality-description'>{t.qualityDescription}</p>
              </div>

              <button
                className='btn-primary btn-upload'
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                {t.chooseFile}
              </button>

              <button
                className='btn-secondary btn-back'
                onClick={e => {
                  e.stopPropagation();
                  setSelectedTool(null);
                }}
              >
                {t.backToTools}
              </button>
            </div>
          )}

          {/* ==== SPLITTER Tool ==== */}
          {selectedTool === "splitter" && !file && (
            <div
              className={`upload-area ${isDragging ? "dragging" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type='file' accept='.pdf,application/pdf' hidden onChange={e => handleFileSelect(e.target.files?.[0])} />
              <IconUpload />
              <h3>{t.selectOrDropSplit}</h3>
              <p className='upload-subtitle'>{isDragging ? t.dropHere : t.subtitleSplit}</p>

              <div className='quality-control'>
                <label htmlFor='pages-per-split'>
                  <strong>{t.pagesPerSplit}:</strong> {pagesPerSplit}
                </label>
                <div className='quality-slider-container'>
                  <span className='quality-label-left'>1</span>
                  <input
                    id='pages-per-split'
                    type='range'
                    min='1'
                    max='50'
                    value={pagesPerSplit}
                    onChange={e => setPagesPerSplit(parseInt(e.target.value))}
                    className='quality-slider'
                    onClick={e => e.stopPropagation()}
                  />
                  <span className='quality-label-right'>50</span>
                </div>
                <p className='quality-description'>{t.pagesPerSplitDesc}</p>
              </div>

              <button
                className='btn-primary btn-upload'
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                {t.chooseFile}
              </button>

              <button
                className='btn-secondary btn-back'
                onClick={e => {
                  e.stopPropagation();
                  setSelectedTool(null);
                }}
              >
                {t.backToTools}
              </button>
            </div>
          )}

          {/* ==== MERGER Tool ==== */}
          {selectedTool === "merger" && mergeFiles.length === 0 && (
            <div
              className={`upload-area ${isDragging ? "dragging" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type='file' accept='.pdf,application/pdf' multiple hidden onChange={e => handleMergeFiles(e.target.files)} />
              <IconUpload />
              <h3>{t.selectOrDropMerge}</h3>
              <p className='upload-subtitle'>{isDragging ? t.dropMultiple : t.subtitleMerge}</p>

              <button
                className='btn-primary btn-upload'
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                {t.chooseFiles}
              </button>

              <button
                className='btn-secondary btn-back'
                onClick={e => {
                  e.stopPropagation();
                  setSelectedTool(null);
                }}
              >
                {t.backToTools}
              </button>
            </div>
          )}

          {/* ==== MERGER File List ==== */}
          {selectedTool === "merger" && mergeFiles.length > 0 && !mergedBlob && (
            <div className='card compression-card'>
              <div className='merge-header'>
                <h3>{t.mergeOrder}</h3>
                <p>
                  {mergeFiles.length} {mergeFiles.length === 1 ? t.fileSelected : t.filesSelected}
                </p>
              </div>

              <div className='merge-file-list'>
                {mergeFiles.map((mergeFile, index) => (
                  <div key={mergeFile.id} className='merge-file-item'>
                    <div className='merge-file-number'>{index + 1}</div>
                    <div className='merge-file-info'>
                      <IconFile />
                      <div>
                        <p className='merge-file-name'>{mergeFile.fileName}</p>
                        <p className='merge-file-size'>{formatBytes(mergeFile.size)}</p>
                      </div>
                    </div>
                    <div className='merge-file-actions'>
                      <button
                        className='btn-icon'
                        onClick={() => handleMoveMergeFile(mergeFile.id, "up")}
                        disabled={index === 0 || processing}
                        title={t.moveUp}
                      >
                        ▲
                      </button>
                      <button
                        className='btn-icon'
                        onClick={() => handleMoveMergeFile(mergeFile.id, "down")}
                        disabled={index === mergeFiles.length - 1 || processing}
                        title={t.moveDown}
                      >
                        ▼
                      </button>
                      <button
                        className='btn-icon btn-danger'
                        onClick={() => handleRemoveMergeFile(mergeFile.id)}
                        disabled={processing}
                        title={t.removeThisFile}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ---- Progress while processing ---- */}
              {processing && (
                <div className='progress-section'>
                  <div className='progress-bar'>
                    <div className='progress-fill' style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className='progress-info'>
                    <p className='progress-text'>{progressMessage}</p>
                    <p className='progress-percent'>{progress}%</p>
                  </div>
                </div>
              )}

              {/* ---- Error ---- */}
              {error && (
                <div className='error-message'>
                  <IconAlert />
                  <div>
                    <strong>{t.error}</strong>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {!processing && (
                <div className='action-buttons'>
                  <button className='btn-primary' onClick={handleStartMerge} disabled={mergeFiles.length < 2}>
                    <IconMerge />
                    <span>{t.startMerge}</span>
                  </button>
                  <button className='btn-secondary' onClick={() => fileInputRef.current?.click()}>
                    {t.addMoreFiles}
                  </button>
                  <button className='btn-secondary' onClick={handleBackToTools}>
                    {t.backToTools}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==== MERGER Result ==== */}
          {selectedTool === "merger" && mergedBlob && !processing && !error && (
            <div className='card compression-card'>
              <div className='result-section'>
                <div className='success-banner target-met'>
                  <IconCheck />
                  <div>
                    <strong>{t.mergeSuccessful}</strong>
                    <p>
                      {t.merged} {mergeFiles.length} {t.filesInto} 1 PDF
                    </p>
                  </div>
                </div>

                <div className='result-stats'>
                  <div className='stat-item'>
                    <span className='stat-label'>{t.totalSize}</span>
                    <span className='stat-value'>{formatBytes(mergedSize)}</span>
                  </div>

                  <div className='stat-item'>
                    <span className='stat-label'>{t.pageCount}</span>
                    <span className='stat-value'>{pageCount}</span>
                  </div>
                </div>

                <div className='action-buttons'>
                  <button className='btn-download btn-primary' onClick={handleDownloadMerged}>
                    <IconDownload />
                    <span>{t.download}</span>
                  </button>
                  <button className='btn-action btn-secondary' onClick={handleBackToTools}>
                    <IconMerge />
                    <span>{t.mergeAnother}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==== EXTRACTOR Tool ==== */}
          {selectedTool === "extractor" && !extractFile && (
            <div
              className={`upload-area ${isDragging ? "dragging" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type='file' accept='.pdf,application/pdf' hidden onChange={e => handleFileSelect(e.target.files?.[0])} />
              <IconUpload />
              <h3>{t.selectOrDropExtract}</h3>
              <p className='upload-subtitle'>{isDragging ? t.dropHere : t.subtitleExtract}</p>

              <button
                className='btn-primary btn-upload'
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                {t.chooseFile}
              </button>

              <button
                className='btn-secondary btn-back'
                onClick={e => {
                  e.stopPropagation();
                  setSelectedTool(null);
                }}
              >
                {t.backToTools}
              </button>
            </div>
          )}

          {/* ==== EXTRACTOR Page Selection ==== */}
          {selectedTool === "extractor" && extractFile && !extractedBlob && (
            <div className='card compression-card'>
              <div className='file-info'>
                <IconFile />
                <div className='file-details'>
                  <h3>{extractFile.name}</h3>
                  <p>
                    {t.originalSize}: {formatBytes(originalSize)}
                  </p>
                  {pageCount > 0 && (
                    <p className='page-count'>
                      {pageCount} {pageCount !== 1 ? t.pages : t.page}
                    </p>
                  )}
                </div>
                <button className='btn-icon btn-danger' onClick={handleBackToTools} title={t.removeFile} disabled={processing || loadingPages}>
                  <IconTrash />
                </button>
              </div>

              {loadingPages && (
                <div className='progress-section'>
                  <div className='progress-info'>
                    <p className='progress-text'>Loading pages...</p>
                  </div>
                </div>
              )}

              {!loadingPages && pdfPages.length > 0 && (
                <>
                  <div className='extractor-header'>
                    <h4>{t.selectPages}</h4>
                    <p className='extractor-subtitle'>{t.clickPages}</p>
                    <div className='extractor-stats'>
                      <span className='selected-count'>
                        {t.selectedPages}: <strong>{selectedPages.size}</strong> / {pageCount}
                      </span>
                    </div>
                  </div>

                  <div className='extractor-controls'>
                    <div className='extractor-controls-left'>
                      <button className='btn-secondary btn-small' onClick={handleSelectAllPages} disabled={processing}>
                        {selectedPages.size === pageCount ? t.clearSelection : t.selectAll}
                      </button>
                      {selectedPages.size > 0 && (
                        <button className='btn-secondary btn-small' onClick={handleClearSelection} disabled={processing}>
                          {t.clearSelection}
                        </button>
                      )}
                    </div>
                    <div className='extractor-controls-right'>
                      <span className='zoom-label'>Size: {thumbnailZoom}px</span>
                      <button className='btn-icon btn-zoom' onClick={handleZoomOut} disabled={processing || thumbnailZoom <= 100} title='Zoom Out'>
                        <IconZoomOut />
                      </button>
                      <button className='btn-icon btn-zoom' onClick={handleZoomIn} disabled={processing || thumbnailZoom >= 400} title='Zoom In'>
                        <IconZoomIn />
                      </button>
                    </div>
                  </div>

                  <div className='pdf-page-grid' style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${thumbnailZoom}px, 1fr))` }}>
                    {pdfPages.map(page => (
                      <div
                        key={page.pageNumber}
                        className={`pdf-page-thumbnail ${selectedPages.has(page.pageNumber) ? "selected" : ""}`}
                        onClick={() => !processing && togglePageSelection(page.pageNumber)}
                      >
                        <div className='page-number'>{page.pageNumber}</div>
                        <img src={page.thumbnail} alt={`Page ${page.pageNumber}`} />
                        {selectedPages.has(page.pageNumber) && (
                          <div className='page-check'>
                            <IconCheck />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {processing && (
                    <div className='progress-section'>
                      <div className='progress-bar'>
                        <div className='progress-fill' style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className='progress-info'>
                        <p className='progress-text'>{progressMessage}</p>
                        <p className='progress-percent'>{progress}%</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className='error-message'>
                      <IconAlert />
                      <div>
                        <strong>{t.error}</strong>
                        <p>{error}</p>
                      </div>
                    </div>
                  )}

                  {!processing && (
                    <div className='action-buttons'>
                      <button className='btn-primary' onClick={handleStartExtraction} disabled={selectedPages.size === 0}>
                        <IconExtract />
                        <span>
                          {t.extractPages} ({selectedPages.size})
                        </span>
                      </button>
                      <button className='btn-secondary' onClick={handleBackToTools}>
                        {t.backToTools}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ==== EXTRACTOR Result ==== */}
          {selectedTool === "extractor" && extractedBlob && !processing && !error && (
            <div className='card compression-card'>
              <div className='result-section'>
                <div className='success-banner target-met'>
                  <IconCheck />
                  <div>
                    <strong>{t.extractSuccessful}</strong>
                    <p>
                      {t.extracted} {selectedPages.size} {selectedPages.size !== 1 ? t.pagesExtracted : t.page}
                    </p>
                  </div>
                </div>

                <div className='result-stats'>
                  <div className='stat-item'>
                    <span className='stat-label'>{t.originalSizeLabel}</span>
                    <span className='stat-value'>{formatBytes(originalSize)}</span>
                  </div>

                  <div className='stat-item'>
                    <span className='stat-label'>Extracted Size</span>
                    <span className='stat-value'>{formatBytes(extractedSize)}</span>
                  </div>

                  <div className='stat-item'>
                    <span className='stat-label'>{t.pageCount}</span>
                    <span className='stat-value'>{selectedPages.size}</span>
                  </div>
                </div>

                <div className='action-buttons'>
                  <button className='btn-download btn-primary' onClick={handleDownloadExtracted}>
                    <IconDownload />
                    <span>{t.download}</span>
                  </button>
                  <button className='btn-action btn-secondary' onClick={handleBackToTools}>
                    <IconExtract />
                    <span>{t.extractAnother}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==== Processing Card ==== */}
          {file && (
            <div className='card compression-card'>
              {/* ---- File header ---- */}
              <div className='file-info'>
                <IconFile />
                <div className='file-details'>
                  <h3>{file.name}</h3>
                  <p>
                    {t.originalSize}: {formatBytes(originalSize)}
                  </p>
                  {pageCount > 0 && (
                    <p className='page-count'>
                      {pageCount} {pageCount !== 1 ? t.pages : t.page}
                    </p>
                  )}
                </div>
                <button className='btn-icon btn-danger' onClick={handleBackToTools} title={t.removeFile} disabled={processing}>
                  <IconTrash />
                </button>
              </div>

              {/* ---- Quality/Pages Slider for COMPRESSOR ---- */}
              {selectedTool === "compressor" && !processing && (
                <div className='quality-control-card'>
                  <label htmlFor='quality-slider-card'>
                    <strong>{t.qualityLabel}:</strong> {quality}%
                  </label>
                  <div className='quality-slider-container'>
                    <span className='quality-label-left'>{t.qualityLow}</span>
                    <input
                      id='quality-slider-card'
                      type='range'
                      min='0'
                      max='100'
                      value={quality}
                      onChange={e => setQuality(parseInt(e.target.value))}
                      className='quality-slider'
                    />
                    <span className='quality-label-right'>{t.qualityHigh}</span>
                  </div>
                  <p className='quality-description'>{t.qualityDescription}</p>
                  <button className='btn-secondary btn-recompress' onClick={handleRecompress} disabled={processing}>
                    <IconCompress />
                    <span>Recompress with new quality</span>
                  </button>
                </div>
              )}

              {/* ---- Pages per Split for SPLITTER ---- */}
              {selectedTool === "splitter" && !processing && (
                <div className='quality-control-card'>
                  <label htmlFor='pages-per-split-card'>
                    <strong>{t.pagesPerSplit}:</strong> {pagesPerSplit}
                  </label>
                  <div className='quality-slider-container'>
                    <span className='quality-label-left'>1</span>
                    <input
                      id='pages-per-split-card'
                      type='range'
                      min='1'
                      max={pageCount || 50}
                      value={pagesPerSplit}
                      onChange={e => setPagesPerSplit(parseInt(e.target.value))}
                      className='quality-slider'
                    />
                    <span className='quality-label-right'>{pageCount || 50}</span>
                  </div>
                  <p className='quality-description'>{t.pagesPerSplitDesc}</p>

                  {pageCount > 0 && (
                    <div className='split-preview'>
                      <p>
                        <strong>{t.splitPreview}:</strong>
                      </p>
                      <p>
                        {t.willCreate} <strong>{numSplits}</strong> {numSplits !== 1 ? t.pdfs : t.pdf}
                      </p>
                    </div>
                  )}

                  <button className='btn-secondary btn-recompress' onClick={handleResplit} disabled={processing}>
                    <IconSplit />
                    <span>Re-split with new page count</span>
                  </button>
                </div>
              )}

              {/* ---- Progress while processing ---- */}
              {processing && (
                <div className='progress-section'>
                  <div className='progress-bar'>
                    <div className='progress-fill' style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className='progress-info'>
                    <p className='progress-text'>{progressMessage}</p>
                    <p className='progress-percent'>{progress}%</p>
                  </div>
                </div>
              )}

              {/* ---- Error ---- */}
              {error && (
                <div className='error-message'>
                  <IconAlert />
                  <div>
                    <strong>{t.error}</strong>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* ---- Warning ---- */}
              {warning && !error && (
                <div className='warning-message'>
                  <IconInfo />
                  <div>
                    <strong>{t.note}</strong>
                    <p>{warning}</p>
                  </div>
                </div>
              )}

              {/* ---- COMPRESSOR Result ---- */}
              {selectedTool === "compressor" && compressedBlob && !processing && !error && (
                <div className='result-section'>
                  <div className={`success-banner ${metTarget ? "target-met" : ""}`}>
                    {metTarget ? <IconCheck /> : <IconInfo />}
                    <div>
                      <strong>{metTarget ? t.compressionSuccessful : t.compressionComplete}</strong>
                      <p>
                        {t.reducedBy} {formatBytes(savedBytes)} ({compressionRatio}%)
                      </p>
                    </div>
                  </div>

                  {metTarget && language === "pt" && (
                    <div style={{ textAlign: "center", margin: "20px 0" }}>
                      <img src={RonaldoGif} alt='Cristiano Ronaldo SIUUU' style={{ maxWidth: "300px", borderRadius: "10px" }} />
                    </div>
                  )}

                  <div className='result-stats'>
                    <div className='stat-item'>
                      <span className='stat-label'>{t.originalSizeLabel}</span>
                      <span className='stat-value'>{formatBytes(originalSize)}</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>{t.compressedSize}</span>
                      <span className={`stat-value ${metTarget ? "success" : "warning"}`}>{formatBytes(compressedSize)}</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>{t.sizeReduction}</span>
                      <span className='stat-value success'>{compressionRatio}%</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>{t.bytesSaved}</span>
                      <span className='stat-value'>{formatBytes(savedBytes)}</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>{t.targetLabel}</span>
                      <span className={`stat-value ${metTarget ? "success" : "warning"}`}>{metTarget ? t.met : t.exceeded}</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>{t.pageCount}</span>
                      <span className='stat-value'>{pageCount}</span>
                    </div>
                  </div>

                  <div className='action-buttons'>
                    <button className='btn-download btn-primary' onClick={handleDownloadCompressed}>
                      <IconDownload />
                      <span>{t.download}</span>
                    </button>
                    <button className='btn-action btn-secondary' onClick={handleBackToTools}>
                      <IconCompress />
                      <span>{t.compressAnother}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ---- SPLITTER Result ---- */}
              {selectedTool === "splitter" && splitResults && !processing && !error && (
                <div className='result-section'>
                  <div className='success-banner target-met'>
                    <IconCheck />
                    <div>
                      <strong>{t.splitSuccessful}</strong>
                      <p>
                        Created {splitResults.numSplits} PDF{splitResults.numSplits !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className='split-results'>
                    <h4>Split Files:</h4>
                    {splitResults.splits.map((split, idx) => (
                      <div key={idx} className='split-item'>
                        <div className='split-info'>
                          <IconFile />
                          <div>
                            <p className='split-name'>
                              Split {idx + 1}: Pages {split.startPage}-{split.endPage}
                            </p>
                            <p className='split-size'>{formatBytes(split.bytes.length)}</p>
                          </div>
                        </div>
                        <button className='btn-icon btn-primary' onClick={() => handleDownloadSplit(split)} title={t.download}>
                          <IconDownload />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className='action-buttons'>
                    <button className='btn-download btn-primary' onClick={handleDownloadAllSplits}>
                      <IconDownload />
                      <span>{t.downloadAll}</span>
                    </button>
                    <button className='btn-action btn-secondary' onClick={handleBackToTools}>
                      <IconSplit />
                      <span>{t.splitAnother}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className='footer'>
        <div className='footer-content'>
          <p>{t.footer}</p>
          <a
            href='https://github.com/Joaosilva27/pdf-compressor'
            target='_blank'
            rel='noopener noreferrer'
            className='github-link'
            aria-label='GitHub Repository'
          >
            <IconGitHub />
            <span>{t.githubText}</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
