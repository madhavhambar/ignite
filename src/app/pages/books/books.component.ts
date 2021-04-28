import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BooksResponse } from './books.model';

export interface params {
  topic: string;
  search: string;
  ids: string;
  languages: string;
  mime_type: string;
  page: string;
}

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  requestParams: params = {} as params;
  bookResponse: BooksResponse = {} as BooksResponse;
  books: Book[] = [];
  lockScrollLoad = false;
  loadingMore = false;
  searchInput!: string;

  constructor(private http: HttpClient, route: ActivatedRoute, private router: Router) {
    route.queryParams.subscribe(qp => {
      this.requestParams.topic = qp.topic;
      this.searchInput = this.requestParams.search = qp.search;
      this.requestParams.ids = qp.ids;
      this.requestParams.languages = qp.languages;
      this.requestParams.mime_type = qp.mime_type;
      this.requestParams.page = qp.page;
      console.log(qp, this.requestParams);
    });
  }

  ngOnInit(): void {
    this.GetBooks();
  }

  GetBooks() {
    let params = new HttpParams();
    params = params.append('topic', this.requestParams.topic);
    if (this.requestParams.search) {
      params = params.append('search', this.requestParams.search);
    }
    if (this.requestParams.ids) {
      params = params.append('ids', this.requestParams.ids);
    }
    if (this.requestParams.languages) {
      params = params.append('languages', this.requestParams.languages);
    }
    // if (this.requestParams.mime_type) {
    params = params.append('mime_type', 'image');
    // }
    if (this.requestParams.page) {
      params = params.append('page', this.requestParams.page);
    }
    this.http.get<BooksResponse>('http://skunkworks.ignitesol.com:8000/books', { params }).toPromise().then(response => {
      console.log(response)
      this.bookResponse = response;
      this.books = response.results;
    });
  }

  search() {
    this.lockScrollLoad = false;
    console.log(this.searchInput);
    this.router.navigate([], { queryParams: { search: this.searchInput, topic: this.requestParams.topic } });
    this.GetBooks();
  }

  getAuthors(book: Book) {
    let authors = book.authors.map(b => b.name);
    return authors.join(' ');
  }

  loadMore() {
    if (this.lockScrollLoad) {
      return;
    }
    this.loadingMore = true;
    this.http.get<BooksResponse>(this.bookResponse.next).toPromise().then(response => {
      this.bookResponse = response;
      this.books.push(...response.results);
      this.loadingMore = false;
      if (response.next == null) {
        this.lockScrollLoad = true;
      }
    });
  }

  viewBook(book: Book) {
    if (book.formats['text/html']) {
      window.open(book.formats['text/html'], '_blank');
    } /*else if (book.formats['text/html; charset=utf-8']) {
      window.open(book.formats['text/html; charset=utf-8'], '_blank');
    } else if (book.formats['text/html; charset=us-ascii']) {
      window.open(book.formats['text/html; charset=us-ascii'], '_blank');
    } else if (book.formats['text/html; charset=iso-8859-1']) {
      window.open(book.formats['text/html; charset=iso-8859-1'], '_blank');
    } */else if (book.formats['application/pdf']) {
      window.open(book.formats['application/pdf'], '_blank');
    } else if (book.formats['text/plain']) {
      window.open(book.formats['text/plain'], '_blank');
    } /*else if (book.formats['text/plain; charset=utf-8']) {
      window.open(book.formats['text/plain; charset=utf-8'], '_blank');
    } else if (book.formats['text/plain; charset=us-ascii']) {
      window.open(book.formats['text/plain; charset=us-ascii'], '_blank');
    } else if (book.formats['text/plain; charset=iso-8859-1']) {
      window.open(book.formats['text/plain; charset=iso-8859-1'], '_blank');
    }*/ else {
      alert('No viewable version available');
    }
  }

}
