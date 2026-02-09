import type { Entry } from './s3.ts';

import Archive from '../icons/archive.svg?raw';
import Audio from '../icons/audio.svg?raw';
import Cd from '../icons/cd.svg?raw';
import Certificate from '../icons/certificate.svg?raw';
import Css from '../icons/css.svg?raw';
import Database from '../icons/database.svg?raw';
import Deb from '../icons/deb.svg?raw';
import Default from '../icons/default.svg?raw';
import Directory from '../icons/directory.svg?raw';
import Dmg from '../icons/dmg.svg?raw';
import Document from '../icons/document.svg?raw';
import Email from '../icons/email.svg?raw';
import Font from '../icons/font.svg?raw';
import Go from '../icons/go.svg?raw';
import Html from '../icons/html.svg?raw';
import Image from '../icons/image.svg?raw';
import Javascript from '../icons/javascript.svg?raw';
import Json from '../icons/json.svg?raw';
import Key from '../icons/key.svg?raw';
import Markdown from '../icons/markdown.svg?raw';
import Package from '../icons/package.svg?raw';
import Pdf from '../icons/pdf.svg?raw';
import Powershell from '../icons/powershell.svg?raw';
import Presentation from '../icons/presentation.svg?raw';
import Python from '../icons/python.svg?raw';
import Scroll from '../icons/scroll.svg?raw';
import Shell from '../icons/shell.svg?raw';
import Sql from '../icons/sql.svg?raw';
import Typescript from '../icons/typescript.svg?raw';
import Video from '../icons/video.svg?raw';
import Worksheet from '../icons/worksheet.svg?raw';
import Xsv from '../icons/xsv.svg?raw';

const extensionMapping: { [key: string]: string } = {
  '3gp': Video,
  '7z': Archive,
  aac: Audio,
  apk: Package,
  appimage: Package,
  avi: Video,
  bak: Database,
  bash: Shell,
  bat: Shell,
  bmp: Image,
  'ca-bundle': Certificate,
  cda: Audio,
  cer: Certificate,
  com: Shell,
  crt: Certificate,
  css: Css,
  csv: Xsv,
  db: Database,
  deb: Deb,
  dll: Shell,
  dmg: Dmg,
  doc: Document,
  docx: Document,
  dpkg: Deb,
  email: Email,
  eml: Email,
  eof: Font,
  exe: Package,
  flac: Audio,
  flatpak: Package,
  fodp: Presentation,
  fods: Worksheet,
  fodt: Document,
  gif: Image,
  gifv: Video,
  go: Go,
  gz: Archive,
  heic: Image,
  heif: Image,
  htm: Html,
  html: Html,
  img: Cd,
  iso: Cd,
  jar: Package,
  jks: Key,
  jpeg: Image,
  jpg: Image,
  js: Javascript,
  json: Json,
  json5: Json,
  jsonc: Json,
  jsx: Javascript,
  key: Key,
  keystore: Key,
  less: Css,
  m4a: Audio,
  m4v: Video,
  mailbox: Email,
  markdown: Markdown,
  mbox: Email,
  md: Markdown,
  mdb: Database,
  mdown: Markdown,
  midi: Audio,
  mjs: Javascript,
  mkv: Video,
  mov: Video,
  mp3: Audio,
  mp4: Video,
  mpeg: Video,
  mpg: Video,
  msg: Email,
  msi: Package,
  mts: Typescript,
  odp: Presentation,
  ods: Worksheet,
  odt: Document,
  ogg: Audio,
  otf: Font,
  p12: Key,
  pdf: Pdf,
  pem: Certificate,
  pfx: Key,
  png: Image,
  ppt: Presentation,
  pptx: Presentation,
  ps1: Powershell,
  pub: Key,
  py: Python,
  pyc: Python,
  pyo: Python,
  rar: Archive,
  rpm: Package,
  rtf: Document,
  sass: Css,
  scss: Css,
  sh: Shell,
  so: Shell,
  sql: Sql,
  sqlite: Database,
  svg: Image,
  tar: Archive,
  tiff: Image,
  ts: Typescript,
  tsv: Xsv,
  tsx: Typescript,
  ttf: Font,
  txt: Document,
  vob: Video,
  wav: Audio,
  webm: Video,
  webp: Image,
  wma: Audio,
  woff: Font,
  woff2: Font,
  x509: Certificate,
  xls: Worksheet,
  xlsx: Worksheet,
  xz: Archive,
  zip: Archive,
  zst: Archive,
};

export const getIcon = (entry: Entry): string => {
  if (entry.type === 'directory') {
    return Directory;
  }
  if (entry.name.trim() === 'README' || entry.name.trim() === 'LICENSE') {
    return Scroll;
  }
  return extensionMapping[entry.extension] || Default;
};
