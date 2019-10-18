import React, { Component } from "react";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./CreateBook.css";
import $ from 'jquery';


export class CreateBook extends Component {
  constructor(props) {
    super(props);

    this.file = null;
    this.state = {
      isLoading: null,
      searchTerm: "",
      title: "",
      author: "",
      pages: 0,
      image: null,
      books: []
    };

    this.getBooks = this.getBooks.bind(this)
  }

  validateForm() {
    return this.state.searchTerm.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      const attachment = this.file
        ? await s3Upload(this.file)
        : null;

      await this.createBook({
        attachment,
        title: this.state.title,
        author: this.state.author,
        pages: this.state.pages
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  createBook(book) {
    return API.post("books", "/books", {
      body: book
    });
  }

  getBooks() {
    const search = this.state.searchTerm

    $.ajax({
      url: 'https://www.googleapis.com/books/v1/volumes?q=' + search +'&maxResults=10',
      dataType:  "json",
        success: (data) => {
          this.setState({
            books: data.items.slice(1),
            title: data.items[0].volumeInfo.title,
            author: data.items[0].volumeInfo.authors,
            pages: data.items[0].volumeInfo.pageCount,
            image: data.items[0].volumeInfo.imageLinks.thumbnail
          })
          console.log(data.items)
          console.log(this.state.books)
        },
        type: 'GET'
    })
    console.log(this.state.books[0])
  }

  handleSelect = (e, book) => {
    this.setState({
      title: book.title,
      author: book.authors,
      pages: book.pageCount,
      image: book.imageLinks.thumbnail
    })
  }


  render() {
    return (
      <div className="NewBook">
        <div className="d-flex flex-column">
          <form id="searchForm">
            <div className="form-group">
              <label>What are you reading?</label>
              <input className="form-control form-control-lg" onChange={this.handleChange} value={this.state.searchTerm} id="searchTerm"></input>
            </div>
          </form>
          <button className="btn btn-info search" onClick={this.getBooks}>Search</button>
        </div>

        {
          this.state.title &&
          <div className="d-flex flex-column bd-highlight mb-3 bg-secondary text-white rounded" id="currentBook">
            <button className="btn btn-primary" onClick={this.handleSubmit}>Add Your Book:</button>
            <p className="p-2 bd-highlight">{this.state.title}</p>
            <p className="p-2 bd-highlight">by: {this.state.author}</p>
            <p className="p-2 bd-highlight">pages: {this.state.pages}</p>
              <img className="img-fluid align-self-center" src={this.state.image} alt="cover"></img>
              <form>
                <div class="form-group">
                  <label for="imageUpload">Upload an image</label>
                  <input type="file" class="form-control-file" id="imageUpload" onChange={this.handleFileChange}/>
                </div>
              </form>
            <p className="p-2 bd-highlight" id="refine">If this is not your book select it from below. If you still don't see please refine your search.</p>
          </div>
        }

        {
          this.state.books.map((book, index) => (
            <div key={index} className="d-flex flex-column bd-highlight mb-3 bg-secondary text-white">

              <button onClick={((e) => this.handleSelect(e, book.volumeInfo))} className="p-2 bd-highlight">
              <span>{book.volumeInfo.title}</span></button>
              <p className="p-2 bd-highlight">by: {book.volumeInfo.authors}</p>
              <p className="p-2 bd-highlight">pages: {book.volumeInfo.pageCount}</p>
              <img className="img-fluid align-self-center" src={book.volumeInfo.imageLinks.thumbnail} alt="cover"></img>
            </div>
          ))
        }
      </div>
    );
  }
}
