// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
  }
// Todo: create a function to create a task card
function createTaskCard(task) {
    return `
      <div class="task-card" id="task-${task.id}" data-status="${task.status}">
        <div class="task-content">${task.content}</div>
        <button class="delete-button btn btn-danger"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;
  }
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // Clear existing cards
    $("#todo-cards, #in-progress-cards, #done-cards").empty();
  
    // Render each task in appropriate lane
    taskList.forEach(task => {
      const taskCard = createTaskCard(task);
      switch (task.status) {
        case "todo":
          $("#todo-cards").append(taskCard);
          break;
        case "in-progress":
          $("#in-progress-cards").append(taskCard);
          break;
        case "done":
          $("#done-cards").append(taskCard);
          break;
        default:
          break;
      }
    });
  
    // Make task cards draggable
    $(".task-card").draggable({
      
    });
  
    // Add delete button click handler
    $(".delete-button").click(handleDeleteTask);
  }
// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const taskContent = $("#new-task-content").val().trim();
    if (taskContent === "") {
      alert("Please enter task content.");
      return;
    }
  
    const newTask = {
      id: generateTaskId(),
      content: taskContent,
      status: "todo"
    };
  
    taskList.push(newTask);
    saveToLocalStorage();
    renderTaskList();
    $("#formModal").modal("hide");
    $("#add-task-form")[0].reset();
  }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();
    const taskId = $(this).closest(".task-card").attr("id");
    const index = taskList.findIndex(task => `task-${task.id}` === taskId);
    if (index !== -1) {
      taskList.splice(index, 1);
      saveToLocalStorage();
      renderTaskList();
    }
  }
  

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("id");
    const status = $(this).attr("id");
    const taskIndex = taskList.findIndex(task => taskId === `task-${task.id}`);
    if (taskIndex !== -1) {
      taskList[taskIndex].status = status;
      saveToLocalStorage();
      renderTaskList();
    }
  }
  

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
  
    // Add event listeners
    $("#add-task-form").submit(handleAddTask);
    $(".lane").droppable({
      drop: handleDrop
    });
  });
  