var bodyParser       = require('body-parser'),
    methodOverride   = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose         = require('mongoose'),
    express          = require('express'),
    app              = express();

    //APP CONFIG
    mongoose.connect('mongodb://localhost/blogger');
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));


    // MONGOOSE MODEL CONFIG
    var blogSchema = new mongoose.Schema({
      title: String,
      image: String,
      body: String,
      created:
              {type:Date,
               default: Date.now }
    });

    var Blog = mongoose.model("Blog", blogSchema);


    //RESTFUL ROUTES
    app.get("/", function(req,res){
      res.redirect('/blogs');
    });

    //INDEX ROUTE
    app.get("/blogs", (req,res)=>{
      Blog.find({}, (err, blogs)=>{
        if (err) {
          console.log(err);
        } else {
          res.render('index', {blogs: blogs});
        }
      })
    });


    //NEW ROUTE
    app.get("/blogs/new", function(req,res){
      res.render("new");
    });

    //CREATE ROUTE
    app.post("/blogs",function(req,res){
      // to avoid script files being run while providing user the ability to use html input for the description part
      req.body.blog.body = req.sanitize(req.body.blog.body)
      Blog.create(req.body.blog, function(err, newBlog){
        if(err){
          res.render("new");
        }else {
          res.redirect("/blogs");
        }
      });
    })

    //EDIT ROUTES
    app.get("/blogs/:id/edit", function(req,res){
      Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
          res.redirect("/blogs");
        } else {
          res.render("edit", {blog: foundBlog});
        }
      });
    })


    //SHOW ROUTE
    app.get("/blogs/:id", function(req,res){
      Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
          res.redirect("/blogs");
        } else {
          res.render("show", {blog:foundBlog});
        }
      })
    });

    //UPDATE ROUTE
    app.put("/blogs/:id", function(req,res){
      req.body.blog.body = req.sanitize(req.body.blog.body)
      Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
        if(err){
          res.redirect("/blogs");
        }else {
          res.redirect("/blogs/"+req.params.id);
        }
      });
    });



    //Server Init
    app.listen(3000, function (){
      console.log('Server is Up');
    });
