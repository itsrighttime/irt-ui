import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "./FileUpload";
import { ImagePreview } from "./ImagePreview";
import { VideoUpload } from "./VideoUpload";
import { VideoPlayer } from "./VideoPlayer";
import { AudioUpload } from "./AudioUpload";
import { formatTime } from "./AudioPlayer";
import { formatFileSize } from "./formatFileSize.helper";
import { getFileTypeLabel } from "./getFileType.helper";

const file = (name: string, type: string, size = 10) => new File([new Uint8Array(size)], name, { type });

beforeAll(() => {
  let n = 0;
  URL.createObjectURL = vi.fn(() => `blob:mock-${n++}`);
  URL.revokeObjectURL = vi.fn();
});

describe("helpers", () => {
  it("formats sizes, types and times", () => {
    expect(formatFileSize(2048)).toBe("2.00 KB");
    expect(getFileTypeLabel("application/pdf")).toBe("PDF");
    expect(getFileTypeLabel("x/unknown")).toBe("File");
    expect(formatTime(75)).toBe("1:15");
  });
});

describe("FileUpload", () => {
  it("adds valid files, rejects invalid types, removes and resets", async () => {
    const setResult = vi.fn();
    render(<FileUpload setResult={setResult} allowedTypes={["application/pdf"]} maxFiles={3} />);
    const input = screen.getByLabelText("Upload File") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file("a.png", "image/png")] } });
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid file type");
    fireEvent.change(input, { target: { files: [file("a.pdf", "application/pdf"), file("b.pdf", "application/pdf")] } });
    expect(setResult).toHaveBeenLastCalledWith([expect.any(File), expect.any(File)]);
    expect(screen.getByText("2 of 3 files")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove a.pdf" }));
    expect(screen.getByText("1 of 3 files")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove all" }));
    expect(setResult).toHaveBeenLastCalledWith([]);
  });

  it("accepts dropped files", () => {
    const setResult = vi.fn();
    const { container } = render(<FileUpload setResult={setResult} />);
    const zone = container.querySelector("input")?.parentElement as HTMLElement;
    fireEvent.drop(zone, { dataTransfer: { files: [file("d.txt", "text/plain")] } });
    expect(setResult).toHaveBeenCalledWith([expect.objectContaining({ name: "d.txt" })]);
  });
});

describe("media", () => {
  it("VideoPlayer creates one object URL per file (leak fix)", () => {
    const f = file("v.mp4", "video/mp4");
    const calls = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls.length;
    const { rerender } = render(<VideoPlayer videoFile={f} />);
    rerender(<VideoPlayer videoFile={f} color="red" />);
    rerender(<VideoPlayer videoFile={f} color="blue" />);
    expect((URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls.length - calls).toBe(1);
  });

  it("VideoUpload validates size", () => {
    const setResult = vi.fn();
    render(<VideoUpload setResult={setResult} maxSizeMb={0.000001} />);
    fireEvent.change(screen.getByLabelText("Upload Video"), { target: { files: [file("v.mp4", "video/mp4", 100)] } });
    expect(screen.getByRole("alert")).toHaveTextContent("exceeds");
    expect(setResult).toHaveBeenCalledWith(null);
  });

  it("AudioUpload shows the player after upload", () => {
    const setResult = vi.fn();
    render(<AudioUpload label="Voice" setResult={setResult} />);
    fireEvent.change(screen.getByLabelText("Voice"), { target: { files: [file("a.mp3", "audio/mpeg")] } });
    expect(setResult).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
  });

  it("ImagePreview shows a placeholder for non-images", () => {
    render(<ImagePreview image={file("x.txt", "text/plain")} />);
    expect(screen.getByRole("img", { name: /Image not available/ })).toBeInTheDocument();
  });
});
