(function() {
    let listArray = [];
    let listName = '';
    
    function createAppTitle() {
        let appTitle = document.createElement('h1');
        appTitle.classList.add('title');
        appTitle.innerHTML = "Мои дела";
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let button = document.createElement('button');

        form.classList.add('form');
        input.classList.add('form__input');
        input.placeholder = 'Введите название нового дела';
        button.classList.add('form__button');
        button.textContent = "Добавить";
        button.disabled = true;

        input.addEventListener('input', function() {
            if (input.value) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })
        
        form.append(input);
        form.append(button);

        return {
            form,
            input,
            button
        };

    }

    function createFilterForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let button = document.createElement('button');

        form.classList.add('form', 'form__filter');
        input.classList.add('form__input');
        input.placeholder = 'Введите название дела для поиска';
        button.classList.add('form__button');
        button.textContent = "Поиск";
        button.disabled = true;

        input.addEventListener('input', function() {
            if (input.value) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })
        
        form.append(input);
        form.append(button);

        return {
            form,
            input,
            button
        };

    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list');
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        
        item.classList.add('list__item');
        item.textContent = obj.name;

        buttonGroup.classList.add('button-group');
        doneButton.classList.add('btn', 'button-group__done');
        doneButton.textContent = 'Готово'
        deleteButton.classList.add('btn','button-group__delete');
        deleteButton.textContent = 'Удалить'
    

        if (obj.done == true) {
            item.classList.add('list__item_success');        
        }

        doneButton.addEventListener('click', function() {
            item.classList.toggle('list__item_success');
            
            for (const listItem of listArray) {
                if (listItem.id == obj.id) {
                    listItem.done = !listItem.done
                }
                saveList(listArray, listName);
            }
        })

        deleteButton.addEventListener('click', function(){
            if (confirm('Вы уверены ?')) {
                item.remove();              
                listArray.forEach((element, index) => {
                    if (element.id == obj.id) {
                        listArray.splice(index, 1)
                    }
                })

                console.log(obj.id);
                saveList(listArray, listName);
            }
        })

        buttonGroup.append(doneButton);
            buttonGroup.append(deleteButton);
            item.append(buttonGroup);
            
            return {item, doneButton, deleteButton};
    }

    function getNewId(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) {
                max = item.id;
            }
        }
        return max + 1;
    }

    function saveList(array, keyName) {
        localStorage.setItem(keyName, JSON.stringify(array));
    }

    function createTodoApp(container, title = 'Список дел', keyName, defArray = []) {        
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let filterForm = createFilterForm();
        let todoList = createTodoList();

        listName = keyName;
        listArray = defArray;

        container.append(todoAppTitle);
        container.append(filterForm.form);
        container.append(todoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName);

        if (localData !== null && localData !== '') {
            listArray = JSON.parse(localData);
        }

        for (const itemList of listArray) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return;
            }
            
            let newItem = { 
                id: getNewId(listArray),
                name: todoItemForm.input.value,
                done: false
            }

            let todoItem = createTodoItem(newItem);


            listArray.push(newItem);
            saveList(listArray, listName);
            console.log(listArray);

            todoList.append(todoItem.item);

            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';
        })

        filterForm.form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!filterForm.input.value) {
                return;
            }
            let arrayFilter = listArray.filter(function(obj) {
                return obj.name.includes(filterForm.input.value)
            })
            console.log(arrayFilter);
            
            console.log(todoList)
            if (arrayFilter.length != 0) {
                document.querySelectorAll('.list__item').forEach(elem => elem.remove())
                
                for (const itemList of arrayFilter) {
                    let todoItem = createTodoItem(itemList);
                    todoList.append(todoItem.item);
                }
            }
        })
    }
    

    window.createTodoApp = createTodoApp;


}) ();