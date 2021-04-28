export interface BooksResponse {
  count: number;
  next: string;
  previous: string;
  results: Book[];
}

export interface Book {
  id: number;
  authors: Author[];
  bookshelves: any[];
  download_count: number;
  formats: Formats;
  languages: string[];
  media_type: string;
  subjects: string[];
  title: string;
}

export interface Author {
  birth_year: number;
  death_year: number;
  name: string;
}

export interface Formats {
  "application/x-mobipocket-ebook"?: string;
  "application/pdf"?: string;
  "text/plain; charset=us-ascii"?: string;
  "text/plain; charset=utf-8"?: string;
  "application/rdf+xml": string;
  "application/zip"?: string;
  "application/epub+zip"?: string;
  "text/html; charset=utf-8"?: string;
  "text/plain; charset=iso-8859-1"?: string;
  "image/jpeg"?: string;
  "text/plain"?: string;
  "text/html; charset=us-ascii"?: string;
  "text/html"?: string;
  "text/rtf"?: string;
  "text/html; charset=iso-8859-1"?: string;
  "application/prs.tex"?: string;
}
