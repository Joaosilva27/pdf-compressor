import React, { useState, useRef, useCallback } from "react";
import "./App.css";
import ConectysLogo from "./conectys.png";
import { PDFDocument, PDFName, PDFDict, PDFRawStream } from "pdf-lib";

/* ------------------- PDF‑JS IMPORT ------------------- */
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Use local worker file from public folder (works for both local and GitHub Pages)
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

/* ------------------- ICON COMPONENTS ------------------- */
// … (your Icon components – unchanged) …
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

/**
 * Re‑encode an image using a hidden canvas.
 *
 * @param {Uint8Array} imgBytes   Raw bytes from the PDF (already decoded).
 * @param {boolean} isJpeg        true if the original filter is DCTDecode.
 * @param {number} maxDim         Max width/height (pixels).
 * @param {number} jpegQuality    JPEG quality (0‑1).
 *
 * @returns {Uint8Array} New JPEG bytes.
 */
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

  // Down‑scale if needed
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
   1️⃣  Fast (image‑only) compression – primary path
   -------------------------------------------------------------- */
async function compressPDFFast(pdfBytes, onProgress) {
  const MAX_DIMENSION = 1500; // px
  const JPEG_QUALITY = 0.6; // 60 %

  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const pageCount = pdfDoc.getPageCount();

  // 1️⃣ Strip metadata
  onProgress(5, "Stripping metadata…");
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setCreator("");
  pdfDoc.setProducer("");
  pdfDoc.setKeywords([]);
  pdfDoc.setCreationDate(new Date(0));
  pdfDoc.setModificationDate(new Date(0));

  // 2️⃣ Clean catalog
  onProgress(15, "Cleaning catalog…");
  const catalog = pdfDoc.catalog;
  ["Metadata", "PieceInfo", "StructTreeRoot", "SpiderInfo", "OutputIntents", "MarkInfo"].forEach(key => {
    try {
      catalog.delete(PDFName.of(key));
    } catch (_) {}
  });

  // 3️⃣ Re‑encode image XObjects
  onProgress(30, "Optimising images…");
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const resources = page.node.Resources();
    const xObjDict = resources.lookupMaybe(PDFName.of("XObject"));
    if (!xObjDict) continue;

    const entries = xObjDict instanceof PDFDict ? xObjDict.entries() : [];

    for (const [key, ref] of entries) {
      const obj = pdfDoc.context.lookup(ref);
      if (!obj || typeof obj.getContents !== "function") continue; // not a stream

      const subtype = obj.dict.get(PDFName.of("Subtype"));
      if (!subtype || subtype.toString() !== "/Image") continue; // not an image

      const filter = obj.dict.get(PDFName.of("Filter"));
      const filterStr = filter?.toString() ?? "";
      const isJpeg = filterStr.includes("DCTDecode");

      const imgBytes = obj.getContents(); // already decoded

      try {
        const newBytes = await reEncodeImage(imgBytes, isJpeg, MAX_DIMENSION, JPEG_QUALITY);
        obj.setContents(newBytes);
        obj.dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
      } catch (e) {
        console.warn(`Failed to re‑encode image ${key}:`, e);
      }
    }

    // progress: 30 % → 70 %
    onProgress(30 + ((i + 1) / pageCount) * 40, `Optimised page ${i + 1}/${pageCount}`);
  }

  // 4️⃣ Save
  onProgress(85, "Saving compressed PDF…");
  const compressed = await pdfDoc.save({ useObjectStreams: true });
  onProgress(100, "Done!");
  return { bytes: compressed, pageCount, success: true };
}

/* --------------------------------------------------------------
   2️⃣  Raster fallback – uses pdfjs to render each page
   -------------------------------------------------------------- */
