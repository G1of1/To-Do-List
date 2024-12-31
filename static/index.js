const list = document.getElementById('tasks');
async function fetchTasks()
{
    try
    {
        const response = await fetch('/tasks')
        const tasks = await response.json()

        const checkedTasks = JSON.parse(localStorage.getItem('checkedTasks')) || []



        const tasksList = document.getElementById('tasks');
        tasksList.innerHTML = '';

        tasks.forEach(task => 
        {
            const li = document.createElement('li');
            li.textContent = `${task.name}`;
            li.setAttribute('data-name', task.name);

            if(checkedTasks.includes(task.name))
            {
                li.classList.add('checked');
            }
            
            const span = document.createElement('span');
            span.innerHTML = "\u00d7";
            li.appendChild(span);
            tasksList.appendChild(li);
        }
        );

    }
    catch(error)
    {
        console.error("Error fetching tasks:" + error);
        document.getElementById('error-message').textContent = "Error fetching tasks: " + error;
    }
}

async function addTasks()
{
    const name = document.getElementById('text').value.trim();
    if(!name)
    {
        document.getElementById("error-message").textContent = "You must add a task."
        return;
    }
    const task = {name: name}


    try
    {
        await fetch('/tasks',{method: 'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(task)});
        fetchTasks();
        document.getElementById("error-message").textContent = "";
    }
    catch(error)
    {
        console.error('Error adding tasks:', error);
        document.getElementById('error-message').textContent = "Error adding tasks: " + error;
    }
}

async function removeTasks(taskName)
{
    if (!taskName) 
    {
        console.error("Error: Task name is required");
        document.getElementById('error-message').textContent = "Task name is required";
        return; // Early exit if no task name is provided
    }
    try
    {
        const response = await fetch('/tasks',{method: 'DELETE',headers: {'Content-Type': 'application/json'},body: JSON.stringify({ name: taskName })});
        
        if(!response.ok)
        {
            throw new Error('Failed to remove task');
        }
        await fetchTasks();
        document.getElementById('error-message').textContent = "";
    }
    catch(error)
    {
        console.error("Error removing task", error);
        document.getElementById('error-message').textContent = "Failed to remove task";
    }
}
list.addEventListener('click', function(event)
{
    if(event.target.tagName === "LI")
    {
        event.target.classList.toggle('checked');
        updateCheckedTasks();
    }
    else if(event.target.tagName === "SPAN")
    {
        const taskName = event.target.parentElement.dataset.name;
        removeTasks(taskName);
    }
});

function updateCheckedTasks()
{
    const checkedTasks = Array.from(document.querySelectorAll("#tasks li.checked")).map(li =>li.dataset.name);
    localStorage.setItem('checkedTasks', JSON.stringify(checkedTasks));
}
window.onload = fetchTasks

