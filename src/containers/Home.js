import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import "./Home.css";
import homeBackground from "../img/homeBackground.jpg"

export default function Home(props) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        <div class="list-group">
          <a href={`/books/${book.bookId}`} class="list-group-item list-group-item-action">
          {book.content + " Created: " + new Date(book.createdAt).toLocaleString()}</a>
        </div>
      ) : (
        <a class="btn btn-primary btn-lg btn-block" href="/books/new" role="button">Enter new book</a>
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
      <div className="books">
        <h1>Your Books</h1>
          {!isLoading && renderBooksList(books)}
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderBooks() : renderLander()}
    </div>
  );
}
