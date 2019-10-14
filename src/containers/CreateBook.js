import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewBook.css";
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
      pages: null
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
    console.log("calling get books")
    console.log(this.state.searchTerm)
    const search = this.state.searchTerm

    $.ajax({
      url: 'https://www.googleapis.com/books/v1/volumes?q=' + search +'&maxResults=10',
      dataType:  "json",
        success: (data) => {
          this.setState({
            title: data.items[0].volumeInfo.title,
            author: data.items[0].volumeInfo.authors,
            pages: data.items[0].volumeInfo.pageCount
          })
          console.log(data.items[0])
        },
        type: 'GET'
    })
  }

  render() {
    return (
      <div className="NewBook">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>What are you reading?</label>
            <input className="form-control form-control-lg" onChange={this.handleChange} value={this.state.searchTerm} id="searchTerm"></input>
          </div>
        </form>
        <button onClick={this.getBooks}>Search</button>
        <div>{this.state.title}</div>
        <div>{this.state.author}</div>
        <div>{this.state.pages}</div>
      </div>
    );
  }
}
