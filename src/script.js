
const APP_NAME = "TakeNote!";
const retrievedData = localStorage.getItem(`${APP_NAME}-tasks`);
let alreadyRendered = 0
let completedTasks = 0
let taskArray = []
let allTheTasks = taskArray.length;
var canvas = document.createElement('canvas');
var span = document.createElement('span');
var el = document.getElementById('graph');
  el.appendChild(span);
  el.appendChild(canvas);
const retrievedTasks = JSON.parse(retrievedData);
const inputField = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

function retrieveTasks() {
  
  if (retrievedData) {
    for(let retrievedTask of retrievedTasks) {

      addTask(retrievedTask.taskId,retrievedTask.taskText,retrievedTask.taskStatus);
      
    }
  }
}
retrieveTasks();

const inputFocus = () => {
  const input = document.getElementById("addTask");
  input.focus();
  };

inputFocus();

inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
}); 

function addTask(id,text,status) {
    
  const retrievedId = id
  const retrievedText = text
  const retrievedStatus = status
  let checkedOrNot = ""
  let tick = ""
  retrievedStatus === "done" ? checkedOrNot = "checkedbox" : checkedOrNot = ""; 
  retrievedStatus === "done" ? tick = "checked" : tick = ""; 

  if(id&&text&&status){

  checkedItemFn();
  
  newListTemplate = `<li class="listItem rounded" id="${retrievedId}" data-check="${retrievedStatus}" title="${retrievedText}">
                            <div class="row align-items-center">
                                  <div class="col-auto" ><input type="checkbox" class="form-check-input box" ${tick}></div>
                                  <div class="col taskName ${checkedOrNot}" data-edit><p data-edit contentEditable = true >${retrievedText}</p></div>
                                  <div class="col-auto"><input type="button" value="" class="btn deleteButton" data-delete></div>
                            </div>
                        </li>`;

  taskList.insertAdjacentHTML("afterbegin", newListTemplate);



  const deleteButtons = document.querySelectorAll("[data-delete]");

  for (let button of deleteButtons) {
      button.addEventListener("click", deleteTask);
      }
  
    
  const pTags = document.querySelectorAll("p");

  for (let tag of pTags) {
    tag.addEventListener("keydown", (event) => {
    if (event.key === "Enter"){
      inputFocus();
      }
    })
  }
    }else{

    const userInputTask = inputField.value;

    // Validate for empty input
    if (
      userInputTask === "" ||
      userInputTask.split(" ").join("") === ""
    ) {
      alert("Please enter a non-empty task.");
      return false;
    }
    checkedItemFn();

    // Create the id for the new task
    newDate = new Date();
    newTime = newDate.getTime();
    newTaskId = newTime;

    newListTemplate = `<li class="listItem rounded" id="${newTaskId}" data-check="pending" title="${userInputTask}">
                            <div class="row align-items-center">
                                  <div class="col-auto" ><input type="checkbox" class="form-check-input box"></div>
                                  <div class="col taskName " data-edit><p data-edit contentEditable = true >${userInputTask}</p></div>
                                  <div class="col-auto"><input type="button" value="" class="btn deleteButton" data-delete></div>
                            </div>
                        </li>`;

    taskList.insertAdjacentHTML("afterbegin", newListTemplate);
   
    const deleteButtons = document.querySelectorAll("[data-delete]");

    for (let button of deleteButtons) {
      button.addEventListener("click", deleteTask);
    }
  }
  const pTags = document.querySelectorAll("p");

  for (let tag of pTags) {
    tag.addEventListener("keydown", (event) => {
    if (event.key === "Enter"){
      inputFocus();
      }
    })
  }
    
  checkedItemFn();
  inputField.value = "";

  updateTaskArray();
  
  console.log(alreadyRendered)
}

function checkedItemFn() {
  
  const checkedboxes = document.querySelectorAll(".box");
  checkedboxes.forEach((box) => {
    
    box.addEventListener("click", function (event) {
      event.target.parentElement
      .closest("li")
      .children[0].children[1].classList.toggle("checkedbox");
      const moveItem = event.target.parentElement.closest("li");
      if(event.target.parentElement
        .closest("li")
        .children[0].children[1].classList.contains("checkedbox")) {
          document.querySelector("ul").append(moveItem);
          event.target.parentElement
          .closest("li").dataset.check = "done"
        }else{
          document.querySelector("ul").prepend(moveItem);
          event.target.parentElement
          .closest("li").dataset.check = "pending"
        }
        updateTaskArray ()
      });
      
  }); 
}

const btnAdd = document.getElementById("btnAdd");

btnAdd.addEventListener("click", addTask);

function deleteTask(event) {
  const taskContainer = event.currentTarget.closest(".listItem");
  if(confirm("Are you sure you want to Delete this task?")){
      taskContainer.remove();
  }
  updateTaskArray ()  
}

function updateTaskArray () {
  const arrayOfAllTasks = document.body.querySelectorAll('li');
  let newTaskArray = [];
  for (let taskIterator of arrayOfAllTasks){
   
  const object = {taskId: taskIterator.id,
                  taskText: taskIterator.title,
                  taskStatus: taskIterator.dataset.check};
  newTaskArray.push(object);
  }
  taskArray = newTaskArray;
  localStorage.setItem(`${APP_NAME}-tasks`, JSON.stringify(taskArray.reverse()));
  let helperArray = document.getElementsByClassName('form-check-input')
  completedTasks = 0
  
  for (let alreadyDone in helperArray){
   if (helperArray[alreadyDone].checked === true){
     completedTasks += 1;
     console.log('test');
   }
  }
  allTheTasks = taskArray.length

  drawRingProgress(completedTasks, allTheTasks)
  //inputFocus();
}

function drawRingProgress(completedTasks, allTheTasks) {

  let progress_percentage = Math.floor((completedTasks / allTheTasks)*100);
  Number.isInteger(progress_percentage) ? progress_percentage = progress_percentage : progress_percentage = "0"
  var options = {
    // percent:  el.getAttribute('data-percent') || 25,
    percent: progress_percentage,
    // size: 110,
    size: el.getAttribute('data-size') || 220,
    lineWidth: el.getAttribute('data-line') || 15,
    rotate: el.getAttribute('data-rotate') || 0
  }
  span.textContent = options.percent + '%';

  if (typeof (G_vmlCanvasManager) !== 'undefined') {
    G_vmlCanvasManager.initElement(canvas);
  }

  var ctx = canvas.getContext('2d');
  canvas.width = canvas.height = options.size;
   
  ctx.translate(options.size / 2, options.size / 2); // change center
  ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

    //imd = ctx.getImageData(0, 0, 240, 240);
  var radius = (options.size - options.lineWidth) / 3.2;

  var drawCircle = function (color, lineWidth, percent) {
    percent = Math.min(Math.max(0, percent || 1), 1);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = 'round'; // butt, round or square
    ctx.lineWidth = lineWidth
    ctx.stroke();
  };

  drawCircle('#efefef', options.lineWidth, 100 / 100);
  drawCircle('#046582', options.lineWidth, options.percent / 100)
         
}

drawRingProgress(completedTasks, allTheTasks,alreadyRendered);
