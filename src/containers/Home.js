import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
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

  function renderNotesList(books) {
    return [{}].concat(books).map((book, i) =>
      i !== 0 ? (
        <LinkContainer key={book.bookId} to={`/books/${book.bookId}`}>


          <ListGroupItem header={book.content.trim().split("\n")[0]}>
            {book.content.toLocaleString() +  " Created: " + new Date(book.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="book" to="/books/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Enter a new book
            </h4>
          </ListGroupItem>
        </LinkContainer>
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

  function renderNotes() {
    return (
      <div className="books">
        <h1>Your Books</h1>
        <ListGroup>
          {!isLoading && renderNotesList(books)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
