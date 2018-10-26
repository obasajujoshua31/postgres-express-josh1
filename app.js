const express = require("express");
const path = require("path");
require("dotenv").config();
const { Client } = require("pg");
const app = express();

//configure middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// set up routers
app.get("/", (req, res, next) => {
  const client = new Client();
  client
    .connect()
    .then(() => {
      console.log("connection established");
      const sql = "SELECT * FROM books ORDER BY books";
      return client.query(sql).then(result => {
        res.json(result.rows);
      });
    })
    .catch(err => {
      console.log("error ", err);
    });
});

app.post("/", (req, res) => {
  const { book, author } = req.body;

  const client = new Client();
  client
    .connect()
    .then(() => {
      sql = "INSERT INTO books (book, author) VALUES ($1, $2)";
      params = [book, author];
      return client.query(sql, params);
    })
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      console.error("Error found: ", err);
    });
});

app.post("/:id/update", (req, res) => {
  const { book, author } = req.body;
  const id = req.params.id;
  const client = new Client();
  client
    .connect()
    .then(() => {
      const sql =
        "UPDATE books SET book = $1, author = $2  WHERE book_id = $3;";
      const params = [book, author, id];
      return client.query(sql, params);
    })
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      console.log("error: ", err);
    });
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  const client = new Client();
  client
    .connect()
    .then(() => {
      const sql = "SELECT * FROM books where book_id = $1;";
      params = [id];
      return client.query(sql, params);
    })
    .then(result => {
      if (result.rows.length === 0) {
        res.json({
          message: "your book cannot be found!"
        });
      }
      res.json(result.rows);
    })
    .catch(err => {
      console.error("Error found :", err);
    });
});

app.post("/:id/delete", (req, res) => {
  const client = new Client();
  client
    .connect()
    .then(() => {
      const sql = "DELETE FROM books where book_id = $1;";
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      console.log("Error encoutered: ", err);
    });
});
//const port = 4000;
app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
