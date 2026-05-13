export type CameraState = "loading" | "ready" | "blocked" | "unsupported";
export type DownloadMode = "image" | "video";
export type AppStep = "welcome" | "frames" | "capture";

export type PhotoFilter = {
  id: string;
  name: string;
  canvasFilter: string;
  previewFilter: string;
};

export type LiveClip = {
  blob: Blob;
  url: string;
};

export type FrameTemplate = {
  id: string;
  name: string;
  description: string;
  frameCount: number;
  columns: number;
  aspectRatio: number;
  background: string;
  mat: string;
  ink: string;
  accent: string;
  outputWidth: number;
};

export type StripMetrics = {
  stripWidth: number;
  stripHeight: number;
  padding: number;
  gap: number;
  labelHeight: number;
  frameWidth: number;
  frameHeight: number;
};

export const LIVE_CLIP_SECONDS = 4;

export const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: "classic-four",
    name: "Classic Four",
    description: "4 vertical frames in a timeless booth strip.",
    frameCount: 4,
    columns: 1,
    aspectRatio: 3 / 4,
    background: "#fffaf2",
    mat: "#efe5d7",
    ink: "#201c18",
    accent: "#8b7158",
    outputWidth: 900,
  },
  {
    id: "triple-keepsake",
    name: "Triple Keepsake",
    description: "3 roomy portraits with extra breathing space.",
    frameCount: 3,
    columns: 1,
    aspectRatio: 3 / 4,
    background: "#f7f0e4",
    mat: "#ffffff",
    ink: "#2f261f",
    accent: "#b3814f",
    outputWidth: 900,
  },
  {
    id: "square-grid",
    name: "Square Grid",
    description: "4 square shots arranged as a clean 2x2 card.",
    frameCount: 4,
    columns: 2,
    aspectRatio: 1,
    background: "#f4f7f1",
    mat: "#ffffff",
    ink: "#172017",
    accent: "#657b56",
    outputWidth: 1100,
  },
  {
    id: "wide-duo",
    name: "Wide Duo",
    description: "2 landscape frames for a wider postcard feel.",
    frameCount: 2,
    columns: 1,
    aspectRatio: 4 / 3,
    background: "#f1f4f7",
    mat: "#ffffff",
    ink: "#17202a",
    accent: "#577187",
    outputWidth: 1100,
  },
  {
    id: "contact-six",
    name: "Contact Six",
    description: "6 compact portraits in a modern contact sheet.",
    frameCount: 6,
    columns: 2,
    aspectRatio: 3 / 4,
    background: "#f8f3ea",
    mat: "#fffaf2",
    ink: "#201c18",
    accent: "#9a6b4f",
    outputWidth: 1200,
  },
];

export const PHOTO_FILTERS: PhotoFilter[] = [
  {
    id: "original",
    name: "Original",
    canvasFilter: "none",
    previewFilter: "none",
  },
  {
    id: "black-white",
    name: "B&W",
    canvasFilter: "grayscale(1) contrast(1.08)",
    previewFilter: "grayscale(1) contrast(1.08)",
  },
  {
    id: "sepia",
    name: "Sepia",
    canvasFilter: "sepia(0.72) contrast(1.04) saturate(0.88)",
    previewFilter: "sepia(0.72) contrast(1.04) saturate(0.88)",
  },
  {
    id: "grayscale",
    name: "Grayscale",
    canvasFilter: "grayscale(1)",
    previewFilter: "grayscale(1)",
  },
  {
    id: "soft-pop",
    name: "Soft Pop",
    canvasFilter: "contrast(1.08) saturate(1.2) brightness(1.03)",
    previewFilter: "contrast(1.08) saturate(1.2) brightness(1.03)",
  },
];

export function createEmptyPhotos(count: number) {
  return Array.from({ length: count }, () => null) as (string | null)[];
}

export function createEmptyLiveClips(count: number) {
  return Array.from({ length: count }, () => null) as (LiveClip | null)[];
}

export function getTemplateById(id: string) {
  return (
    FRAME_TEMPLATES.find((template) => template.id === id) ?? FRAME_TEMPLATES[0]
  );
}

export function getFilterById(id: string) {
  return PHOTO_FILTERS.find((filter) => filter.id === id) ?? PHOTO_FILTERS[0];
}

export function getTemplateRows(template: FrameTemplate) {
  return Math.ceil(template.frameCount / template.columns);
}

export function loadPhoto(photo: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = photo;
  });
}

