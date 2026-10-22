import { useState } from "react";
import { AudioUpload, FileUpload, ImagePreview, ImageUpload, VideoUpload } from "@itsrighttime/irt-ui/atoms";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const fileControls: Control[] = [
  { type: "text", name: "label", default: "Upload documents" },
  { type: "number", name: "maxFiles", default: 3, min: 1, max: 10 },
  { type: "number", name: "maxSizeMb", default: 5, min: 1, max: 50 },
  { type: "select", name: "allowedTypes", default: "any", options: ["any", "pdf", "images"] },
  { type: "text", name: "width", default: "360px" },
];

const TYPES: Record<string, string[]> = { any: [], pdf: ["application/pdf"], images: ["image/png", "image/jpeg", "image/webp"] };

function FileDemo({ v }: { v: ControlValues }) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="pg-stack">
      <FileUpload
        label={String(v.label)}
        maxFiles={Number(v.maxFiles)}
        maxSizeMb={Number(v.maxSizeMb)}
        allowedTypes={TYPES[String(v.allowedTypes)] ?? []}
        width={String(v.width)}
        value={files}
        setResult={setFiles}
      />
      <small className="pg-muted">{files.length} file(s)</small>
    </div>
  );
}

function ImageDemo({ v }: { v: ControlValues }) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="pg-row" style={{ alignItems: "flex-start" }}>
      <ImageUpload requireSquare={Boolean(v.requireSquare)} maxSizeMb={Number(v.maxSizeMb)} setResult={setFile} width="280px" />
      <div className="pg-stack">
        <small className="pg-muted">ImagePreview</small>
        <ImagePreview image={file} width="160px" height="160px" />
      </div>
    </div>
  );
}

export const mediaEntries: DocEntry[] = [
  {
    id: "file-upload",
    title: "FileUpload",
    group: "Media",
    description: "Drag-and-drop multi-file upload with type/size/count validation and per-file replace/remove.",
    imports: 'import { FileUpload } from "@itsrighttime/irt-ui";',
    controls: fileControls,
    render: (v) => <FileDemo v={v} />,
    code: (v) =>
      jsx("FileUpload", [
        ...changed(fileControls, v, ["label", "maxFiles", "maxSizeMb", "width"]),
        ["allowedTypes", v.allowedTypes === "any" ? undefined : `{${JSON.stringify(TYPES[String(v.allowedTypes)])}}`],
        ["value", "{files}"],
        ["setResult", "{setFiles}"],
      ]),
  },
  {
    id: "image-upload",
    title: "ImageUpload & ImagePreview",
    group: "Media",
    description: "Single image upload with optional square check, and a preview for URLs or File objects.",
    imports: 'import { ImageUpload, ImagePreview } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "boolean", name: "requireSquare", default: false },
      { type: "number", name: "maxSizeMb", default: 5, min: 1, max: 20 },
    ],
    render: (v) => <ImageDemo v={v} />,
    code: (v) => `<ImageUpload requireSquare={${v.requireSquare}} maxSizeMb={${v.maxSizeMb}} setResult={setAvatar} />\n<ImagePreview image={avatar} />`,
  },
  {
    id: "video-upload",
    title: "VideoUpload",
    group: "Media",
    description: "Single video upload; `preview` shows a player instead of the file summary.",
    imports: 'import { VideoUpload, VideoPlayer } from "@itsrighttime/irt-ui";',
    controls: [{ type: "boolean", name: "preview", default: true }],
    render: (v) => <VideoUpload preview={Boolean(v.preview)} setResult={() => undefined} width="360px" />,
    code: (v) => jsx("VideoUpload", [["preview", v.preview || undefined], ["maxSizeMb", 50], ["setResult", "{setVideo}"]]),
  },
  {
    id: "audio-upload",
    title: "AudioUpload & AudioPlayer",
    group: "Media",
    description: "Audio upload with a custom player (play/pause, keyboard seek, volume).",
    imports: 'import { AudioUpload, AudioPlayer } from "@itsrighttime/irt-ui";',
    render: () => <AudioUpload label="Voice note" setResult={() => undefined} width="420px" />,
    code: () => '<AudioUpload label="Voice note" setResult={setAudio} />\n<AudioPlayer audioSrc={url} onRemove={clear} />',
  },
];
