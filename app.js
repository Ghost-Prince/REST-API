const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(express.static("public"));

// setting up database
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser : true});
mongoose.set('strictQuery', true);      // getting rid of DeprecationWarning

const articleSchema = new mongoose.Schema({
    title : String,
    content : String
});

const ARTICLE = mongoose.model("Article",articleSchema);
// Database setup finished

// Implementing HTTP verbs
// 1 => GET all articles. (verified)
app.get("/articles",(req,res)=> {
    ARTICLE.find((err,foundArticles)=> {
        if(err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send(foundArticles);
        }
    });
});
// 2 => POST an article. This post request can be made using Postman app. (verified)
app.post("/articles",(req,res)=> {
    const temp_article = new ARTICLE({
        title : req.body.title,     // the parameter name entered in postman app should be 'title'
        content : req.body.content      // the parameter name entered in postman app should be  'content'
    });
    temp_article.save((err)=> {
        if(err) {
            res.send(err);
        }
        else {
            console.log(req.body.title);
            console.log(req.body.content);
            res.send("New article added successfully.");
        }
    });
});
// 3 => DELETE all articles. (verified)
app.delete("/articles",(req,res)=> {
    ARTICLE.deleteMany((err)=> {
        if(err) {
            res.send(err);
        }
        else {
            res.send("All articles were deleted successfully.");
        }
    });
});
// 4 => GET a specific arrticle. (verified)
app.get("/articles/:articleTitle",(req,res)=> {
    ARTICLE.findOne({title : req.params.articleTitle},(err,foundArticle)=> {
        if(foundArticle) {
            res.send(foundArticle);
        }
        else {
            res.send("No such article found. Error 404.");
        }
    });
});
// 5 => PUT a specific article. (verified)
app.put("/articles/:articleTitle",(req,res)=> {
    ARTICLE.updateOne(
        {
            title : req.params.articleTitle
        },
        {
            title : req.body.title,     // the parameter name entered in postman app should be 'title'
            content : req.body.content      // the parameter name entered in postman app should be 'content'
        },
//         {
//             overwrite : true
//         },
        (err)=> {
            if(err) {
                res.send(err);
            }
            else {
                res.send("Article updated successfully.");
            }
        }
    );
});
// 6 => PATCH a specific article. (verified)
app.patch("/articles/:articleTitle",(req,res)=> {
    ARTICLE.updateOne(
        {
            title : req.params.articleTitle
        },
        {
            $set : req.body
        },
        (err)=> {
            if(err) {
                res.send(err);
            }
            else {
                res.send("Article updated successfully.");
            }
        }
    );
});
// 7 => DELETE a specific article. (verified)
app.delete("/articles/:articleTitle",(req,res)=> {
    ARTICLE.deleteOne(
        {
            title : req.params.articleTitle
        },
        (err)=> {
            if(err) {
                res.send(err);
            }
            else {
                res.send("Article deleted successfully.");
            }
        }
    );
});

app.listen(3000,()=> {
    console.log("Server is running at port 3000.");
});