export function loadVideo(url: string) {
  return new Promise<HTMLVideoElement>((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto";
    video.onloadedmetadata = () => resolve(video);
    video.onerror = () => reject(new Error("Unable to load live clip video."));
    video.src = url;
  });
}

export function getStripMetrics(template: FrameTemplate): StripMetrics {
  const stripWidth = template.outputWidth;
  const padding = Math.round(stripWidth * 0.075);
  const gap = Math.round(stripWidth * 0.032);
  const labelHeight = Math.round(stripWidth * 0.12);
  const contentWidth = stripWidth - padding * 2;
  const rows = getTemplateRows(template);
  const frameWidth = Math.floor(
    (contentWidth - gap * (template.columns - 1)) / template.columns,
  );
  const frameHeight = Math.round(frameWidth / template.aspectRatio);
  const stripHeight =
    padding * 2 + labelHeight + frameHeight * rows + gap * (rows - 1);

  return {
    stripWidth,
    stripHeight,
    padding,
    gap,
    labelHeight,
    frameWidth,
    frameHeight,
  };
}

export function getFramePosition(
  index: number,
  columns: number,
  metrics: StripMetrics,
) {
  const row = Math.floor(index / columns);
  const column = index % columns;

  return {
    x: metrics.padding + column * (metrics.frameWidth + metrics.gap),
    y:
      metrics.padding +
      metrics.labelHeight +
      row * (metrics.frameHeight + metrics.gap),
  };
}

export function getSupportedMp4MimeType() {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  const mimeTypes = [
    'video/mp4;codecs="avc1.42E01E"',
    "video/mp4;codecs=avc1.42E01E",
    "video/mp4;codecs=h264",
    "video/mp4",
  ];

  return mimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? null;
}

export function createCapturedPhotoCanvas(
  video: HTMLVideoElement,
  template: FrameTemplate,
) {
  const sourceWidth = video.videoWidth;
  const sourceHeight = video.videoHeight;

  if (!sourceWidth || !sourceHeight) {
    return null;
  }

  const outputWidth = 900;
  const outputHeight = Math.round(outputWidth / template.aspectRatio);
  const sourceRatio = sourceWidth / sourceHeight;
  const sourceCropWidth =
    sourceRatio > template.aspectRatio ? sourceHeight * template.aspectRatio : sourceWidth;
  const sourceCropHeight =
    sourceRatio > template.aspectRatio ? sourceHeight : sourceWidth / template.aspectRatio;
  const sourceX = (sourceWidth - sourceCropWidth) / 2;
  const sourceY = (sourceHeight - sourceCropHeight) / 2;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context || typeof canvas.captureStream !== "function") {
    return null;
  }

  canvas.width = outputWidth;
  canvas.height = outputHeight;
  context.translate(outputWidth, 0);
  context.scale(-1, 1);
  context.drawImage(
    video,
    sourceX,
    sourceY,
    sourceCropWidth,
    sourceCropHeight,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return canvas;
}

export function drawStripBase(
  context: CanvasRenderingContext2D,
  template: FrameTemplate,
  metrics: StripMetrics,
) {
  context.fillStyle = template.background;
  context.fillRect(0, 0, metrics.stripWidth, metrics.stripHeight);
  context.fillStyle = template.ink;
  context.font = `600 ${Math.round(metrics.stripWidth * 0.05)}px Avenir Next, Trebuchet MS, sans-serif`;
  context.textAlign = "center";
  context.fillText("Snap Pop", metrics.stripWidth / 2, metrics.padding * 0.86);
  context.fillStyle = template.accent;
  context.font = `500 ${Math.round(metrics.stripWidth * 0.022)}px Avenir Next, Trebuchet MS, sans-serif`;
  context.fillText(
    template.name,
    metrics.stripWidth / 2,
    metrics.padding * 1.24,
  );
}

export function drawStripFrame(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  index: number,
  template: FrameTemplate,
  metrics: StripMetrics,
  canvasFilter: string,
) {
  const { x, y } = getFramePosition(index, template.columns, metrics);
  const matSize = Math.max(8, Math.round(metrics.stripWidth * 0.012));

  context.fillStyle = template.mat;
  context.fillRect(
    x - matSize,
    y - matSize,
    metrics.frameWidth + matSize * 2,
    metrics.frameHeight + matSize * 2,
  );
  context.filter = canvasFilter;
  context.drawImage(image, x, y, metrics.frameWidth, metrics.frameHeight);
  context.filter = "none";
}
