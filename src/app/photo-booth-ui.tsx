"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react";
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
  type PhotoFilter,
  drawFrameDesign,
  drawStripBase,
  drawStripFrame,
  getStripMetrics,
  getTemplateRows,
  loadPhoto,
} from "./photo-booth";

type HeaderProps = {
  appStep: AppStep;
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
};

type WelcomeScreenProps = {
  onStart: () => void;
};

type FrameSelectionScreenProps = {
  selectedTemplate: FrameTemplate;
  onSelectTemplate: (template: FrameTemplate) => void;
  onContinue: () => void;
};

type CaptureCameraPanelProps = {
  activeFrame: number;
  cameraMessage: string;
  cameraState: CameraState;
  capturedCount: number;
  filteredMediaStyle: CSSProperties;
  liveVideoSupported: boolean;
  photos: (string | null)[];
  selectedTemplate: FrameTemplate;
  videoRef: RefObject<HTMLVideoElement | null>;
  onCapturePhoto: () => void;
};

type PreviewPanelProps = {
  activeFrame: number;
  filteredMediaStyle: CSSProperties;
  liveClips: (LiveClip | null)[];
  photos: (string | null)[];
  selectedTemplate: FrameTemplate;
  onClearFrame: (index: number) => void;
  onSelectFrame: (index: number) => void;
  onSelectTemplate?: (template: FrameTemplate) => void;
};

type FinishPreviewPanelProps = {
  photos: (string | null)[];
  selectedFilter: PhotoFilter;
  selectedFrameDesign: FrameDesign;
  selectedTemplate: FrameTemplate;
};

type FilterDownloadPanelProps = {
  canDownloadLiveClips: boolean;
  downloadMode: DownloadMode;
  isStripComplete: boolean;
  liveDownloadError: string | null;
  liveVideoSupported: boolean;
  selectedFrameDesign: FrameDesign;
  selectedFilter: PhotoFilter;
  selectedTemplate: FrameTemplate;
  onDownload: () => void;
  onSelectFrameDesign: (frameDesignId: string) => void;
  onSelectDownloadMode: (mode: DownloadMode) => void;
  onSelectFilter: (filterId: string) => void;
};

type CaptureNextPanelProps = {
  isStripComplete: boolean;
  selectedTemplate: FrameTemplate;
  onContinue: () => void;
};

export function AppHeader({ appStep, themeMode, onToggleTheme }: HeaderProps) {
  return (
    <header className="site-header">
      <p className="brand-mark">Snap Pop</p>
      <div className="header-controls">
        <div className="step-list">
          <span
            className={`step-pill ${
              appStep === "welcome" ? "step-pill-active" : ""
            }`}
          >
            Welcome
          </span>
          <span
            className={`step-pill ${
              appStep === "frames" ? "step-pill-active" : ""
            }`}
          >
            Layout
          </span>
          <span
            className={`step-pill ${
              appStep === "capture" ? "step-pill-active" : ""
            }`}
          >
            Capture
          </span>
          <span
            className={`step-pill ${
              appStep === "finish" ? "step-pill-active" : ""
            }`}
          >
            Finish
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}
        >
          {themeMode === "light" ? (
            <SunIcon />
          ) : (
            <MoonIcon />
          )}
        </button>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg
      className="theme-toggle-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="theme-toggle-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M20.2 14.7A8.1 8.1 0 0 1 9.3 3.8a8.1 8.1 0 1 0 10.9 10.9Z" />
    </svg>
  );
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <section className="hero-panel">
      <div className="hero-content space-y-7">
        <div className="space-y-4">
          <h1 className="page-title mx-auto">
            Make a photo booth strip in your browser.
          </h1>
          <p className="body-copy mx-auto max-w-2xl">
            Pick a layout, capture each slot, add a frame, and download a
            polished Snap Pop strip.
          </p>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="primary-action"
        >
          Start
        </button>
      </div>
    </section>
  );
}

export function FrameSelectionScreen({
  selectedTemplate,
  onSelectTemplate,
  onContinue,
}: FrameSelectionScreenProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <h1 className="page-title">Pick a layout.</h1>
          <p className="body-copy max-w-xl">
            Choose the layout for this strip before opening the camera.
          </p>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="primary-action"
        >
          Continue
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {FRAME_TEMPLATES.map((template) => (
          <FrameTemplateCard
            key={template.id}
            template={template}
            selected={selectedTemplate.id === template.id}
            onSelect={() => onSelectTemplate(template)}
          />
        ))}
      </div>
    </section>
  );
}

