import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./Books.css";

export default function Books(props) {
  const file = useRef(null);
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newPage, setNewPage] = useState(0);
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    function loadBook() {
      return API.get("books", `/books/${props.match.params.id}`);
    }

    async function onLoad() {
      try {
        const book = await loadBook();
        const title = book.title
        const page = book.currentPage
        const attachment = book.attachment
        console.log(attachment)

        if (attachment) {
          book.attachmentURL = await Storage.vault.get(attachment);
        }

        setTitle(title);
        setBook(book);
        setPage(page);
        setNewPage(page)
      } catch (e) {
        alert(e);
      }
    }

    onLoad();
  }, [props.match.params.id]);


  function saveBook(book) {
    return API.put("books", `/books/${props.match.params.id}`, {
      body: book
    });
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (newFile && newFile.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (newFile) {
        attachment = await s3Upload(newFile);
      }
      await saveBook({
        newPage,
        attachment: attachment || book.attachment
      });
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }

  function deleteBook() {
    return API.del("books", `/books/${props.match.params.id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteBook();
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Books">
      <form>
      <h3>{title}</h3>
        <div className="form-group">
          <label htmlFor="newPage">Currently on page: {page}</label>
          <input className="form-control form-control-lg" type="number" placeholder="new page" name="newPage"
          value={newPage} onChange={e => setNewPage(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="newImage">Add an image:</label>
          <input type="file" name="newImage" onChange={e => setNewFile(e.target.files[0])}></input>
        </div>
      </form>
        <button className="btn btn-primary btn-lg btn-block" onClick={handleSubmit}>{!isLoading ? ("Update") :
          (<div className="spinner-border text-primary" role="status">
            <span className="sr-only">Updating...</span>
          </div>)}
        </button>
        <button className="btn btn-danger btn-lg btn-block" onClick={handleDelete}>{!isDeleting ? ("Finished") :
          (<div className="spinner-border text-danger" role="status">
            <span className="sr-only">Deleting...</span>
          </div>)}
        </button>
    </div>
  )
}
