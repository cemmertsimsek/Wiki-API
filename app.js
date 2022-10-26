const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//////// Requests targeting all articles //////////
app
  .route("/articles") //chaining methods for same route
  .get((req, res) => {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

//////// Requests targeting specific articles //////////
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles found");
      }
    });
  })

  .put((req, res) => {
    Article.replaceOne(
      //.update() method depreceted
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Successfully updated");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    Article.updateMany(
      { title: req.params.articleTitle },
      { $set: req.body }, //picking up the fields that provided updates to from body. updating only the fields that has a value. for ex: title and content together or only for one of them
      function (err) {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted the corresponding article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
