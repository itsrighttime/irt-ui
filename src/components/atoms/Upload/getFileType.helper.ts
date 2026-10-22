const mimeTypeLabels: ReadonlyArray<readonly [string, string]> = [
  // Documents
  ["pdf", "PDF"],
  ["msword", "Doc"],
  ["wordprocessingml", "Doc"],
  ["spreadsheetml", "Excel"],
  ["excel", "Excel"],
  ["presentationml", "Presentation"],
  ["powerpoint", "Presentation"],
  ["rtf", "RTF"],
  ["opendocument.text", "ODT"],
  ["opendocument.spreadsheet", "ODS"],
  ["opendocument.presentation", "ODP"],
  // Images
  ["image/jpeg", "JPEG Image"],
  ["image/png", "PNG Image"],
  ["image/gif", "GIF Image"],
  ["image/bmp", "BMP Image"],
  ["image/svg+xml", "SVG Image"],
  ["image/webp", "WebP Image"],
  ["image/tiff", "TIFF Image"],
  // Text
  ["text/plain", "Text File"],
  ["text/csv", "CSV"],
  ["text/html", "HTML"],
  // Archives
  ["zip", "ZIP Archive"],
  ["x-zip-compressed", "ZIP Archive"],
  ["x-rar-compressed", "RAR Archive"],
  ["x-7z-compressed", "7z Archive"],
  ["x-tar", "TAR Archive"],
  ["gzip", "GZIP Archive"],
  // Audio
  ["audio/mpeg", "MP3 Audio"],
  ["audio/wav", "WAV Audio"],
  ["audio/aac", "AAC Audio"],
  ["audio/ogg", "OGG Audio"],
  // Video
  ["video/mp4", "MP4 Video"],
  ["video/quicktime", "MOV Video"],
  ["video/x-msvideo", "AVI Video"],
  ["video/x-ms-wmv", "WMV Video"],
  ["video/webm", "WebM Video"],
  ["video/mpeg", "MPEG Video"],
  ["video/ogg", "OGG Video"],
  // Code
  ["application/javascript", "JavaScript File"],
  ["text/css", "CSS File"],
  ["text/x-python", "Python File"],
  ["application/json", "JSON File"],
  ["text/x-java-source", "Java File"],
  ["application/xml", "XML File"],
  ["text/x-csrc", "C Source File"],
  ["text/x-c++src", "C++ Source File"],
  ["text/x-shellscript", "Shell Script"],
  ["application/x-httpd-php", "PHP File"],
  ["application/x-ruby", "Ruby File"],
  ["application/x-java-archive", "JAR File"],
  ["application/x-sh", "Shell Script"],
  ["application/x-perl", "Perl Script"],
  ["text/x-sql", "SQL Script"],
  ["application/x-asp", "ASP File"],
  ["application/x-vbs", "VBScript File"],
  ["text/markdown", "Markdown File"],
  ["text/x-yaml", "YAML File"],
  ["application/x-latex", "LaTeX File"],
  // Other
  ["application/vnd.ms-access", "Access Database"],
  ["application/vnd.visio", "Visio Drawing"],
  ["application/vnd.ms-project", "MS Project File"],
  ["application/vnd.ms-powerpoint.template.macroenabled.12", "PowerPoint Template"],
  ["application/vnd.ms-excel.template.macroenabled.12", "Excel Template"],
  ["application/x-shockwave-flash", "Flash File"],
  ["application/vnd.google-earth.kmz", "Google Earth File"],
];

/** Human label for a MIME type (first substring match), `"File"` otherwise. */
export const getFileTypeLabel = (mimeType: string): string => {
  for (const [key, label] of mimeTypeLabels) {
    if (mimeType.includes(key)) return label;
  }
  return "File";
};