export function CaptureCameraPanel({
  activeFrame,
  cameraMessage,
  cameraState,
  capturedCount,
  filteredMediaStyle,
  liveVideoSupported,
  photos,
  selectedTemplate,
  videoRef,
  onCapturePhoto,
}: CaptureCameraPanelProps) {
  return (
    <section className="flex flex-col gap-5 lg:sticky lg:top-5">
      <div className="space-y-3">
        <h1 className="page-title">Capture your strip.</h1>
        <p className="body-copy max-w-xl">
          {selectedTemplate.name} layout · {capturedCount}/
          {selectedTemplate.frameCount} frames captured
        </p>
      </div>

      <div
        className="camera-window"
        style={{ aspectRatio: selectedTemplate.aspectRatio }}
      >
        <video
          ref={videoRef}
          className="h-full w-full scale-x-[-1] object-cover"
          style={filteredMediaStyle}
          muted
          playsInline
          autoPlay
        />

        {cameraState !== "ready" ? (
          <div className="absolute inset-0 grid place-items-center bg-[#243027] px-8 text-center text-[#fff8df]">
            <p className="max-w-xs text-sm leading-6">{cameraMessage}</p>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#243027]/75 to-transparent p-4 text-[#fff8df]">
          <p className="text-sm font-bold">
            Frame {activeFrame + 1} of {selectedTemplate.frameCount}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCapturePhoto}
          disabled={cameraState !== "ready"}
          className="primary-action"
        >
          {photos[activeFrame] ? "Recapture selected frame" : "Capture"}
        </button>
        <p className="mini-label flex min-h-12 items-center">
          {liveVideoSupported
            ? `Live clips keep the last ${LIVE_CLIP_SECONDS}s`
            : "Live video unavailable"}
        </p>
      </div>
    </section>
  );
}

export function PreviewPanel({
  activeFrame,
  filteredMediaStyle,
  liveClips,
  photos,
  selectedTemplate,
  onClearFrame,
  onSelectFrame,
  onSelectTemplate,
}: PreviewPanelProps) {
  return (
    <section className="nouveau-card">
      <div className="mb-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="section-title">Preview</h2>
          <p className="mini-label">Tap a slot to edit</p>
        </div>
        {onSelectTemplate ? (
          <select
            value={selectedTemplate.id}
            onChange={(event) => {
              const nextTemplate = FRAME_TEMPLATES.find(
                (template) => template.id === event.target.value,
              );

              if (nextTemplate) {
                onSelectTemplate(nextTemplate);
              }
            }}
            className="select-input"
            aria-label="Select layout"
          >
            {FRAME_TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${selectedTemplate.columns}, minmax(0, 1fr))`,
        }}
      >
        {photos.map((photo, index) => (
          <PhotoSlotCard
            key={`${selectedTemplate.id}-${index}`}
            active={activeFrame === index}
            index={index}
            liveClip={liveClips[index]}
            photo={photo}
            previewStyle={filteredMediaStyle}
            selectedTemplate={selectedTemplate}
            onClear={() => onClearFrame(index)}
            onSelect={() => onSelectFrame(index)}
          />
        ))}
      </div>
    </section>
  );
}

export function CaptureNextPanel({
  isStripComplete,
  selectedTemplate,
  onContinue,
}: CaptureNextPanelProps) {
  return (
    <section className="nouveau-card">
      <div className="space-y-2 px-1">
        <h2 className="section-title">Next step</h2>
        <p className="mini-label">
          {isStripComplete
            ? "Your photos are ready. Move to frame design, filter, and download."
            : `Capture all ${selectedTemplate.frameCount} slots before choosing the final frame.`}
        </p>
      </div>
      <button
        type="button"
        onClick={onContinue}
        disabled={!isStripComplete}
        className="primary-action mt-4 w-full"
      >
        Choose frame & download
      </button>
    </section>
  );
}

export function FinishPreviewPanel({
  photos,
  selectedFilter,
  selectedFrameDesign,
  selectedTemplate,
}: FinishPreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const metrics = useMemo(
    () => getStripMetrics(selectedTemplate),
    [selectedTemplate],
  );

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const completePhotos = photos.filter((photo): photo is string => Boolean(photo));

    if (!canvas || completePhotos.length !== selectedTemplate.frameCount) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const previewContext = context;
    canvas.width = metrics.stripWidth;
    canvas.height = metrics.stripHeight;

    async function drawPreview() {
      const loadedPhotos = await Promise.all(completePhotos.map(loadPhoto));

      if (cancelled) {
        return;
      }

      drawStripBase(previewContext, selectedTemplate, selectedFrameDesign, metrics);
      loadedPhotos.forEach((image, index) => {
        drawStripFrame(
          previewContext,
          image,
          index,
          selectedTemplate,
          metrics,
          selectedFilter.canvasFilter,
        );
      });
      drawFrameDesign(previewContext, selectedFrameDesign, metrics);
    }

    void drawPreview();

    return () => {
      cancelled = true;
    };
  }, [metrics, photos, selectedFilter, selectedFrameDesign, selectedTemplate]);

  return (
    <section className="nouveau-card">
      <div className="mb-4 flex items-center justify-between gap-4 px-1">
        <div>
          <h2 className="section-title">Final preview</h2>
          <p className="mini-label">{selectedFrameDesign.name}</p>
        </div>
        <span className="mini-label">{selectedFilter.name}</span>
      </div>

      <div className="preview-well grid justify-items-center">
        <canvas
          ref={canvasRef}
          className="max-h-[68vh] w-auto max-w-full rounded-[1rem] shadow-[0_16px_42px_rgba(36,48,39,0.22)]"
          style={{ aspectRatio: `${metrics.stripWidth} / ${metrics.stripHeight}` }}
          aria-label="Final photo strip preview"
        />
      </div>
    </section>
  );
}

export function FilterDownloadPanel({
  canDownloadLiveClips,
  downloadMode,
  isStripComplete,
  liveDownloadError,
  liveVideoSupported,
  selectedFrameDesign,
  selectedFilter,
  selectedTemplate,
  onDownload,
  onSelectFrameDesign,
  onSelectDownloadMode,
  onSelectFilter,
}: FilterDownloadPanelProps) {
  const canDownload =
    downloadMode === "image" ? isStripComplete : canDownloadLiveClips;

  return (
    <section className="nouveau-card">
      <div className="mb-4 flex items-center justify-between gap-4 px-1">
        <h2 className="section-title">Finish & download</h2>
        <span className="mini-label">{selectedFrameDesign.name}</span>
      </div>

      {!isStripComplete ? (
        <div className="rounded-[1.25rem] border-2 border-[#243027] bg-[#f4cc65] p-4 text-sm font-bold leading-6 text-[#243027]">
          Capture every slot to unlock frame designs, filters, and downloads.
        </div>
      ) : null}

      {isStripComplete ? (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 px-1">
              <h3 className="text-sm font-black uppercase tracking-[0.08em]">
                Frame design
              </h3>
              <span className="mini-label">Choose last</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FRAME_DESIGNS.map((frameDesign) => (
                <FrameDesignButton
                  key={frameDesign.id}
                  frameDesign={frameDesign}
                  selected={selectedFrameDesign.id === frameDesign.id}
                  onSelect={() => onSelectFrameDesign(frameDesign.id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 px-1">
            <h3 className="text-sm font-black uppercase tracking-[0.08em]">
              Filter
            </h3>
            <span className="mini-label">{selectedFilter.name}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PHOTO_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => onSelectFilter(filter.id)}
                className={`secondary-action px-3 py-2 text-sm ${
                  selectedFilter.id === filter.id
                    ? "bg-[#f4cc65]"
                    : ""
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <div className="segmented-control mt-4">
        <DownloadModeButton
          active={downloadMode === "image"}
          label="Image strip"
          onClick={() => onSelectDownloadMode("image")}
        />
        <DownloadModeButton
          active={downloadMode === "video"}
          disabled={!liveVideoSupported}
          label="Live strip"
          onClick={() => onSelectDownloadMode("video")}
        />
      </div>

      <button
        type="button"
        onClick={onDownload}
        disabled={!canDownload}
        className="primary-action mt-4 w-full"
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
        <p className="mt-3 text-sm font-bold leading-6 text-[#b64f44]">
          {liveDownloadError}
        </p>
      ) : null}
    </section>
  );
}

type FrameTemplateCardProps = {
  selected: boolean;
  template: FrameTemplate;
  onSelect: () => void;
};

function FrameTemplateCard({
  selected,
  template,
  onSelect,
}: FrameTemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`choice-card ${selected ? "choice-card-selected" : ""}`}
    >
      <FrameTemplatePreview template={template} />
      <div className="space-y-1">
        <p className="text-sm font-black uppercase tracking-[0.05em]">
          {template.name}
        </p>
        <p className="mini-label text-xs">
          {template.description}
        </p>
      </div>
    </button>
  );
}

