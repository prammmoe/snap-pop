"use client";

import { useEffect, useRef, useState } from "react";

type CameraState = "loading" | "ready" | "blocked" | "unsupported";
type DownloadMode = "image" | "video";
type LiveClip = {
  blob: Blob;
  url: string;
};

type StripMetrics = {
  stripWidth: number;
  stripHeight: number;
  padding: number;
  gap: number;
  labelHeight: number;
  frameWidth: number;
  frameHeight: number;
};

const LIVE_CLIP_SECONDS = 4;

type FrameTemplate = {
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

const FRAME_TEMPLATES: FrameTemplate[] = [
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

function createEmptyPhotos(count: number) {
  return Array.from({ length: count }, () => null) as (string | null)[];
}

function createEmptyLiveClips(count: number) {
  return Array.from({ length: count }, () => null) as (LiveClip | null)[];
}

function loadPhoto(photo: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = photo;
  });
}

function loadVideo(url: string) {
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

function getStripMetrics(template: FrameTemplate): StripMetrics {
  const stripWidth = template.outputWidth;
  const padding = Math.round(stripWidth * 0.075);
  const gap = Math.round(stripWidth * 0.032);
  const labelHeight = Math.round(stripWidth * 0.12);
  const contentWidth = stripWidth - padding * 2;
  const rows = Math.ceil(template.frameCount / template.columns);
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

function getFramePosition(
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

function getSupportedMp4MimeType() {
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

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const liveChunksRef = useRef<Blob[]>([]);
  const liveClipUrlsRef = useRef<string[]>([]);
  const liveMimeTypeRef = useRef<string | null>(null);
  const liveRestartTimeoutRef = useRef<number | null>(null);
  const isRestartingLiveRecorderRef = useRef(false);
  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const [liveVideoSupported, setLiveVideoSupported] = useState(false);
  const [liveDownloadError, setLiveDownloadError] = useState<string | null>(null);
  const [downloadMode, setDownloadMode] = useState<DownloadMode>("image");
  const [templateId, setTemplateId] = useState(FRAME_TEMPLATES[0].id);
  const selectedTemplate =
    FRAME_TEMPLATES.find((template) => template.id === templateId) ??
    FRAME_TEMPLATES[0];
  const [photos, setPhotos] = useState<(string | null)[]>(
    createEmptyPhotos(selectedTemplate.frameCount),
  );
  const [liveClips, setLiveClips] = useState<(LiveClip | null)[]>(
    createEmptyLiveClips(selectedTemplate.frameCount),
  );
  const [activeFrame, setActiveFrame] = useState(0);

  function clearLiveRestartTimeout() {
    if (liveRestartTimeoutRef.current !== null) {
      window.clearTimeout(liveRestartTimeoutRef.current);
      liveRestartTimeoutRef.current = null;
    }
  }

  function stopLiveRecorder(recorder: MediaRecorder) {
    return new Promise<Blob[]>((resolve) => {
      if (recorder.state === "inactive") {
        resolve([...liveChunksRef.current]);
        return;
      }

      recorder.addEventListener(
        "stop",
        () => {
          resolve([...liveChunksRef.current]);
        },
        { once: true },
      );
      recorder.stop();
    });
  }

  function startLiveRecorder(stream: MediaStream) {
    const mimeType = getSupportedMp4MimeType();

    if (mimeType === null) {
      setLiveVideoSupported(false);
      return;
    }

    try {
      const recorder = new MediaRecorder(stream, { mimeType });

      liveChunksRef.current = [];
      liveMimeTypeRef.current = mimeType;
      recorder.ondataavailable = (event) => {
        if (!event.data.size) {
          return;
        }

        liveChunksRef.current = [...liveChunksRef.current, event.data];
      };

      recorder.start();
      recorderRef.current = recorder;
      clearLiveRestartTimeout();
      liveRestartTimeoutRef.current = window.setTimeout(() => {
        void restartLiveRecorder();
      }, LIVE_CLIP_SECONDS * 1000);
      setLiveVideoSupported(true);
    } catch {
      setLiveVideoSupported(false);
    }
  }

  async function restartLiveRecorder() {
    const recorder = recorderRef.current;
    const stream = streamRef.current;

    if (!recorder || !stream || isRestartingLiveRecorderRef.current) {
      return;
    }

    isRestartingLiveRecorderRef.current = true;
    clearLiveRestartTimeout();
    await stopLiveRecorder(recorder);
    recorderRef.current = null;
    startLiveRecorder(stream);
    isRestartingLiveRecorderRef.current = false;
  }

  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraState("unsupported");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        startLiveRecorder(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setCameraState("ready");
      } catch {
        if (isMounted) {
          setCameraState("blocked");
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      clearLiveRestartTimeout();
      if (recorderRef.current?.state !== "inactive") {
        recorderRef.current?.stop();
      }
      recorderRef.current = null;
      liveChunksRef.current = [];
      liveMimeTypeRef.current = null;
      liveClipUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      liveClipUrlsRef.current = [];
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
    // Camera setup should run once; restarting it on recorder helper changes would
    // request camera access again and reset the capture session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectTemplate(template: FrameTemplate) {
    setTemplateId(template.id);
    setPhotos(createEmptyPhotos(template.frameCount));
    liveClipUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    liveClipUrlsRef.current = [];
    setLiveClips(createEmptyLiveClips(template.frameCount));
    setActiveFrame(0);
  }

  async function getLiveClip() {
    const recorder = recorderRef.current;
    const stream = streamRef.current;

    if (
      !liveVideoSupported ||
      !recorder ||
      !stream ||
      isRestartingLiveRecorderRef.current
    ) {
      return null;
    }

    isRestartingLiveRecorderRef.current = true;
    clearLiveRestartTimeout();
    const recorderMimeType = recorder.mimeType || liveMimeTypeRef.current || "video/mp4";
    const chunks = await stopLiveRecorder(recorder);
    recorderRef.current = null;
    startLiveRecorder(stream);
    isRestartingLiveRecorderRef.current = false;

    if (!chunks.length) {
      return null;
    }

    return new Blob(chunks, { type: recorderMimeType || "video/mp4" });
  }

  async function capturePhoto() {
    const video = videoRef.current;
    const frameIndex = activeFrame;

    if (!video || cameraState !== "ready") {
      return;
    }

    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;

    if (!sourceWidth || !sourceHeight) {
      return;
    }

    const outputWidth = 900;
    const outputHeight = Math.round(outputWidth / selectedTemplate.aspectRatio);
    const sourceRatio = sourceWidth / sourceHeight;
    const sourceCropWidth =
      sourceRatio > selectedTemplate.aspectRatio
        ? sourceHeight * selectedTemplate.aspectRatio
        : sourceWidth;
    const sourceCropHeight =
      sourceRatio > selectedTemplate.aspectRatio
        ? sourceHeight
        : sourceWidth / selectedTemplate.aspectRatio;
    const sourceX = (sourceWidth - sourceCropWidth) / 2;
    const sourceY = (sourceHeight - sourceCropHeight) / 2;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context || typeof canvas.captureStream !== "function") {
      return;
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

    const nextPhotos = [...photos];
    nextPhotos[frameIndex] = canvas.toDataURL("image/jpeg", 0.92);
    setPhotos(nextPhotos);

    const liveClip = await getLiveClip();

    if (liveClip) {
      const clipUrl = URL.createObjectURL(liveClip);
      liveClipUrlsRef.current = [...liveClipUrlsRef.current, clipUrl];

      setLiveClips((currentLiveClips) => {
        if (currentLiveClips[frameIndex]?.url) {
          URL.revokeObjectURL(currentLiveClips[frameIndex].url);
        }

        const nextLiveClips = [...currentLiveClips];
        nextLiveClips[frameIndex] = {
          blob: liveClip,
          url: clipUrl,
        };

        return nextLiveClips;
      });
    }

    const nextEmptyFrame = nextPhotos.findIndex((photo) => photo === null);

    if (nextEmptyFrame !== -1) {
      setActiveFrame(nextEmptyFrame);
    }
  }

  function selectFrame(index: number) {
    setActiveFrame(index);
  }

  function clearFrame(index: number) {
    const nextPhotos = [...photos];
    nextPhotos[index] = null;
    setPhotos(nextPhotos);
    setLiveClips((currentLiveClips) => {
      if (currentLiveClips[index]?.url) {
        URL.revokeObjectURL(currentLiveClips[index].url);
      }

      const nextLiveClips = [...currentLiveClips];
      nextLiveClips[index] = null;
      return nextLiveClips;
    });
    setActiveFrame(index);
  }

  const capturedCount = photos.filter(Boolean).length;
  const liveClipCount = liveClips.filter(Boolean).length;
  const isStripComplete = capturedCount === selectedTemplate.frameCount;
  const isLiveStripComplete = liveClipCount === selectedTemplate.frameCount;
  const canDownloadLiveClips = liveVideoSupported && isLiveStripComplete;
  const cameraMessage =
    cameraState === "unsupported"
      ? "This browser does not support camera capture."
      : "Allow camera access to start your photo strip.";

  async function downloadLiveClips() {
    const mimeType = getSupportedMp4MimeType();

    if (!canDownloadLiveClips || !mimeType) {
      return;
    }

    const metrics = getStripMetrics(selectedTemplate);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const stripContext = context;

    canvas.width = metrics.stripWidth;
    canvas.height = metrics.stripHeight;

    const clips = liveClips.filter((clip): clip is LiveClip => clip !== null);
    const videos = await Promise.all(clips.map((clip) => loadVideo(clip.url)));

    if (typeof canvas.captureStream !== "function") {
      throw new Error("Canvas video capture is not supported.");
    }

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size) {
        chunks.push(event.data);
      }
    };

    function drawBase() {
      stripContext.fillStyle = selectedTemplate.background;
      stripContext.fillRect(0, 0, metrics.stripWidth, metrics.stripHeight);
      stripContext.fillStyle = selectedTemplate.ink;
      stripContext.font = `600 ${Math.round(metrics.stripWidth * 0.05)}px Avenir Next, Trebuchet MS, sans-serif`;
      stripContext.textAlign = "center";
      stripContext.fillText("Snap Pop", metrics.stripWidth / 2, metrics.padding * 0.86);
      stripContext.fillStyle = selectedTemplate.accent;
      stripContext.font = `500 ${Math.round(metrics.stripWidth * 0.022)}px Avenir Next, Trebuchet MS, sans-serif`;
      stripContext.fillText(
        selectedTemplate.name,
        metrics.stripWidth / 2,
        metrics.padding * 1.24,
      );
    }

    function drawFrame(video: HTMLVideoElement, index: number) {
      const { x, y } = getFramePosition(index, selectedTemplate.columns, metrics);
      const matSize = Math.max(8, Math.round(metrics.stripWidth * 0.012));

      stripContext.fillStyle = selectedTemplate.mat;
      stripContext.fillRect(
        x - matSize,
        y - matSize,
        metrics.frameWidth + matSize * 2,
        metrics.frameHeight + matSize * 2,
      );
      stripContext.drawImage(video, x, y, metrics.frameWidth, metrics.frameHeight);
    }

    await Promise.all(
      videos.map(async (video) => {
        video.currentTime = 0;
        await video.play();
      }),
    );

    const finishedRecording = new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: mimeType }));
      };
    });
    const startedAt = performance.now();

    recorder.start();

    await new Promise<void>((resolve) => {
      function draw(now: number) {
        drawBase();
        videos.forEach((video, index) => drawFrame(video, index));

        if (now - startedAt < LIVE_CLIP_SECONDS * 1000) {
          requestAnimationFrame(draw);
          return;
        }

        resolve();
      }

      requestAnimationFrame(draw);
    });

    recorder.stop();
    videos.forEach((video) => video.pause());
    stream.getTracks().forEach((track) => track.stop());

    const stripVideo = await finishedRecording;
    const url = URL.createObjectURL(stripVideo);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snap-pop-${selectedTemplate.id}-live-strip.mp4`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadSelectedFormat() {
    setLiveDownloadError(null);

    try {
      if (downloadMode === "video") {
        await downloadLiveClips();
        return;
      }

      await downloadPhotoStrip();
    } catch {
      setLiveDownloadError(
        "Could not export the live strip in this browser. Try recapturing the frames, then download again.",
      );
    }
  }

  async function downloadPhotoStrip() {
    if (!isStripComplete) {
      return;
    }

    const stripWidth = selectedTemplate.outputWidth;
    const padding = Math.round(stripWidth * 0.075);
    const gap = Math.round(stripWidth * 0.032);
    const labelHeight = Math.round(stripWidth * 0.12);
    const contentWidth = stripWidth - padding * 2;
    const columns = selectedTemplate.columns;
    const rows = Math.ceil(selectedTemplate.frameCount / columns);
    const frameWidth = Math.floor((contentWidth - gap * (columns - 1)) / columns);
    const frameHeight = Math.round(frameWidth / selectedTemplate.aspectRatio);
    const stripHeight =
      padding * 2 + labelHeight + frameHeight * rows + gap * (rows - 1);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = stripWidth;
    canvas.height = stripHeight;

    context.fillStyle = selectedTemplate.background;
    context.fillRect(0, 0, stripWidth, stripHeight);
    context.fillStyle = selectedTemplate.ink;
    context.font = `600 ${Math.round(stripWidth * 0.05)}px Avenir Next, Trebuchet MS, sans-serif`;
    context.textAlign = "center";
    context.fillText("Snap Pop", stripWidth / 2, padding * 0.86);
    context.fillStyle = selectedTemplate.accent;
    context.font = `500 ${Math.round(stripWidth * 0.022)}px Avenir Next, Trebuchet MS, sans-serif`;
    context.fillText(selectedTemplate.name, stripWidth / 2, padding * 1.24);

    const loadedPhotos = await Promise.all(
      photos.map((photo) => loadPhoto(photo ?? "")),
    );

    loadedPhotos.forEach((image, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const x = padding + column * (frameWidth + gap);
      const y = padding + labelHeight + row * (frameHeight + gap);
      const matSize = Math.max(8, Math.round(stripWidth * 0.012));

      context.fillStyle = selectedTemplate.mat;
      context.fillRect(
        x - matSize,
        y - matSize,
        frameWidth + matSize * 2,
        frameHeight + matSize * 2,
      );
      context.drawImage(image, x, y, frameWidth, frameHeight);
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 0.94);
    link.download = `snap-pop-${selectedTemplate.id}-${new Date()
      .toISOString()
      .slice(0, 10)}.jpg`;
    link.click();
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-4 py-5 text-[#201c18] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:min-h-[calc(100vh-2.5rem)] lg:flex-row lg:items-start">
        <section className="flex flex-1 flex-col gap-6 lg:sticky lg:top-5">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#8b7158]">
              Snap Pop
            </p>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Pick a frame style, then capture your strip.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[#6f6258]">
                Choose a layout, fill each slot, recapture any frame, and
                download the finished design.
              </p>
            </div>
          </div>

          <div
            className="relative mx-auto max-h-[68vh] overflow-hidden rounded-[1.5rem] bg-[#181511]"
            style={{ aspectRatio: selectedTemplate.aspectRatio }}
          >
            <video
              ref={videoRef}
              className="h-full w-full scale-x-[-1] object-cover"
              muted
              playsInline
              autoPlay
            />

            {cameraState !== "ready" ? (
              <div className="absolute inset-0 grid place-items-center bg-[#201c18] px-8 text-center text-[#fffaf2]">
                <p className="max-w-xs text-sm leading-6">{cameraMessage}</p>
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4 text-white">
              <p className="text-sm">
                Frame {activeFrame + 1} of {selectedTemplate.frameCount}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={capturePhoto}
              disabled={cameraState !== "ready"}
              className="h-14 rounded-full bg-[#201c18] px-8 text-base font-semibold text-[#fffaf2] transition hover:bg-[#3a3129] disabled:cursor-not-allowed disabled:bg-[#b9aa98]"
            >
              {photos[activeFrame] ? "Recapture selected frame" : "Capture"}
            </button>
            <p className="flex min-h-12 items-center text-sm text-[#75685d]">
              {capturedCount}/{selectedTemplate.frameCount} frames captured
              {liveVideoSupported
                ? ` · live clips keep the last ${LIVE_CLIP_SECONDS}s`
                : " · live video unavailable"}
            </p>
          </div>
        </section>

        <aside className="flex w-full flex-col gap-4 lg:max-w-xl">
          <section className="rounded-[2rem] border border-[#e6d8c5] bg-[#fffaf2] p-4 shadow-[0_24px_80px_rgba(83,61,37,0.1)]">
            <div className="mb-4 flex items-center justify-between gap-4 px-1">
              <h2 className="text-lg font-semibold">Frame styles</h2>
              <span className="text-sm text-[#8b7158]">Select first</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {FRAME_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => selectTemplate(template)}
                  className={`rounded-[1.35rem] border p-3 text-left transition ${
                    selectedTemplate.id === template.id
                      ? "border-[#201c18] bg-[#f2e6d4]"
                      : "border-[#eadfce] bg-white hover:border-[#c9ad8d]"
                  }`}
                >
                  <div
                    className="mb-3 grid gap-1.5 rounded-[1rem] p-2"
                    style={{
                      backgroundColor: template.background,
                      gridTemplateColumns: `repeat(${template.columns}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: template.frameCount }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-md"
                        style={{
                          aspectRatio: template.aspectRatio,
                          backgroundColor: template.mat,
                          border: `1px solid ${template.accent}`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{template.name}</p>
                    <p className="text-xs leading-5 text-[#75685d]">
                      {template.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#e6d8c5] bg-[#fffaf2] p-4 shadow-[0_24px_80px_rgba(83,61,37,0.1)]">
            <div className="mb-4 flex items-center justify-between gap-4 px-1">
              <h2 className="text-lg font-semibold">Photo strip</h2>
              <span className="text-sm text-[#8b7158]">Tap to edit</span>
            </div>

            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${selectedTemplate.columns}, minmax(0, 1fr))`,
              }}
            >
              {photos.map((photo, index) => (
                <div
                  key={`${selectedTemplate.id}-${index}`}
                  className={`rounded-[1.35rem] border p-2 transition ${
                    activeFrame === index
                      ? "border-[#201c18] bg-[#f2e6d4]"
                      : "border-[#eadfce] bg-white hover:border-[#c9ad8d]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectFrame(index)}
                    className="relative w-full overflow-hidden rounded-[1rem] bg-[#efe5d7]"
                    style={{ aspectRatio: selectedTemplate.aspectRatio }}
                    aria-label={`Select frame ${index + 1}`}
                  >
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={`Captured frame ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-center text-sm text-[#9a8978]">
                        Frame {index + 1}
                      </div>
                    )}
                  </button>
                  <div className="mt-2 flex items-center justify-between gap-2 px-1">
                    <span className="text-sm font-medium">
                      #{index + 1}
                      {liveClips[index] ? " · Live" : ""}
                    </span>
                    {photo ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearFrame(index);
                        }}
                        className="rounded-full px-2 py-1 text-xs text-[#6f6258] hover:bg-[#eadfce]"
                      >
                        Retake
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-[1.25rem] bg-[#f2e6d4] p-1">
              <button
                type="button"
                onClick={() => setDownloadMode("image")}
                className={`h-11 rounded-full text-sm font-semibold transition ${
                  downloadMode === "image"
                    ? "bg-[#201c18] text-[#fffaf2]"
                    : "text-[#6f6258] hover:bg-[#fffaf2]"
                }`}
              >
                Image strip
              </button>
              <button
                type="button"
                onClick={() => setDownloadMode("video")}
                disabled={!liveVideoSupported}
                className={`h-11 rounded-full text-sm font-semibold transition disabled:cursor-not-allowed disabled:text-[#ad9c89] ${
                  downloadMode === "video"
                    ? "bg-[#201c18] text-[#fffaf2]"
                    : "text-[#6f6258] hover:bg-[#fffaf2]"
                }`}
              >
                Live strip
              </button>
            </div>

            <button
              type="button"
              onClick={() => void downloadSelectedFormat()}
              disabled={
                downloadMode === "image" ? !isStripComplete : !canDownloadLiveClips
              }
              className="mt-4 h-12 w-full rounded-full border border-[#201c18] bg-[#201c18] px-5 text-sm font-semibold text-[#fffaf2] transition hover:bg-[#3a3129] disabled:cursor-not-allowed disabled:border-[#d7c8b6] disabled:bg-[#eadfce] disabled:text-[#8b7158]"
            >
              {downloadMode === "image"
                ? isStripComplete
                  ? `Download ${selectedTemplate.name}`
                  : "Capture all frames to download"
                : canDownloadLiveClips
                  ? `Download ${selectedTemplate.name} MP4`
                  : "Capture all frames to download live strip"}
            </button>
            {liveDownloadError ? (
              <p className="mt-3 text-sm leading-6 text-[#9a4f3c]">
                {liveDownloadError}
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </main>
  );
}
