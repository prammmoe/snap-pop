"use client";

import { useEffect, useRef, useState } from "react";
import {
  AppHeader,
  CaptureCameraPanel,
  CaptureNextPanel,
  FilterDownloadPanel,
  FinishPreviewPanel,
  FrameSelectionScreen,
  PreviewPanel,
  WelcomeScreen,
} from "./photo-booth-ui";
import {
  FRAME_DESIGNS,
  FRAME_TEMPLATES,
  LIVE_CLIP_SECONDS,
  PHOTO_FILTERS,
  type AppStep,
  type CameraState,
  type DownloadMode,
  type FrameDesign,
  type FrameTemplate,
  type LiveClip,
  createCapturedPhotoCanvas,
  createEmptyLiveClips,
  createEmptyPhotos,
  drawFrameDesign,
  drawStripBase,
  drawStripFrame,
  getFilterById,
  getFrameDesignById,
  getStripMetrics,
  getSupportedMp4MimeType,
  getTemplateById,
  loadPhoto,
  loadVideo,
} from "./photo-booth";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const liveChunksRef = useRef<Blob[]>([]);
  const liveClipUrlsRef = useRef<string[]>([]);
  const liveMimeTypeRef = useRef<string | null>(null);
  const liveRestartTimeoutRef = useRef<number | null>(null);
  const isRestartingLiveRecorderRef = useRef(false);

  const [appStep, setAppStep] = useState<AppStep>("welcome");
  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const [downloadMode, setDownloadMode] = useState<DownloadMode>("image");
  const [filterId, setFilterId] = useState(PHOTO_FILTERS[0].id);
  const [frameDesignId, setFrameDesignId] = useState(FRAME_DESIGNS[0].id);
  const [liveDownloadError, setLiveDownloadError] = useState<string | null>(
    null,
  );
  const [liveVideoSupported, setLiveVideoSupported] = useState(false);
  const [templateId, setTemplateId] = useState(FRAME_TEMPLATES[0].id);

  const selectedTemplate = getTemplateById(templateId);
  const selectedFilter = getFilterById(filterId);
  const selectedFrameDesign = getFrameDesignById(frameDesignId);
  const filteredMediaStyle = { filter: selectedFilter.previewFilter };
  const [photos, setPhotos] = useState<(string | null)[]>(
    createEmptyPhotos(selectedTemplate.frameCount),
  );
  const [liveClips, setLiveClips] = useState<(LiveClip | null)[]>(
    createEmptyLiveClips(selectedTemplate.frameCount),
  );
  const [activeFrame, setActiveFrame] = useState(0);

  const capturedCount = photos.filter(Boolean).length;
  const liveClipCount = liveClips.filter(Boolean).length;
  const isStripComplete = capturedCount === selectedTemplate.frameCount;
  const isLiveStripComplete = liveClipCount === selectedTemplate.frameCount;
  const canDownloadLiveClips = liveVideoSupported && isLiveStripComplete;
  const cameraMessage =
    cameraState === "unsupported"
      ? "This browser does not support camera capture."
      : "Allow camera access to start your photo strip.";

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
    if (appStep !== "capture") {
      return;
    }

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
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
    // Camera setup should run once per capture session; tying it to recorder
    // helper identity would reset the camera and discard capture progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStep]);

  useEffect(() => {
    return () => {
      liveClipUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      liveClipUrlsRef.current = [];
    };
  }, []);

  function selectTemplate(template: FrameTemplate) {
    setTemplateId(template.id);
    setPhotos(createEmptyPhotos(template.frameCount));
    liveClipUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    liveClipUrlsRef.current = [];
    setLiveClips(createEmptyLiveClips(template.frameCount));
    setActiveFrame(0);
  }

  function openCaptureStep() {
    setCameraState("loading");
    setAppStep("capture");
  }

  function openFinishStep() {
    if (!isStripComplete) {
      return;
    }

    setAppStep("finish");
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
    const recorderMimeType =
      recorder.mimeType || liveMimeTypeRef.current || "video/mp4";
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

    const canvas = createCapturedPhotoCanvas(video, selectedTemplate);

    if (!canvas) {
      return;
    }

    const nextPhotos = [...photos];
    nextPhotos[frameIndex] = canvas.toDataURL("image/jpeg", 0.92);
    setPhotos(nextPhotos);
    await captureLiveClip(frameIndex);

    const nextEmptyFrame = nextPhotos.findIndex((photo) => photo === null);

    if (nextEmptyFrame !== -1) {
      setActiveFrame(nextEmptyFrame);
    }
  }

  async function captureLiveClip(frameIndex: number) {
    const liveClip = await getLiveClip();

    if (!liveClip) {
      return;
    }

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

  async function downloadLiveClips() {
    const mimeType = getSupportedMp4MimeType();

    if (!canDownloadLiveClips || !mimeType) {
      return;
    }

    const canvas = createStripCanvas(selectedTemplate);

    if (!canvas || typeof canvas.captureStream !== "function") {
      throw new Error("Canvas video capture is not supported.");
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const clips = liveClips.filter((clip): clip is LiveClip => clip !== null);
    const videos = await Promise.all(clips.map((clip) => loadVideo(clip.url)));
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size) {
        chunks.push(event.data);
      }
    };

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
    recorder.start();
    await drawLiveStrip(context, videos, selectedTemplate);
    recorder.stop();
    videos.forEach((video) => video.pause());
    stream.getTracks().forEach((track) => track.stop());

    const stripVideo = await finishedRecording;
    downloadObjectUrl(
      URL.createObjectURL(stripVideo),
      `snap-pop-${selectedTemplate.id}-${selectedFrameDesign.id}-live-strip.mp4`,
    );
  }

  async function downloadPhotoStrip() {
    if (!isStripComplete) {
      return;
    }

    const canvas = createStripCanvas(selectedTemplate);
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const loadedPhotos = await Promise.all(
      photos.map((photo) => loadPhoto(photo ?? "")),
    );

    drawStrip(context, loadedPhotos, selectedTemplate, selectedFrameDesign);

    const fileDate = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 0.94);
    link.download = `snap-pop-${selectedTemplate.id}-${selectedFrameDesign.id}-${fileDate}.jpg`;
    link.click();
  }

  function createStripCanvas(template: FrameTemplate) {
    const metrics = getStripMetrics(template);
    const canvas = document.createElement("canvas");
    canvas.width = metrics.stripWidth;
    canvas.height = metrics.stripHeight;

    return canvas;
  }

  function drawStrip(
    context: CanvasRenderingContext2D,
    images: CanvasImageSource[],
    template: FrameTemplate,
    frameDesign: FrameDesign,
  ) {
    const metrics = getStripMetrics(template);

    drawStripBase(context, template, frameDesign, metrics);
    images.forEach((image, index) => {
      drawStripFrame(
        context,
        image,
        index,
        template,
        metrics,
        selectedFilter.canvasFilter,
      );
    });
    drawFrameDesign(context, frameDesign, metrics);
  }

  function drawLiveStrip(
    context: CanvasRenderingContext2D,
    videos: HTMLVideoElement[],
    template: FrameTemplate,
  ) {
    return new Promise<void>((resolve) => {
      let startedAt: number | null = null;

      function draw(now: number) {
        startedAt ??= now;
        drawStrip(context, videos, template, selectedFrameDesign);

        if (now - startedAt < LIVE_CLIP_SECONDS * 1000) {
          requestAnimationFrame(draw);
          return;
        }

        resolve();
      }

      requestAnimationFrame(draw);
    });
  }

  function downloadObjectUrl(url: string, filename: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <AppHeader appStep={appStep} />

        {appStep === "welcome" ? (
          <WelcomeScreen onStart={() => setAppStep("frames")} />
        ) : null}

        {appStep === "frames" ? (
          <FrameSelectionScreen
            selectedTemplate={selectedTemplate}
            onSelectTemplate={selectTemplate}
            onContinue={openCaptureStep}
          />
        ) : null}

        {appStep === "capture" ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] lg:items-start">
            <CaptureCameraPanel
              activeFrame={activeFrame}
              cameraMessage={cameraMessage}
              cameraState={cameraState}
              capturedCount={capturedCount}
              filteredMediaStyle={filteredMediaStyle}
              liveVideoSupported={liveVideoSupported}
              photos={photos}
              selectedTemplate={selectedTemplate}
              videoRef={videoRef}
              onCapturePhoto={() => void capturePhoto()}
            />

            <aside className="flex flex-col gap-4">
              <PreviewPanel
                activeFrame={activeFrame}
                filteredMediaStyle={filteredMediaStyle}
                liveClips={liveClips}
                photos={photos}
                selectedTemplate={selectedTemplate}
                onClearFrame={clearFrame}
                onSelectFrame={setActiveFrame}
                onSelectTemplate={selectTemplate}
              />
              <CaptureNextPanel
                isStripComplete={isStripComplete}
                selectedTemplate={selectedTemplate}
                onContinue={openFinishStep}
              />
            </aside>
          </div>
        ) : null}

        {appStep === "finish" ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] lg:items-start">
            <section className="space-y-4">
              <div className="space-y-3">
                <h1 className="page-title">Choose your frame.</h1>
                <p className="body-copy max-w-xl">
                  Pick a final frame design, choose a filter, then download your
                  strip.
                </p>
              </div>
              <FinishPreviewPanel
                photos={photos}
                selectedFilter={selectedFilter}
                selectedFrameDesign={selectedFrameDesign}
                selectedTemplate={selectedTemplate}
              />
            </section>

            <aside className="flex flex-col gap-4">
              <FilterDownloadPanel
                canDownloadLiveClips={canDownloadLiveClips}
                downloadMode={downloadMode}
                isStripComplete={isStripComplete}
                liveDownloadError={liveDownloadError}
                liveVideoSupported={liveVideoSupported}
                selectedFrameDesign={selectedFrameDesign}
                selectedFilter={selectedFilter}
                selectedTemplate={selectedTemplate}
                onDownload={() => void downloadSelectedFormat()}
                onSelectFrameDesign={setFrameDesignId}
                onSelectDownloadMode={setDownloadMode}
                onSelectFilter={setFilterId}
              />
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  );
}
