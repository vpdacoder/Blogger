var bodyParser       = require('body-parser'),
    // methodOverride   = require('method-override'),
    // expressSanitizer = require('express-sanitizer'),
    mongoose         = require('mongoose'),
    express          = require('express'),
    app              = express();

    //APP CONFIG
    mongoose.connect('mongodb://localhost/blogger');
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended: true}));
    // app.use(expressSanitizer());
    // app.use(methodOverride("_method"));


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

    // Blog.create({
    //   title: "POST 1",
    //   image:"https://images.unsplash.com/photo-1531455812304-0f9f68b3957b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=98434d5aeabd3cb6289abb10ab9575ad&auto=format&fit=crop&w=500&q=60",
    //   body:"HElllo WOooorld"
    // }, (err, blog) =>{
    //   if(err) {
    //     console.log(err);
    //   } else {
    //     console.log("Created a new blog");
    //     console.log(blog);
    //   }
    // });

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











    //Server Init
    app.listen(3000, function (){
      console.log('Server is Up');
    });