type FrameDesignButtonProps = {
  frameDesign: FrameDesign;
  selected: boolean;
  onSelect: () => void;
};

function FrameDesignButton({
  frameDesign,
  selected,
  onSelect,
}: FrameDesignButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`choice-card ${selected ? "choice-card-selected" : ""}`}
    >
      <FrameDesignPreview frameDesign={frameDesign} />
      <p className="mt-2 text-xs font-black uppercase leading-4 tracking-[0.05em]">
        {frameDesign.name}
      </p>
      <p className="mini-label mt-1 text-[0.7rem]">
        {frameDesign.description}
      </p>
    </button>
  );
}

function FrameDesignPreview({ frameDesign }: { frameDesign: FrameDesign }) {
  return (
    <div
      className="relative h-24 overflow-hidden rounded-xl border-2"
      style={{
        backgroundColor: frameDesign.background,
        borderColor: frameDesign.accent,
      }}
    >
      <div
        className="absolute inset-x-3 top-3 h-3 rounded-sm"
        style={{ backgroundColor: frameDesign.accent }}
      />
      <div
        className="absolute inset-x-5 bottom-4 top-8 rounded-md bg-white/85"
        style={{ border: `2px solid ${frameDesign.secondary}` }}
      />
      <div
        className="absolute -left-3 bottom-2 h-8 w-8 rounded-full"
        style={{ backgroundColor: frameDesign.secondary }}
      />
      <div
        className="absolute -right-3 top-7 h-8 w-8 rounded-full"
        style={{ backgroundColor: frameDesign.secondary }}
      />
    </div>
  );
}

