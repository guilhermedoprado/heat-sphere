import type { ChangeEvent } from "react";
import styles from "./Notes.module.css";

type PdfSlotProps = {
  pdfUrl: string | null;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  slotLabel?: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export function PdfSlot({ pdfUrl, onUpload, slotLabel = "PDF", fileInputRef }: PdfSlotProps) {
  return (
    <div className={styles.pdfContainer}>
      {pdfUrl ? (
        <object
          data={pdfUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          className={styles.pdfViewer}
        >
          <p>
            Your browser does not support PDFs. <a href={pdfUrl}>Download the PDF</a>.
          </p>
        </object>
      ) : (
        <div className={styles.pdfPlaceholder}>
          <p>No document loaded</p>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={onUpload}
          />
          <button className={styles.pdfUploadBtn} onClick={() => fileInputRef.current?.click()}>
            Upload {slotLabel}
          </button>
        </div>
      )}
    </div>
  );
}
