import { useState } from "react";
import { AudioUpload, FileUpload, ImagePreview, ImageUpload, VideoUpload } from "@itsrighttime/irt-ui/atoms";
import { useLog } from "../../state/events";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const TYPES: Record<string, string[]> = { any: [], pdf: ["application/pdf"], images: ["image/png", "image/jpeg", "image/webp"] };

const fileControls: Control[] = [
  { type: "text", name: "label", default: "Attachments", group: "Content" },
  { type: "text", name: "dropzoneText", default: "", group: "Content", placeholder: "Drop files here" },
  { type: "text", name: "hint", default: "", group: "Content", placeholder: "derived from limits" },
  { type: "text", name: "helperText", default: "", group: "Content", placeholder: "none" },
  { type: "number", name: "maxFiles", default: 3, min: 1, max: 10, group: "Validation", libDefault: null },
  { type: "number", name: "maxSizeMb", default: 5, min: 1, max: 50, group: "Validation", libDefault: null },
  { type: "select", name: "allowedTypes", default: "any", options: ["any", "pdf", "images"], group: "Validation" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "text", name: "width", default: "380px", group: "Appearance" },
  { type: "text", name: "height", default: "160px", group: "Appearance", hint: "Drop zone min-height" },
  { type: "boolean", name: "allowPreview", default: true, group: "Behavior", hint: "Click a file name to open it" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function FileDemo({ v }: { v: ControlValues }) {
  const [files, setFiles] = useState<File[]>([]);
  const log = useLog();
  return (
    <FileUpload
      label={String(v.label)}
      dropzoneText={String(v.dropzoneText) || undefined}
      hint={String(v.hint) || undefined}
      helperText={String(v.helperText) || undefined}
      maxFiles={Number(v.maxFiles)}
      maxSizeMb={Number(v.maxSizeMb)}
      allowedTypes={TYPES[String(v.allowedTypes)] ?? []}
      required={Boolean(v.required)}
      allowPreview={Boolean(v.allowPreview)}
      disabled={Boolean(v.disabled)}
      width={String(v.width)}
      height={String(v.height)}
      value={files}
      setIsFieldValid={(valid) => log("setIsFieldValid", valid)}
      setResult={(next) => {
        setFiles(next);
        log("setResult", next);
      }}
    />
  );
}

const imageControls: Control[] = [
  { type: "text", name: "label", default: "Profile photo", group: "Content" },
  { type: "text", name: "helperText", default: "Shown on your public profile", group: "Content" },
  { type: "boolean", name: "requireSquare", default: false, group: "Validation" },
  { type: "number", name: "maxSizeMb", default: 5, min: 1, max: 20, group: "Validation" },
  { type: "select", name: "fit", default: "cover", options: ["cover", "contain"], group: "Appearance" },
  { type: "text", name: "width", default: "260px", group: "Appearance" },
  { type: "text", name: "height", default: "200px", group: "Appearance" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function ImageDemo({ v }: { v: ControlValues }) {
  const [file, setFile] = useState<File | null>(null);
  const log = useLog();
  return (
    <div className="pg-row pg-top">
      <ImageUpload
        label={String(v.label)}
        helperText={String(v.helperText) || undefined}
        requireSquare={Boolean(v.requireSquare)}
        maxSizeMb={Number(v.maxSizeMb)}
        fit={v.fit as "cover"}
        disabled={Boolean(v.disabled)}
        width={String(v.width)}
        height={String(v.height)}
        setIsFieldValid={(valid) => log("setIsFieldValid", valid)}
        setResult={(next) => {
          setFile(next);
          log("setResult", next);
        }}
      />
      <div className="pg-stack">
        <span className="pg-control-label">ImagePreview</span>
        <ImagePreview image={file} width="160px" height="160px" fit={v.fit as "cover"} />
      </div>
    </div>
  );
}

const videoControls: Control[] = [
  { type: "text", name: "label", default: "Intro video", group: "Content" },
  { type: "boolean", name: "preview", default: true, libDefault: false, group: "Behavior", hint: "Player instead of a file row" },
  { type: "number", name: "maxSizeMb", default: 50, min: 5, max: 500, step: 5, group: "Validation" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "text", name: "width", default: "380px", group: "Appearance" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function VideoDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <VideoUpload
      label={String(v.label)}
      preview={Boolean(v.preview)}
      maxSizeMb={Number(v.maxSizeMb)}
      required={Boolean(v.required)}
      disabled={Boolean(v.disabled)}
      width={String(v.width)}
      setIsFieldValid={(valid) => log("setIsFieldValid", valid)}
      setResult={(file) => log("setResult", file)}
    />
  );
}

const audioControls: Control[] = [
  { type: "text", name: "label", default: "Voice note", group: "Content" },
  { type: "text", name: "dropzoneText", default: "Drop an audio file here", group: "Content" },
  { type: "number", name: "maxSizeMb", default: 10, min: 1, max: 50, group: "Validation" },
  { type: "text", name: "width", default: "420px", group: "Appearance" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function AudioDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <AudioUpload
      label={String(v.label)}
      dropzoneText={String(v.dropzoneText)}
      maxSizeMb={Number(v.maxSizeMb)}
      disabled={Boolean(v.disabled)}
      width={String(v.width)}
      setIsFieldValid={(valid) => log("setIsFieldValid", valid)}
      setResult={(file) => log("setResult", file)}
    />
  );
}

export const mediaEntries: DocEntry[] = [
  {
    id: "file-upload",
    title: "FileUpload",
    group: "Media",
    description:
      "Drag-and-drop multi-file upload with type/size/count validation, a file list with type icon, size, replace and remove, and an “Add more / Remove all” footer. The hint is derived from your limits unless you pass one.",
    imports: 'import { FileUpload } from "@itsrighttime/irt-ui";',
    controls: fileControls,
    render: (v) => <FileDemo v={v} />,
    code: (v) =>
      jsx("FileUpload", [
        ...changed(fileControls, v, ["label", "dropzoneText", "hint", "helperText", "maxFiles", "maxSizeMb", "required", "width", "height", "allowPreview", "disabled"]),
        ["allowedTypes", v.allowedTypes === "any" ? undefined : `{${JSON.stringify(TYPES[String(v.allowedTypes)])}}`],
        ["value", "{files}"],
        ["setResult", "{setFiles}"],
      ]),
  },
  {
    id: "image-upload",
    title: "ImageUpload & ImagePreview",
    group: "Media",
    description: "Single image upload with type/size/square validation and an in-place preview with replace/remove buttons. `ImagePreview` shows a URL or `File` with a placeholder when missing.",
    imports: 'import { ImageUpload, ImagePreview } from "@itsrighttime/irt-ui";',
    components: ["ImageUpload", "ImagePreview"],
    controls: imageControls,
    render: (v) => <ImageDemo v={v} />,
    code: (v) => [jsx("ImageUpload", [...changed(imageControls, v), ["setResult", "{setAvatar}"]]), "<ImagePreview image={avatar} />"].join("\n"),
  },
  {
    id: "video-upload",
    title: "VideoUpload",
    group: "Media",
    description: "Single video upload; `preview` shows a player (with replace/remove) instead of the file row. `VideoPlayer` is exported for URLs and files.",
    imports: 'import { VideoUpload, VideoPlayer } from "@itsrighttime/irt-ui";',
    components: ["VideoUpload", "VideoPlayer"],
    controls: videoControls,
    render: (v) => <VideoDemo v={v} />,
    code: (v) => jsx("VideoUpload", [...changed(videoControls, v), ["setResult", "{setVideo}"]]),
  },
  {
    id: "audio-upload",
    title: "AudioUpload & AudioPlayer",
    group: "Media",
    description: "Compact audio drop zone that turns into a custom player: play/pause, seek with hover time and ←/→/Home/End, volume, replace and remove.",
    imports: 'import { AudioUpload, AudioPlayer } from "@itsrighttime/irt-ui";',
    components: ["AudioUpload", "AudioPlayer"],
    controls: audioControls,
    render: (v) => <AudioDemo v={v} />,
    code: (v) => [jsx("AudioUpload", [...changed(audioControls, v), ["setResult", "{setAudio}"]]), '<AudioPlayer audioSrc={url} title="interview.mp3" onRemove={clear} />'].join("\n"),
  },
];
