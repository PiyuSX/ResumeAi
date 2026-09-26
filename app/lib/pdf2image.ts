import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  loadPromise = import("pdfjs-dist/build/pdf.mjs")
    .then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = workerUrl;
      pdfjsLib = lib;
      return lib;
    })
    .catch((error) => {
      loadPromise = null;
      throw error;
    });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    if (file.type !== "application/pdf") {
      throw new Error("Selected file is not a PDF");
    }

    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await lib.getDocument({
      data: arrayBuffer,
    }).promise;

    if (pdf.numPages < 1) {
      throw new Error("PDF contains no pages");
    }

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({
      scale: 2,
    });

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to create canvas context");
    }

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    return await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
            return;
          }

          const originalName = file.name.replace(/\.pdf$/i, "");

          const imageFile = new File(
            [blob],
            `${originalName}.png`,
            {
              type: "image/png",
            }
          );

          resolve({
            imageUrl: URL.createObjectURL(blob),
            file: imageFile,
          });
        },
        "image/png",
        1
      );
    });
  } catch (err) {
    console.error("PDF Conversion Error:", err);

    return {
      imageUrl: "",
      file: null,
      error:
        err instanceof Error
          ? err.message
          : "Failed to convert PDF to image",
    };
  }
}