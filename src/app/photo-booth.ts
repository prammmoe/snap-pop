export type CameraState = "loading" | "ready" | "blocked" | "unsupported";
export type DownloadMode = "image" | "video";
export type AppStep = "welcome" | "frames" | "capture" | "finish";

export type PhotoFilter = {
  id: string;
  name: string;
  canvasFilter: string;
  previewFilter: string;
};

export type FrameDesign = {
  id: string;
  name: string;
  description: string;
  background: string;
  accent: string;
  secondary: string;
};

export type FrameColorOption = {
  name: string;
  value: string;
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
  {
    id: "kodak-gold-200",
    name: "Kodak Gold 200",
    canvasFilter: "sepia(0.18) saturate(1.24) contrast(1.05) brightness(1.05) hue-rotate(-5deg)",
    previewFilter: "sepia(0.18) saturate(1.24) contrast(1.05) brightness(1.05) hue-rotate(-5deg)",
  },
  {
    id: "kodak-portra-400",
    name: "Kodak Portra 400",
    canvasFilter: "sepia(0.12) saturate(0.92) contrast(0.96) brightness(1.06) hue-rotate(-3deg)",
    previewFilter: "sepia(0.12) saturate(0.92) contrast(0.96) brightness(1.06) hue-rotate(-3deg)",
  },
  {
    id: "kodak-ektar-100",
    name: "Kodak Ektar 100",
    canvasFilter: "saturate(1.34) contrast(1.12) brightness(1.02) hue-rotate(-7deg)",
    previewFilter: "saturate(1.34) contrast(1.12) brightness(1.02) hue-rotate(-7deg)",
  },
  {
    id: "fuji-pro-400h",
    name: "Fuji Pro 400H",
    canvasFilter: "saturate(0.94) contrast(0.98) brightness(1.08) hue-rotate(8deg)",
    previewFilter: "saturate(0.94) contrast(0.98) brightness(1.08) hue-rotate(8deg)",
  },
  {
    id: "fuji-velvia-50",
    name: "Fuji Velvia 50",
    canvasFilter: "saturate(1.42) contrast(1.16) brightness(0.99) hue-rotate(5deg)",
    previewFilter: "saturate(1.42) contrast(1.16) brightness(0.99) hue-rotate(5deg)",
  },
  {
    id: "cinestill-800t",
    name: "CineStill 800T",
    canvasFilter: "saturate(1.22) contrast(1.08) brightness(0.98) hue-rotate(14deg)",
    previewFilter: "saturate(1.22) contrast(1.08) brightness(0.98) hue-rotate(14deg)",
  },
  {
    id: "ilford-hp5-plus-400",
    name: "Ilford HP5 400",
    canvasFilter: "grayscale(1) contrast(1.22) brightness(1.02)",
    previewFilter: "grayscale(1) contrast(1.22) brightness(1.02)",
  },
  {
    id: "kodak-tri-x-400",
    name: "Kodak Tri-X 400",
    canvasFilter: "grayscale(1) contrast(1.34) brightness(0.96)",
    previewFilter: "grayscale(1) contrast(1.34) brightness(0.96)",
  },
];

