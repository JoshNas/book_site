import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import "./Home.css";
import ProgressBar from 'react-bootstrap/ProgressBar'
import homeBackground from "../img/homeBackground.jpg"

export default function Home(props) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /*Check is user is logged in */
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }

      try {
        const books = await loadBooks();
        setBooks(books);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [props.isAuthenticated]);

  function loadBooks() {
    return API.get("books", "/books");
  }

  function renderBooksList(books) {
    return [{}].concat(books).map((book, i) =>
      /* keeps create new button on top */
      i !== 0 ? (
        <div className="list-group" key={i}>
          <a href={`/books/${book.bookId}`} className="list-group-item list-group-item-action">
            <p>{book.title}</p>
            <ProgressBar now={(book.currentPage / book.pages) * 100}
            label={`${Math.round((book.currentPage / book.pages) * 100)}%`}/>
          </a>
        </div>
      ) : (
        <a key={i} className="btn btn-primary btn-lg btn-block" href="/books/new" role="button">Enter new book</a>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>SocialBooks</h1>
        <p>Track your book club progress!</p>
      </div>
    );
  }

  function renderBooks() {
    return (
      <div className="p-2 bd-highlight books">
        <h1>Your Books</h1>
          {!isLoading && renderBooksList(books)}
      </div>
    );
  }

  return (
    <div className="d-flex flex-column bd-highlight Home">
      {props.isAuthenticated ? renderBooks() : renderLander()}
      <div className="p-2 bd-highlight">
        <img src={homeBackground} className="img-fluid rounded" alt="Reading is fun"/>
      </div>
    </div>
  );
}