async function compressPDFRaster(pdfBytes, onProgress) {
  const uint8 = new Uint8Array(pdfBytes);
  const loadingTask = pdfjsLib.getDocument({ data: uint8, disableAutoFetch: true });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;

  async function rasterisePage(pageNumber) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
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

/* --------------------------------------------------------------
   Unified entry point – try fast, fall back to raster
   -------------------------------------------------------------- */
async function compressPDFUnified(pdfBytes, onProgress) {
  try {
    return await compressPDFFast(pdfBytes, onProgress);
  } catch (fastErr) {
    console.warn("Fast compression failed, falling back to rasterisation:", fastErr);
    try {
      return await compressPDFRaster(pdfBytes, onProgress);
    } catch (rasterErr) {
      console.error("Raster fallback also failed:", rasterErr);
      throw new Error(`Both compression methods failed – ${rasterErr instanceof Error ? rasterErr.message : rasterErr}`);
    }
  }
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
  /* ---------- Theme ---------- */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  React.useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* ---------- State ---------- */
  const [file, setFile] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

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

  /* ---------- File handling ---------- */
  const handleFileSelect = async selectedFile => {
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
    setCompressing(true);
    setProgress(0);
    setProgressMessage("Preparing…");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();

      const onProgress = (pct, msg) => {
        setProgress(Math.round(pct));
        setProgressMessage(msg);
      };

      const result = await compressPDFUnified(arrayBuffer, onProgress);

      const blob = new Blob([result.bytes], { type: "application/pdf" });

      setCompressedBlob(blob);
      setCompressedSize(blob.size);
      setPageCount(result.pageCount);
      setCompressing(false);

      // ---- Warnings -------------------------------------------------
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
      setCompressing(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  /* ---------- Download ---------- */
  const handleDownload = () => {
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

  /* ---------- Reset ---------- */
  const handleReset = () => {
    setFile(null);
    setCompressedBlob(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setPageCount(0);
    setError(null);
    setWarning(null);
    setProgress(0);
    setProgressMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (files && files.length > 0) handleFileSelect(files[0]);
  };

  /* ---------- Statistics ---------- */
  const compressionRatio = originalSize ? ((1 - compressedSize / originalSize) * 100).toFixed(1) : 0;
  const savedBytes = originalSize - compressedSize;
  const metTarget = compressedSize <= TARGET_SIZE;

  /*===================== RENDER =====================*/
  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      {/* ---------- Navbar ---------- */}
      <nav className='navbar'>
        <div className='nav-brand'>
          <img src={ConectysLogo} alt='Conectys Logo' className='brand-logo' />
          <span className='brand-text'>PDF Compressor Pro</span>
        </div>
        <div className='nav-actions'>
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
          {/* ==== Upload UI ==== */}
          {!file ? (
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
              <h3>Select or Drop PDF to Compress</h3>
              <p className='upload-subtitle'>{isDragging ? "Drop your PDF here" : "Fast, secure, client‑side compression"}</p>
              <button
                className='btn-primary btn-upload'
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose File
              </button>
            </div>
          ) : (
            <div className='card compression-card'>
              {/* ---- File header ---- */}
              <div className='file-info'>
                <IconFile />
                <div className='file-details'>
                  <h3>{file.name}</h3>
                  <p>Original size: {formatBytes(originalSize)}</p>
                  {pageCount > 0 && (
                    <p className='page-count'>
                      {pageCount} page{pageCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <button className='btn-icon btn-danger' onClick={handleReset} title='Remove file' disabled={compressing}>
                  <IconTrash />
                </button>
              </div>

              {/* ---- Progress while compressing ---- */}
              {compressing && (
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
                    <strong>Error</strong>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* ---- Warning ---- */}
              {warning && !error && (
                <div className='warning-message'>
                  <IconInfo />
                  <div>
                    <strong>Note</strong>
                    <p>{warning}</p>
                  </div>
                </div>
              )}

              {/* ---- Result (after success) ---- */}
              {compressedBlob && !compressing && !error && (
                <div className='result-section'>
                  <div className={`success-banner ${metTarget ? "target-met" : ""}`}>
                    {metTarget ? <IconCheck /> : <IconInfo />}
                    <div>
                      <strong>{metTarget ? "Compression Successful!" : "Compression Complete"}</strong>
                      <p>
                        Reduced by {formatBytes(savedBytes)} ({compressionRatio}%)
                      </p>
                    </div>
                  </div>

                  <div className='result-stats'>
                    <div className='stat-item'>
                      <span className='stat-label'>Original Size</span>
                      <span className='stat-value'>{formatBytes(originalSize)}</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>Compressed Size</span>
                      <span className={`stat-value ${metTarget ? "success" : "warning"}`}>{formatBytes(compressedSize)}</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>Size Reduction</span>
                      <span className='stat-value success'>{compressionRatio}%</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>Bytes Saved</span>
                      <span className='stat-value'>{formatBytes(savedBytes)}</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>10 MB Target</span>
                      <span className={`stat-value ${metTarget ? "success" : "warning"}`}>{metTarget ? "✓ Met" : "⚠ Exceeded"}</span>
                    </div>

                    <div className='stat-item'>
                      <span className='stat-label'>Page Count</span>
                      <span className='stat-value'>{pageCount}</span>
                    </div>
                  </div>

                  <div className='action-buttons'>
                    <button className='btn-download btn-primary' onClick={handleDownload}>
                      <IconDownload />
                      <span>Download Compressed PDF</span>
                    </button>
                    <button className='btn-action btn-secondary' onClick={handleReset}>
                      <IconCompress />
                      <span>Compress Another File</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==== Info cards ==== */}
          <div className='info-section'>
            <div className='info-card'>
              <div className='info-header'>
                <IconInfo />
                <h3>How It Works</h3>
              </div>
              <ul>
                <li>
                  <strong>Upload:</strong> select your PDF or drag & drop.
                </li>
                <li>
                  <strong>Compress:</strong> metadata is stripped, images are down‑scaled & re‑encoded, with an automatic raster fallback.
                </li>
                <li>
                  <strong>Download:</strong> get the smaller PDF instantly.
                </li>
                <li>
                  <strong>Privacy:</strong> all processing happens in the browser; nothing leaves the client.
                </li>
              </ul>
            </div>

            <div className='info-card'>
              <div className='info-header'>
                <IconCheck />
                <h3>Features</h3>
              </div>
              <ul>
                <li>
                  <strong>Fast, client‑side processing</strong>
                </li>
                <li>
                  <strong>Metadata stripping & object‑stream compression</strong>
                </li>
                <li>
                  <strong>Smart image optimisation (down‑scale, JPEG quality)</strong>
                </li>
                <li>
                  <strong>Automatic raster fallback for stubborn PDFs</strong>
                </li>
                <li>
                  <strong>Free, open‑source, no‑tracking</strong>
                </li>
                <li>
                  <strong>Works offline</strong>
                </li>
              </ul>
            </div>

            <div className='info-card'>
              <div className='info-header'>
                <IconAlert />
                <h3>Best Results</h3>
              </div>
              <ul>
                <li>
                  <strong>Works best on:</strong> PDFs that contain uncompressed raster images or duplicated objects.
                </li>
                <li>
                  <strong>Limited on:</strong> PDFs already optimised or vector‑only documents.
                </li>
                <li>
                  <strong>Maximum size:</strong> 500 MB (browser memory limit).
                </li>
                <li>
                  <strong>Supported formats:</strong> Standard PDF (encrypted PDFs may not work).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className='footer'>
        <div className='footer-content'>
          <p>© 2026 PDF Compressor Pro. Free &amp; Open Source.</p>
          <a
            href='https://github.com/Joaosilva27/pdf-compressor'
            target='_blank'
            rel='noopener noreferrer'
            className='github-link'
            aria-label='GitHub Repository'
          >
            <IconGitHub />
            <span>View on GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

/*====================================================================*/

export default App;
