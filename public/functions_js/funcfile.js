const User = require('../../models/user');
const Blog = require('../../models/blog');
const Profile = require('../../models/profile_info');


// Function for displaying number of blogs//

async function countBlogs() {
    console.log("Outerfunc");
    console.log("Nothin!")
    // const blogs = await Blog.find({userID:id})
    // count =  blogs.length
    document.getElementById("blogcount").innerHTML = "co67";
  
}

function deactivate(email) {
    console.log(email);
    
    document.getElementById(email).innerHTML = document.getElementById(email).innerHTML=='Active' ?'De-Activated':"Active"

    if (document.getElementById(email).style.backgroundColor =='green'){
        document.getElementById(email).style.backgroundColor = "red"
    }  else {
        document.getElementById(email).style.backgroundColor = 'green'
    }
    // setTimeout(()=> {
    //     document.getElementById(email).style.backgroundColor =  "red" ?'green': "red"
    // }, 2000)

}