export const FRAME_COLOR_OPTIONS: FrameColorOption[] = [
  { name: "Cream", value: "#fffaf2" },
  { name: "Blush", value: "#ffd6df" },
  { name: "Sun", value: "#ffe071" },
  { name: "Mint", value: "#bfe8d4" },
  { name: "Sky", value: "#cfe5ff" },
  { name: "Ink", value: "#201c18" },
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

export function createFrameDesign(frameColor: string): FrameDesign {
  const background = normalizeHexColor(frameColor);
  const accent = getReadableColor(background);

  return {
    id: "color-frame",
    name: "Color Frame",
    description: "Minimal frame with your selected color.",
    background,
    accent,
    secondary: accent,
  };
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
  const labelHeight = 0;
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
  frameDesign: FrameDesign,
  metrics: StripMetrics,
) {
  context.fillStyle = frameDesign.background;
  context.fillRect(0, 0, metrics.stripWidth, metrics.stripHeight);
}

function normalizeHexColor(color: string) {
  return /^#[0-9a-f]{6}$/i.test(color) ? color : FRAME_COLOR_OPTIONS[0].value;
}

function getReadableColor(hexColor: string) {
  const red = Number.parseInt(hexColor.slice(1, 3), 16) / 255;
  const green = Number.parseInt(hexColor.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(hexColor.slice(5, 7), 16) / 255;
  const luminance = red * 0.299 + green * 0.587 + blue * 0.114;

  return luminance > 0.52 ? "#201c18" : "#fffaf2";
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

export function drawFrameDesign(
  context: CanvasRenderingContext2D,
  design: FrameDesign,
  metrics: StripMetrics,
) {
  switch (design.id) {
    case "color-frame":
      break;
    case "candy-pet":
      drawCandyPetFrame(context, design, metrics);
      break;
    case "checker-pop":
      drawCheckerPopFrame(context, design, metrics);
      break;
    case "manga-event":
      drawMangaEventFrame(context, design, metrics);
      break;
    case "vintage-stamp":
      drawVintageStampFrame(context, design, metrics);
      break;
    case "lotus-jade":
      drawLotusJadeFrame(context, design, metrics);
      break;
    case "sun-carnival":
      drawSunCarnivalFrame(context, design, metrics);
      break;
    case "storybook-bloom":
      drawStorybookBloomFrame(context, design, metrics);
      break;
    default:
      drawCleanFrame(context, design, metrics);
  }
}

function drawCleanFrame(
  context: CanvasRenderingContext2D,
  design: FrameDesign,
  metrics: StripMetrics,
) {
  context.strokeStyle = design.secondary;
  context.lineWidth = Math.max(4, metrics.stripWidth * 0.006);
  context.strokeRect(
    metrics.padding * 0.38,
    metrics.padding * 0.38,
    metrics.stripWidth - metrics.padding * 0.76,
    metrics.stripHeight - metrics.padding * 0.76,
  );
}

function drawCandyPetFrame(
  context: CanvasRenderingContext2D,
  design: FrameDesign,
  metrics: StripMetrics,
) {
  drawSideRails(context, metrics, "#e69400", metrics.padding * 0.26);
  drawTape(context, metrics.stripWidth * 0.53, metrics.padding * 0.78, design.secondary);
  drawBubbleText(context, "SNAP POP", metrics.stripWidth / 2, metrics.stripHeight - metrics.padding * 0.55, design.accent);

  for (let index = 0; index < 10; index += 1) {
    drawPaw(
      context,
      index % 2 === 0 ? metrics.padding * 0.54 : metrics.stripWidth - metrics.padding * 0.54,
      metrics.padding * (1.8 + index * 0.45),
      metrics.stripWidth * 0.018,
      design.accent,
    );
  }
}

function drawCheckerPopFrame(
  context: CanvasRenderingContext2D,
  design: FrameDesign,
  metrics: StripMetrics,
) {
  const band = metrics.padding * 0.26;
  drawCheckerBand(context, 0, 0, metrics.stripWidth, band, design.accent, "#ffffff");
  drawCheckerBand(
    context,
    0,
    metrics.stripHeight - band,
    metrics.stripWidth,
    band,
    design.accent,
    "#ffffff",
  );
  drawStar(context, metrics.padding * 0.72, metrics.padding * 1.55, 9, metrics.padding * 0.22, metrics.padding * 0.1, design.secondary, "#201c18");
  drawStar(context, metrics.stripWidth - metrics.padding * 0.68, metrics.stripHeight - metrics.padding * 1.35, 9, metrics.padding * 0.25, metrics.padding * 0.1, design.secondary, "#201c18");
  drawEyes(context, metrics.stripWidth - metrics.padding * 0.62, metrics.padding * 1.04, metrics.padding * 0.16);
  drawBubbleText(context, "this moment.", metrics.stripWidth / 2, metrics.stripHeight - metrics.padding * 0.54, "#201c18");
}

function drawMangaEventFrame(
  context: CanvasRenderingContext2D,
  design: FrameDesign,
  metrics: StripMetrics,
) {
  const side = metrics.padding * 0.28;
  context.fillStyle = design.accent;
  context.fillRect(0, 0, side, metrics.stripHeight);
  context.fillStyle = design.secondary;
  context.fillRect(metrics.stripWidth - side, 0, side, metrics.stripHeight);
  drawCheckerBand(context, metrics.stripWidth - side, 0, side, metrics.stripHeight, design.accent, "#ffffff");
  drawStar(context, metrics.stripWidth * 0.22, metrics.padding * 0.8, 12, metrics.padding * 0.34, metrics.padding * 0.16, design.secondary, design.accent);
  drawRibbon(context, metrics.stripWidth * 0.58, metrics.padding * 0.55, metrics.stripWidth * 0.32, metrics.padding * 0.18, design.accent);
  drawBubbleText(context, "PHOTOBOOTH", metrics.stripWidth / 2, metrics.stripHeight - metrics.padding * 0.55, design.accent);
}

function drawVintageStampFrame(
  context: CanvasRenderingContext2D,
  design: FrameDesign,
  metrics: StripMetrics,
) {
  drawPerforatedBorder(context, metrics, "#f7f0d4", "#b9b09c");
  drawRotatedStamp(context, metrics.padding * 0.78, metrics.padding * 1.36, metrics.padding * 0.78, metrics.padding * 1.04, design.secondary, design.accent, -0.18);
  drawRotatedStamp(context, metrics.stripWidth - metrics.padding * 0.78, metrics.padding * 1.48, metrics.padding * 0.72, metrics.padding, "#c9544b", design.secondary, 0.17);
  drawBubbleText(context, "2026", metrics.stripWidth - metrics.padding * 0.8, metrics.padding * 0.74, design.accent);
}

function drawLotusJadeFrame(
  context: CanvasRenderingContext2D,
  design: FrameDesign,
  metrics: StripMetrics,
) {
  const inset = metrics.padding * 0.24;
  context.strokeStyle = design.accent;
  context.lineWidth = Math.max(5, metrics.stripWidth * 0.008);
  context.strokeRect(inset, inset, metrics.stripWidth - inset * 2, metrics.stripHeight - inset * 2);
  drawCloudRow(context, metrics.stripWidth / 2, metrics.padding * 0.55, metrics.padding * 0.22, design.accent);
  drawLotus(context, metrics.stripWidth * 0.28, metrics.stripHeight - metrics.padding * 0.7, metrics.padding * 0.28, design.secondary, design.accent);
  drawLotus(context, metrics.stripWidth * 0.72, metrics.stripHeight - metrics.padding * 0.82, metrics.padding * 0.24, design.secondary, design.accent);
  drawSideMedallions(context, metrics.padding * 0.52, metrics.stripHeight / 2, metrics.padding * 0.16, design.accent, "#67c4c8");
  drawSideMedallions(context, metrics.stripWidth - metrics.padding * 0.52, metrics.stripHeight / 2, metrics.padding * 0.16, design.accent, "#67c4c8");
}

function drawSunCarnivalFrame(
  context: CanvasRenderingContext2D,
  design: FrameDesign,
  metrics: StripMetrics,
) {
  drawVerticalStripes(context, 0, 0, metrics.stripWidth, metrics.padding * 0.28, design.secondary, "#ffffff");
  drawVerticalStripes(
    context,
    0,
    metrics.stripHeight - metrics.padding * 0.28,
    metrics.stripWidth,
    metrics.padding * 0.28,
    design.secondary,
    "#ffffff",
  );
  drawArc(context, metrics.stripWidth / 2, metrics.padding * 2.18, metrics.stripWidth * 0.34, design.accent, metrics.padding * 0.16);
  drawSun(context, metrics.stripWidth / 2, metrics.padding * 0.88, metrics.padding * 0.28, "#f6b83f", "#201c18");
  drawFlower(context, metrics.padding * 0.58, metrics.stripHeight - metrics.padding * 0.78, metrics.padding * 0.18, "#f7758e", design.secondary);
  drawFlower(context, metrics.stripWidth - metrics.padding * 0.58, metrics.stripHeight - metrics.padding * 0.78, metrics.padding * 0.18, "#f7758e", design.secondary);
  drawRibbon(context, metrics.stripWidth / 2, metrics.stripHeight - metrics.padding * 0.5, metrics.stripWidth * 0.4, metrics.padding * 0.22, "#fff2c6");
}

function drawStorybookBloomFrame(
  context: CanvasRenderingContext2D,
  design: FrameDesign,
  metrics: StripMetrics,
) {
  context.strokeStyle = design.accent;
  context.lineWidth = Math.max(5, metrics.stripWidth * 0.008);
  context.strokeRect(metrics.padding * 0.24, metrics.padding * 0.24, metrics.stripWidth - metrics.padding * 0.48, metrics.stripHeight - metrics.padding * 0.48);
  drawSun(context, metrics.stripWidth / 2, metrics.padding * 0.62, metrics.padding * 0.24, "#f4b23c", design.accent);
  drawRibbon(context, metrics.stripWidth / 2, metrics.padding * 0.92, metrics.stripWidth * 0.48, metrics.padding * 0.18, design.secondary);
  drawFlower(context, metrics.padding * 0.58, metrics.padding * 1.45, metrics.padding * 0.15, "#f082a7", "#6a8d3a");
  drawFlower(context, metrics.stripWidth - metrics.padding * 0.58, metrics.padding * 1.45, metrics.padding * 0.15, "#f082a7", "#6a8d3a");
  drawFlower(context, metrics.stripWidth * 0.38, metrics.stripHeight - metrics.padding * 0.54, metrics.padding * 0.14, "#f082a7", "#6a8d3a");
  drawFlower(context, metrics.stripWidth * 0.62, metrics.stripHeight - metrics.padding * 0.54, metrics.padding * 0.14, "#f082a7", "#6a8d3a");
  drawDove(context, metrics.padding * 0.62, metrics.stripHeight - metrics.padding * 1.15, metrics.padding * 0.18, design.accent);
  drawDove(context, metrics.stripWidth - metrics.padding * 0.62, metrics.stripHeight - metrics.padding * 1.15, metrics.padding * 0.18, design.accent);
}

function drawSideRails(
  context: CanvasRenderingContext2D,
  metrics: StripMetrics,
  color: string,
  width: number,
) {
  context.fillStyle = color;
  context.fillRect(0, 0, width, metrics.stripHeight);
  context.fillRect(metrics.stripWidth - width, 0, width, metrics.stripHeight);
}

function drawCheckerBand(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  firstColor: string,
  secondColor: string,
) {
  const size = Math.max(12, Math.min(width, height) / 2);
  const columns = Math.ceil(width / size);
  const rows = Math.ceil(height / size);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      context.fillStyle = (row + column) % 2 === 0 ? firstColor : secondColor;
      context.fillRect(x + column * size, y + row * size, size, size);
    }
  }
}

function drawVerticalStripes(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  firstColor: string,
  secondColor: string,
) {
  const stripeWidth = Math.max(16, width / 12);
  const stripes = Math.ceil(width / stripeWidth);

  for (let index = 0; index < stripes; index += 1) {
    context.fillStyle = index % 2 === 0 ? firstColor : secondColor;
    context.fillRect(x + index * stripeWidth, y, stripeWidth, height);
  }
}

function drawStar(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  points: number,
  outerRadius: number,
  innerRadius: number,
  fill: string,
  stroke: string,
) {
  context.beginPath();

  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * index) / points - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }

  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = Math.max(2, outerRadius * 0.08);
  context.stroke();
}

