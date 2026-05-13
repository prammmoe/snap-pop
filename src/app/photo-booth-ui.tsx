import type { CSSProperties, RefObject } from "react";
import {
  FRAME_TEMPLATES,
  LIVE_CLIP_SECONDS,
  PHOTO_FILTERS,
  type AppStep,
  type CameraState,
  type DownloadMode,
  type FrameTemplate,
  type LiveClip,
  type PhotoFilter,
  getTemplateRows,
} from "./photo-booth";

type HeaderProps = {
  appStep: AppStep;
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
  onSelectTemplate: (template: FrameTemplate) => void;
};

type FilterDownloadPanelProps = {
  canDownloadLiveClips: boolean;
  downloadMode: DownloadMode;
  isStripComplete: boolean;
  liveDownloadError: string | null;
  liveVideoSupported: boolean;
  selectedFilter: PhotoFilter;
  selectedTemplate: FrameTemplate;
  onDownload: () => void;
  onSelectDownloadMode: (mode: DownloadMode) => void;
  onSelectFilter: (filterId: string) => void;
};

export function AppHeader({ appStep }: HeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#8b7158]">
        Snap Pop
      </p>
      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b7158]">
        <span className={appStep === "welcome" ? "text-[#201c18]" : ""}>
          Welcome
        </span>
        <span className={appStep === "frames" ? "text-[#201c18]" : ""}>
          Frames
        </span>
        <span className={appStep === "capture" ? "text-[#201c18]" : ""}>
          Capture
        </span>
      </div>
    </header>
  );
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <section className="grid min-h-[calc(100vh-7rem)] place-items-center">
      <div className="max-w-3xl space-y-7 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Make a photo booth strip in your browser.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#6f6258] sm:text-lg">
            Pick a frame, capture each slot, add a finish, and download a
            polished Snap Pop strip.
          </p>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="h-14 rounded-full bg-[#201c18] px-9 text-base font-semibold text-[#fffaf2] transition hover:bg-[#3a3129]"
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
          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Pick a frame style.
          </h1>
          <p className="max-w-xl text-base leading-7 text-[#6f6258]">
            Choose the layout for this strip before opening the camera.
          </p>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="h-12 rounded-full bg-[#201c18] px-7 text-sm font-semibold text-[#fffaf2] transition hover:bg-[#3a3129]"
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
        <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Capture your strip.
        </h1>
        <p className="max-w-xl text-base leading-7 text-[#6f6258]">
          {selectedTemplate.name} · {capturedCount}/
          {selectedTemplate.frameCount} frames captured
        </p>
      </div>

      <div
        className="relative mx-auto max-h-[68vh] overflow-hidden rounded-[1.5rem] bg-[#181511]"
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
          onClick={onCapturePhoto}
          disabled={cameraState !== "ready"}
          className="h-14 rounded-full bg-[#201c18] px-8 text-base font-semibold text-[#fffaf2] transition hover:bg-[#3a3129] disabled:cursor-not-allowed disabled:bg-[#b9aa98]"
        >
          {photos[activeFrame] ? "Recapture selected frame" : "Capture"}
        </button>
        <p className="flex min-h-12 items-center text-sm text-[#75685d]">
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
    <section className="rounded-[2rem] border border-[#e6d8c5] bg-[#fffaf2] p-4 shadow-[0_24px_80px_rgba(83,61,37,0.1)]">
      <div className="mb-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="text-sm text-[#8b7158]">Tap a slot to edit</p>
        </div>
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
          className="h-11 rounded-full border border-[#d7c8b6] bg-white px-4 text-sm font-semibold text-[#201c18]"
          aria-label="Select frame style"
        >
          {FRAME_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
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

export function FilterDownloadPanel({
  canDownloadLiveClips,
  downloadMode,
  isStripComplete,
  liveDownloadError,
  liveVideoSupported,
  selectedFilter,
  selectedTemplate,
  onDownload,
  onSelectDownloadMode,
  onSelectFilter,
}: FilterDownloadPanelProps) {
  const canDownload =
    downloadMode === "image" ? isStripComplete : canDownloadLiveClips;

  return (
    <section className="rounded-[2rem] border border-[#e6d8c5] bg-[#fffaf2] p-4 shadow-[0_24px_80px_rgba(83,61,37,0.1)]">
      <div className="mb-4 flex items-center justify-between gap-4 px-1">
        <h2 className="text-lg font-semibold">Filter</h2>
        <span className="text-sm text-[#8b7158]">{selectedFilter.name}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PHOTO_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onSelectFilter(filter.id)}
            className={`h-11 rounded-full px-3 text-sm font-semibold transition ${
              selectedFilter.id === filter.id
                ? "bg-[#201c18] text-[#fffaf2]"
                : "bg-[#f2e6d4] text-[#6f6258] hover:bg-[#eadfce]"
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-[1.25rem] bg-[#f2e6d4] p-1">
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
      className={`rounded-[1.35rem] border p-3 text-left transition ${
        selected
          ? "border-[#201c18] bg-[#f2e6d4]"
          : "border-[#eadfce] bg-white hover:border-[#c9ad8d]"
      }`}
    >
      <FrameTemplatePreview template={template} />
      <div className="space-y-1">
        <p className="text-sm font-semibold">{template.name}</p>
        <p className="text-xs leading-5 text-[#75685d]">
          {template.description}
        </p>
      </div>
    </button>
  );
}

function FrameTemplatePreview({ template }: { template: FrameTemplate }) {
  return (
    <div
      className="mb-3 grid h-64 gap-1.5 rounded-[1rem] p-2"
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
      className={`rounded-[1.35rem] border p-2 transition ${
        active
          ? "border-[#201c18] bg-[#f2e6d4]"
          : "border-[#eadfce] bg-white hover:border-[#c9ad8d]"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
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
            style={previewStyle}
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
          {liveClip ? " · Live" : ""}
        </span>
        {photo ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClear();
            }}
            className="rounded-full px-2 py-1 text-xs text-[#6f6258] hover:bg-[#eadfce]"
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
      className={`h-11 rounded-full text-sm font-semibold transition disabled:cursor-not-allowed disabled:text-[#ad9c89] ${
        active ? "bg-[#201c18] text-[#fffaf2]" : "text-[#6f6258] hover:bg-[#fffaf2]"
      }`}
    >
      {label}
    </button>
  );
}
