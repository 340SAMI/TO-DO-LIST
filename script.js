// Load tasks & streak
let tasks = JSON.parse(localStorage.getItem('tasks')||'[]');
let streakCount = parseInt(localStorage.getItem('streak')||'0');

const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const taskModal = document.getElementById('taskModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');
const streakSpan = document.getElementById('streakCount');

let editTaskId = null;

// GSAP animations helper
function animateCard(card){ gsap.to(card,{scale:1.02,duration:0.2,yoyo:true,repeat:1}); }

// Theme toggle
toggleThemeBtn.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  toggleThemeBtn.textContent=document.body.classList.contains('dark')?'☀️ Light Mode':'🌙 Dark Mode';
});

// Open Modal
addTaskBtn.addEventListener('click',()=>{
  modalTitle.textContent='Add Task';
  taskForm.reset();
  editTaskId=null;
  taskModal.style.display='flex';
});

// Close Modal
closeModalBtn.addEventListener('click',()=>taskModal.style.display='none');

// Save tasks
function saveTasks(){
  localStorage.setItem('tasks',JSON.stringify(tasks));
  localStorage.setItem('streak',streakCount);
}

// Render tasks
function renderTasks(filtered=tasks){
  taskList.innerHTML='';
  filtered.forEach(task=>{
    const card=document.createElement('div');
    card.className='task-card task-card-gradient';
    card.draggable=true;
    card.dataset.id=task.id;
    card.innerHTML=`
      <h3>${task.taskEmoji||''} ${task.title}</h3>
      <div class="tags">${task.tags.map(tag=>`<span>${tag}</span>`).join('')}</div>
      <div class="due-date">📅 ${task.dueDate||'No due date'}</div>
      <div class="priority">⚡ ${task.priority}</div>
      <div class="repeat">🔁 ${task.repeat}</div>
      <div class="description">${task.description}</div>
      <ul class="subtasks">${task.subtasks.map(st=>`<li>${st}</li>`).join('')}</ul>
      <input type="text" placeholder="Add subtask" class="subtaskInput">
      <button class="addSubtaskBtn">Add Subtask</button>
      <button class="completeBtn">✅ Complete Task</button>
      <button class="editBtn">✏️ Edit</button>
      <button class="deleteBtn">🗑️ Delete</button>
    `;
    // Hover particle
    card.addEventListener('mouseenter',()=>animateCard(card));
    
    // Add Subtask
    card.querySelector('.addSubtaskBtn').addEventListener('click',()=>{
      const val=card.querySelector('.subtaskInput').value.trim();
      if(!val) return;
      task.subtasks.push(val);
      card.querySelector('.subtaskInput').value='';
      saveTasks(); renderTasks();
    });
    // Complete Task
    card.querySelector('.completeBtn').addEventListener('click',()=>{
      confetti({particleCount:150, spread:70, origin:{y:0.6}});
      streakCount++; streakSpan.textContent=`🔥 ${streakCount}`;
      tasks=tasks.filter(t=>t.id!==task.id);
      saveTasks(); renderTasks();
    });
    // Edit Task
    card.querySelector('.editBtn').addEventListener('click',()=>openEditModal(task.id));
    // Delete Task
    card.querySelector('.deleteBtn').addEventListener('click',()=>{
      tasks=tasks.filter(t=>t.id!==task.id);
      saveTasks(); renderTasks();
    });

    // Drag & Drop
    card.addEventListener('dragstart',dragStart);
    card.addEventListener('dragover',dragOver);
    card.addEventListener('drop',drop);

    taskList.appendChild(card);
  });
}

// Add/Edit Task
taskForm.addEventListener('submit',e=>{
  e.preventDefault();
  const title=taskForm.taskTitle.value.trim();
  if(!title) return alert('Task title required');
  const dueDate=taskForm.taskDueDate.value;
  const tags=taskForm.taskTags.value.split(',').map(t=>t.trim()).filter(t=>t);
  const priority=taskForm.taskPriority.value;
  const repeat=taskForm.taskRepeat.value;
  const description=taskForm.taskDescription.value.trim();
  const taskEmoji=taskForm.taskEmoji.value.trim();

  if(editTaskId!==null){
    const task=tasks.find(t=>t.id===editTaskId);
    Object.assign(task,{title,dueDate,tags,priority,repeat,description,taskEmoji});
  } else {
    const newTask={id:Date.now(),title,dueDate,tags,priority,repeat,description,subtasks:[],completed:false,taskEmoji};
    tasks.push(newTask);
  }
  saveTasks();
  taskModal.style.display='none';
  renderTasks();
});

// Edit Task Modal
function openEditModal(id){
  const task=tasks.find(t=>t.id===id);
  editTaskId=id;
  modalTitle.textContent='Edit Task';
  taskForm.taskTitle.value=task.title;
  taskForm.taskDueDate.value=task.dueDate;
  taskForm.taskTags.value=task.tags.join(',');
  taskForm.taskPriority.value=task.priority;
  taskForm.taskRepeat.value=task.repeat;
  taskForm.taskDescription.value=task.description;
  taskForm.taskEmoji.value=task.taskEmoji||'';
  taskModal.style.display='flex';
}

// Search
searchInput.addEventListener('input',()=>{
  const query=searchInput.value.toLowerCase();
  renderTasks(tasks.filter(t=>t.title.toLowerCase().includes(query)||t.tags.some(tag=>tag.toLowerCase().includes(query))));
});

// Drag & Drop
let dragged=null;
function dragStart(e){ dragged=e.target; e.dataTransfer.effectAllowed='move'; }
function dragOver(e){ e.preventDefault(); e.dataTransfer.dropEffect='move'; }
function drop(e){
  e.preventDefault();
  if(dragged && dragged!==e.target && e.target.classList.contains('task-card')){
    const draggedId=dragged.dataset.id;
    const targetId=e.target.dataset.id;
    const draggedIndex=tasks.findIndex(t=>t.id==draggedId);
    const targetIndex=tasks.findIndex(t=>t.id==targetId);
    tasks.splice(targetIndex,0,tasks.splice(draggedIndex,1)[0]);
    saveTasks(); renderTasks();
  }
}

// Export JSON
exportBtn.addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(tasks,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='tasks.json'; a.click();
  URL.revokeObjectURL(url);
});

// Import JSON
importBtn.addEventListener('click',()=>importFile.click());
importFile.addEventListener('change',(e)=>{
  const file=e.target.files[0];
  const reader=new FileReader();
  reader.onload=()=>{ tasks=JSON.parse(reader.result); saveTasks(); renderTasks(); };
  reader.readAsText(file);
});

// Initial Render
renderTasks();
streakSpan.textContent=`🔥 ${streakCount}`;
document.body.classList.add('light');
