const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost:27017/todolist', {useNewUrlParser: true});

const tasksSchema = {
    task: {
        type: String,
        required: true
    }
};

const Task = mongoose.model("Task", tasksSchema);

app.get("/", (req, res)=>{
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);
    Task.find({}, (err, task)=>{
        res.render("list", {day, tasks: task});
    });
});

app.post("/", async (req, res)=>{
    const addedTask = req.body.newTask;

    const task = new Task({
        task: addedTask
    });
    try {
        await task.save();
        res.redirect("/")
    } catch (err) {
        res.redirect("/")
    }
});

app.post("/delete", (req, res)=>{
    const deleteTask = req.body.deleteTask;
    Task.findByIdAndRemove(deleteTask, (err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    })
});

app.listen(4000, ()=>{
    console.log("Server is running at port 4000");
})