function drawPaw(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  color: string,
) {
  context.fillStyle = color;
  context.beginPath();
  context.ellipse(centerX, centerY + radius * 0.35, radius, radius * 0.8, 0, 0, Math.PI * 2);
  context.fill();

  for (let index = 0; index < 4; index += 1) {
    const offsetX = (index - 1.5) * radius * 0.62;
    const offsetY = index === 1 || index === 2 ? -radius * 0.58 : -radius * 0.25;
    context.beginPath();
    context.arc(centerX + offsetX, centerY + offsetY, radius * 0.32, 0, Math.PI * 2);
    context.fill();
  }
}

function drawTape(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  color: string,
) {
  context.save();
  context.translate(centerX, centerY);
  context.rotate(-0.16);
  context.fillStyle = "#fff7fb";
  context.strokeStyle = color;
  context.lineWidth = 4;
  context.fillRect(-110, -24, 220, 48);
  context.strokeRect(-110, -24, 220, 48);
  context.restore();
}

function drawBubbleText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
) {
  context.fillStyle = color;
  context.textAlign = "center";
  context.font = "800 34px Avenir Next, Trebuchet MS, sans-serif";
  context.fillText(text, x, y);
}

function drawEyes(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
) {
  for (const offset of [-radius * 0.72, radius * 0.72]) {
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.ellipse(centerX + offset, centerY, radius * 0.55, radius * 0.8, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#201c18";
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = "#201c18";
    context.beginPath();
    context.arc(centerX + offset + radius * 0.18, centerY, radius * 0.22, 0, Math.PI * 2);
    context.fill();
  }
}

function drawRibbon(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  color: string,
) {
  context.save();
  context.translate(centerX, centerY);
  context.rotate(-0.08);
  context.fillStyle = color;
  context.strokeStyle = "#201c18";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(-width / 2, -height / 2);
  context.lineTo(width / 2, -height / 2);
  context.lineTo(width / 2 - height * 0.5, 0);
  context.lineTo(width / 2, height / 2);
  context.lineTo(-width / 2, height / 2);
  context.lineTo(-width / 2 + height * 0.5, 0);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
}

function drawPerforatedBorder(
  context: CanvasRenderingContext2D,
  metrics: StripMetrics,
  holeColor: string,
  strokeColor: string,
) {
  const inset = metrics.padding * 0.22;
  const radius = metrics.padding * 0.07;
  const step = radius * 2.5;

  context.strokeStyle = strokeColor;
  context.lineWidth = 3;
  context.strokeRect(inset, inset, metrics.stripWidth - inset * 2, metrics.stripHeight - inset * 2);
  context.fillStyle = holeColor;

  for (let x = inset; x <= metrics.stripWidth - inset; x += step) {
    punchCircle(context, x, inset, radius);
    punchCircle(context, x, metrics.stripHeight - inset, radius);
  }

  for (let y = inset; y <= metrics.stripHeight - inset; y += step) {
    punchCircle(context, inset, y, radius);
    punchCircle(context, metrics.stripWidth - inset, y, radius);
  }
}

function punchCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function drawRotatedStamp(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  fill: string,
  stroke: string,
  rotation: number,
) {
  context.save();
  context.translate(centerX, centerY);
  context.rotate(rotation);
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = 4;
  context.fillRect(-width / 2, -height / 2, width, height);
  context.strokeRect(-width / 2, -height / 2, width, height);
  context.fillStyle = stroke;
  context.font = "700 24px Avenir Next, Trebuchet MS, sans-serif";
  context.textAlign = "center";
  context.fillText("STAMP", 0, height * 0.16);
  context.restore();
}

function drawCloudRow(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  color: string,
) {
  context.fillStyle = color;

  for (let index = -3; index <= 3; index += 1) {
    context.beginPath();
    context.arc(centerX + index * radius * 1.25, centerY, radius, Math.PI, 0);
    context.lineTo(centerX + index * radius * 1.25 + radius, centerY + radius * 0.42);
    context.lineTo(centerX + index * radius * 1.25 - radius, centerY + radius * 0.42);
    context.closePath();
    context.fill();
  }
}

function drawLotus(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  petalColor: string,
  strokeColor: string,
) {
  context.strokeStyle = strokeColor;
  context.lineWidth = 3;

  for (let index = -2; index <= 2; index += 1) {
    context.save();
    context.translate(centerX, centerY);
    context.rotate(index * 0.34);
    context.beginPath();
    context.ellipse(0, -radius * 0.45, radius * 0.35, radius, 0, 0, Math.PI * 2);
    context.fillStyle = petalColor;
    context.fill();
    context.stroke();
    context.restore();
  }
}

function drawSideMedallions(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  stroke: string,
  fill: string,
) {
  for (let index = -2; index <= 2; index += 1) {
    context.beginPath();
    context.arc(centerX, centerY + index * radius * 2.4, radius, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
    context.strokeStyle = stroke;
    context.lineWidth = 4;
    context.stroke();
  }
}

function drawArc(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  color: string,
  lineWidth: number,
) {
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.beginPath();
  context.arc(centerX, centerY, radius, Math.PI * 1.08, Math.PI * 1.92);
  context.stroke();
}

function drawSun(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  fill: string,
  stroke: string,
) {
  drawStar(context, centerX, centerY, 18, radius * 1.55, radius, fill, stroke);
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = 3;
  context.stroke();
}

function drawFlower(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  petalColor: string,
  leafColor: string,
) {
  context.fillStyle = leafColor;
  context.beginPath();
  context.ellipse(centerX - radius * 1.1, centerY + radius * 0.7, radius * 0.4, radius, -0.8, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.ellipse(centerX + radius * 1.1, centerY + radius * 0.7, radius * 0.4, radius, 0.8, 0, Math.PI * 2);
  context.fill();

  for (let index = 0; index < 6; index += 1) {
    const angle = (Math.PI * 2 * index) / 6;
    context.beginPath();
    context.ellipse(
      centerX + Math.cos(angle) * radius * 0.58,
      centerY + Math.sin(angle) * radius * 0.58,
      radius * 0.42,
      radius * 0.68,
      angle,
      0,
      Math.PI * 2,
    );
    context.fillStyle = petalColor;
    context.fill();
  }

  context.beginPath();
  context.arc(centerX, centerY, radius * 0.36, 0, Math.PI * 2);
  context.fillStyle = "#f5c544";
  context.fill();
}

function drawDove(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  stroke: string,
) {
  context.strokeStyle = stroke;
  context.lineWidth = 3;
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.ellipse(centerX, centerY, radius, radius * 0.55, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.beginPath();
  context.ellipse(centerX - radius * 0.55, centerY - radius * 0.38, radius * 0.82, radius * 0.34, -0.6, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.beginPath();
  context.ellipse(centerX + radius * 0.8, centerY - radius * 0.12, radius * 0.32, radius * 0.26, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();
}
