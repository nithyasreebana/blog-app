const path = require("path");
const cookieParser = require("cookie-parser");
const Blog = require('./models/blog');
const mongoose = require('mongoose');
const express = require('express');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require("./middleware/auth");
const app = express();
mongoose.connect('mongodb://localhost:27017/blogify').then(e=console.log('MongoDN connected'));
const PORT = 5000;
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use("/user",userRoute);
app.use("/blog",blogRoute);
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
});
app.listen(PORT,()=>console.log(`Server Started at PORT : ${PORT}`));