function FrameTemplatePreview({ template }: { template: FrameTemplate }) {
  return (
    <div
      className="mb-3 grid h-64 gap-1.5 rounded-[1rem] border-2 border-[#243027] p-2"
      style={{
        backgroundColor: template.background,
        gridTemplateColumns: `repeat(${template.columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${getTemplateRows(template)}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: template.frameCount }).map((_, index) => (
        <div
          key={index}
          className="min-h-0 justify-self-center rounded-md"
          style={{
            height: "100%",
            maxWidth: "100%",
            aspectRatio: template.aspectRatio,
            backgroundColor: template.mat,
            border: `1px solid ${template.accent}`,
          }}
        />
      ))}
    </div>
  );
}

type PhotoSlotCardProps = {
  active: boolean;
  index: number;
  liveClip: LiveClip | null;
  photo: string | null;
  previewStyle: CSSProperties;
  selectedTemplate: FrameTemplate;
  onClear: () => void;
  onSelect: () => void;
};

function PhotoSlotCard({
  active,
  index,
  liveClip,
  photo,
  previewStyle,
  selectedTemplate,
  onClear,
  onSelect,
}: PhotoSlotCardProps) {
  return (
    <div
      className={`slot-card ${active ? "slot-card-active" : ""}`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="relative w-full overflow-hidden rounded-[0.85rem] border-2 border-[#243027] bg-[#efe3bd]"
        style={{ aspectRatio: selectedTemplate.aspectRatio }}
        aria-label={`Select frame ${index + 1}`}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={`Captured frame ${index + 1}`}
            className="h-full w-full object-cover"
            style={previewStyle}
          />
        ) : (
          <div className="grid h-full place-items-center text-center text-sm font-bold text-[#6f6a51]">
            Frame {index + 1}
          </div>
        )}
      </button>
      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <span className="text-sm font-black">
          #{index + 1}
          {liveClip ? " · Live" : ""}
        </span>
        {photo ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClear();
            }}
            className="rounded-full border border-[#243027] bg-[#fff8df] px-2 py-1 text-xs font-black text-[#243027] hover:bg-[#f4cc65]"
          >
            Retake
          </button>
        ) : null}
      </div>
    </div>
  );
}

type DownloadModeButtonProps = {
  active: boolean;
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

function DownloadModeButton({
  active,
  label,
  disabled = false,
  onClick,
}: DownloadModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`secondary-action px-3 py-2 text-sm disabled:shadow-none ${
        active ? "bg-[#f4cc65]" : "bg-[#fff8df]"
      }`}
    >
      {label}
    </button>
  );
}
