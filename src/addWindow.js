import React from 'react';
import './add.css'
const {ipcRenderer} = window.require('electron');
class addWindow extends React.Component {
  
  state = {
    post :"",
    i:0
  }
  handleChange = e => {
    this.setState({i:localStorage.length})
    this.setState({post:e.target.value})
    }
  
  handleSubmit = e => {
    e.preventDefault();
    localStorage.setItem("task"+this.state.i, this.state.post);
    const task = this.state.post;
    ipcRenderer.send('task:add', task);
  }
render() {
    return (
    <div className="App1">
 {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css" /> */}
  <div className="container1">
    <form>
      <div>
        <label>Enter Task</label>
        <input type="text" id="task" onChange = {this.handleChange} autoFocus />
      <button className="button" type = 'submit' onClick = {this.handleSubmit}>Add Task</button>
  </div></form></div></div>
    );
  }
}

export default addWindow;