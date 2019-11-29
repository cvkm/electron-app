import React from 'react';
import './App.css';
import swal from 'sweetalert'
const {ipcRenderer} = window.require('electron')
class App extends React.Component {
  state = {
    i:0,
    inter:"",
    mark:"",
    store:[]
  }

  async componentDidMount () {
      //localStorage.clear()
    const editChange = e => {
      console.log(e.target.id);
      console.log(e.target.innerText)
      let tempEdit;
      let id;
      id = e.target.id
      tempEdit = e.target.innerText;
      localStorage.setItem(id,tempEdit);


    }
    const taskComplete = e => {
      this.setState({mark:e.target.id})
      this.setState({inter:'task'+this.state.mark.charAt(7)})
      const mark = document.getElementById(this.state.mark);
      if(mark.title === "Completed!") {
        swal("","Completed!","success")
    }
    else {
      swal("Mark task as Completed?", {
        buttons: ["No", "Yes"],
      }).then(e => {
        if(e===true){
         mark.setAttribute('src',require('./test3.png'))
         mark.title = "Completed!";
         const value = document.getElementById(this.state.inter);
         value.setAttribute('contenteditable',"false");
         let tempArr;
         tempArr = [[value.innerText,this.state.mark]]

         let temp;
         temp = JSON.parse(localStorage.getItem("Complete"));
         console.log(temp);
         if(localStorage.length !== 0 && temp!==null) {
           for(let a =0;a<temp.length;a++) {
         tempArr.push(temp[a])
           }
         this.setState({store:tempArr})
         }
         else {
          this.setState({store:tempArr})
         }
          localStorage.setItem("Complete",JSON.stringify(this.state.store));
          console.log(localStorage)
         //localStorage.setItem(this.state.inter, task.innerHTML);
        }
      })
    }
  }
    const ul = document.querySelector('ul');
    console.log(window.location)
    //localStorage.clear()
    if(localStorage.length!==0) {
      let validate;
      console.log(localStorage)
    ul.className = 'collection';
   await  this.setState({i:(localStorage.length)-1})
    console.log(this.state.i)
      validate = JSON.parse(localStorage.getItem("Complete"));
    for(let k=0; k<localStorage.length;k++) {
      const itemText = localStorage.getItem("task" + k)
      if(itemText!==null) {
      const li = document.createElement('li');
      li.className = 'collection-item';
      const edit = document.createElement('div');
      edit.className = 'edit'
      edit.id ='task' + k;
      edit.title = "Edit the Task";
      edit.setAttribute('contenteditable',"true");
      edit.onblur = editChange;
      edit.innerHTML = itemText;
      const confirm = document.createElement('img');

      if(validate!==null) {
        for(let c=0;c<validate.length;c++) {
          console.log(itemText)
          if(itemText === validate[c][0]) {
          confirm.src = require("./test3.png")
          confirm.title = "Completed!";
          edit.setAttribute('contenteditable',"false")
          edit.title = "Task Completed!"
          // validate[c][1] = 'confirm' + k;
          // localStorage.setItem("Complete",JSON.stringify(validate));
          // console.log(localStorage)
          }
        }
        if(confirm.src === "") {
          confirm.src = require("./ok.png")
          confirm.title = "Mark as completed?";
        }
      confirm.className = "confirm";
      confirm.id = 'confirm' + k
      }
      else {
        confirm.title = "Mark as completed?";
        confirm.src = require("./ok.png")
        confirm.className = "confirm";
      confirm.id = 'confirm' + k
      }
      li.appendChild(edit);
      ul.appendChild(li);
      ul.appendChild(confirm);
      confirm.addEventListener('click', taskComplete);
    }
    else {
    }
  }
  }

   ipcRenderer.on('task:add', async (e, item) => {
     console.log(this.state.i)
    // await  this.setState({i:(localStorage.length)-2})
     console.log(localStorage)
     console.log(item)
      ul.className = 'collection';
      const li = document.createElement('li');
      li.className = 'collection-item';
      const edit = document.createElement('div');
      edit.className = 'edit'
      console.log(this.state.i)
      edit.id ='task' + this.state.i;
      edit.title = "Edit the Task";
      edit.setAttribute('contenteditable',"true");
      edit.onblur = editChange;
      const itemText = document.createTextNode(item);
      edit.appendChild(itemText);
      const confirm = document.createElement('img');
      confirm.src = require("./ok.png")
      confirm.className = "confirm";
      confirm.title = "Mark as completed?";
      confirm.id = 'confirm' + this.state.i;
      this.setState({i:this.state.i + 1})
      li.appendChild(edit);
      ul.appendChild(li);
      ul.appendChild(confirm);
      confirm.addEventListener('click', taskComplete);
    });

    ipcRenderer.on('task:clear', ()=> {
      ul.className = '';
      ul.innerHTML = '';
      localStorage.clear()
      this.setState({i:0})
    });
  }
  render () {
  return (
    <div className="App">
      <h1>To-Do List</h1>
      <ul id = "list"></ul>
    </div>
  );
}
}

export default App;