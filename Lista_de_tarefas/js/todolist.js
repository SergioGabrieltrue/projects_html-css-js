; (function () {
    "use strict"

    const itemInput = document.getElementById("item-input")
    const todoAddForm = document.getElementById("todo-add")
    const ul = document.getElementById("todo-list")
    const lis = ul.getElementsByTagName("li")

    let arrTasks = getSavedData() //Criação da estrutura de dados

    // function addEventLi(li){

    // li.addEventListener('click', function(){
    //     console.log(this)
    //     console.log(this.textContent)
    //     console.log(this.innerText)
    //     console.log(this.outerHTML)
    //     console.log(this.innerHTML)
    // })
    //  }

    function getSavedData(){
        let TasksData = localStorage.getItem("tasks")

        TasksData = JSON.parse(TasksData)

        return TasksData && TasksData.length ? TasksData : [
            {
                name: "task1",
                createdAt: Date.now(),
                completed: false
            },
    
            {
                name: "task2",
                createdAt: Date.now(),
                completed: false,
            }
            ]

    }

    function setNewData(){
        localStorage.setItem("tasks", JSON.stringify(arrTasks))
    }

    setNewData()

    function generateLiTask(obj){
        const li = document.createElement("li")
        const p = document.createElement("p")
        const checkButton = document.createElement("button")
        const editButton = document.createElement("i")
        const deleteButton = document.createElement("i")
        // Criação da <li> e seus componentes.
        li.className = "todo-item"
        

        checkButton.className = "button-check"
        checkButton.innerHTML = `<i class= "fas fa-check ${obj.completed? "" : "displayNone"}" data-action = "checkButton">` //Pergunta se a propriedade da <li> tem seu completed marcado. Se não tiver, aplique displayNone.
        checkButton.setAttribute("data-action", "checkButton")
        
        li.appendChild(checkButton)

        p.className = "task-name"
        p.textContent = obj.name 
        li.appendChild(p)

        editButton.className = "fas fa-edit"
        editButton.setAttribute("data-action", "editButton") // data-action define o atributo responsável por acessar um objeto e seus métodos.
        li.appendChild(editButton)

        const containerEdit = document.createElement("div")
        containerEdit.className = "editContainer"

        const inputEdit = document.createElement("input")
        inputEdit.setAttribute("type", "text")
        inputEdit.className = "editInput"
        inputEdit.value = obj.name //Mantém o nome colocado ao <input> quando cancelar a edição.
        containerEdit.appendChild(inputEdit)

        const containerEditButton = document.createElement("button")
        containerEditButton.className = "editButton"
        containerEditButton.textContent = "Edit"
        containerEditButton.setAttribute("data-action", "containerEditButton")
        containerEdit.appendChild(containerEditButton)

        const containerCancelButton = document.createElement("button")
        containerCancelButton.className = "cancelButton"
        containerCancelButton.textContent = "Cancel"
        containerCancelButton.setAttribute("data-action", "containerCancelButton")
        containerEdit.appendChild(containerCancelButton)

        li.appendChild(containerEdit)

        deleteButton.className = "fas fa-trash-alt"
        deleteButton.setAttribute("data-action", "deleteButton")
        li.appendChild(deleteButton)
        // addEventLi(li)


        return li
    } //Geração das <li> com seus respectivos elementos.

    function renderTasks(){
        ul.innerHTML = ""
        arrTasks.forEach(taskObj => {
            ul.appendChild(generateLiTask(taskObj))
        })
    } // Função para colocar as tasks definidas em nossa lista, ao mesmo tempo que usa outra para gerar uma.

    function addTask(task){

        arrTasks.push({
            name: task,
            createdAt: Date.now(),
            completed: false
        })

        setNewData()
    } // Adição das tasks na estrutura de dados.

    function clickedUl(e){
        const dataAction = e.target.getAttribute("data-action")

        if(!dataAction) return //Se não houver data-action, não retorne nada.

        let currentLi = e.target
        while (currentLi.nodeName !== "LI"){
            currentLi = currentLi.parentElement
        } //Para a acessar a <li> desejada, fazemos um loop até que achemos um nó que tenha o nome LI.

        const currentLiIndex = [...lis].indexOf(currentLi) //Recuperamos o índice da <li>.
        

        const actions = {
            editButton: function(){
                const editContainer = currentLi.querySelector(".editContainer");

                [...ul.querySelectorAll(".editContainer")].forEach(container => {
                    container.removeAttribute("style")
                });

                editContainer.style.display = "flex"
            },
            deleteButton: function(){
                arrTasks.splice(currentLiIndex, 1)
                console.log(arrTasks)
                renderTasks() //Renderizamos a estrutura de arrTasks sem o botão que foi removido.
                setNewData()
            },

            containerEditButton: function(){
                const val = currentLi.querySelector(".editInput").value
                arrTasks[currentLiIndex].name = val
                renderTasks()
                setNewData()
            },

            containerCancelButton: function(){
                currentLi.querySelector(".editContainer").removeAttribute("style")

                currentLi.querySelector(".editInput").value = arrTasks[currentLiIndex].name
            },

            checkButton: function(){
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed

                // if(arrTasks[currentLiIndex].completed){
                //     currentLi.querySelector("fa-check").classList.remove("displayNone")
                // }

                // else{
                //     currentLi.querySelector("fa-check").classList.add("displayNone")
                // }
                setNewData()
                renderTasks()
            }
        }
    
       
        if (actions[dataAction]){
            actions[dataAction]()
        }
        //Verificamos se o valor do atributo data-action é igual aos métodos de actions. Se forem, execute o tal método.
    }



    todoAddForm.addEventListener("submit", function (e){
        e.preventDefault()
        console.log(itemInput.value)
        // ul.innerHTML += 
        //         `<li class="todo-item">
        //             <p class="task-name">${itemInput.value}</p>
        //         </li>`
        addTask(itemInput.value)
        renderTasks()

        itemInput.value = ""
        itemInput.focus()
    }); // Evento que executa a adição na estrutura e depois a renderização das tasks na lista.

    ul.addEventListener("click", clickedUl) //Executamos a função ao cliclar na <ul>.

    renderTasks()

    

})();