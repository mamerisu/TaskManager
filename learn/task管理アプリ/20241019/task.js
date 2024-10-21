// task.js

document.addEventListener('DOMContentLoaded', function() {
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const deadlineInput = document.getElementById('deadline');
    const notesInput = document.getElementById('notes');
    const prioritySelect = document.getElementById('priority');
    const completedTasksList = document.getElementById('completed-tasks-list');
    const levelText = document.getElementById('level-text');
    const levelFill = document.getElementById('level-fill');

    let points = 0;
    let level = 1;

    // ローカルストレージからタスクを復元
    loadTasks();

    addTaskButton.addEventListener('click', function() {
        const taskText = newTaskInput.value.trim();
        const deadline = deadlineInput.value; 
        const notes = notesInput.value.trim();
        const priority = prioritySelect.value;

        if (taskText !== '') {
            addTask(taskText, deadline, notes, priority);
            newTaskInput.value = '';
            deadlineInput.value = '';
            notesInput.value = '';
        } else {
            alert('タスクを入力してください。');
        }
    });
    // リセットボタンの要素を取得
    const resetButton = document.getElementById('reset-tasks');

    // リセットボタンのクリックイベントを追加
    resetButton.addEventListener('click', function() {
        if (confirm('すべてのタスクをリセットしますか？')) {
            localStorage.removeItem('tasks'); // ローカルストレージから全タスクを削除
            taskList.innerHTML = ''; // ページからタスクリストを削除
            completedTasksList.innerHTML = ''; // 完了したタスクも削除
            points = 0; // ポイントをリセット
            level = 1; // レベルをリセット
            updateLevelBar(); // レベルバーをリセット
            levelText.textContent = 'Level: ' + level; // レベルテキストをリセット
        }
    });

    function addTask(taskText, deadline, notes, priority) {
        const li = document.createElement('li');
        const createdAt = new Date().toLocaleString('ja-JP');
        const taskContent = document.createElement('div');

        const deadlineDisplay = deadline ? new Date(deadline).toLocaleString('ja-JP') : '期限なし';

        taskContent.innerHTML = `
            <strong>${taskText}</strong><br>
            作成日時: ${createdAt}<br>
            期限: ${deadlineDisplay}<br>
            備考: ${notes ? notes : 'なし'}`;

        li.classList.add(priority);
        li.setAttribute('data-task-text', taskText); // タスク名をデータ属性として保存
        li.setAttribute('data-deadline', deadline); // 期限をデータ属性として保存
        li.setAttribute('data-notes', notes); // 備考をデータ属性として保存
        li.setAttribute('data-priority', priority); // 優先度をデータ属性として保存

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('delete-task');

        const completeButton = document.createElement('button');
        completeButton.textContent = '完了';
        completeButton.classList.add('complete-task');

        deleteButton.addEventListener('click', function() {
            taskList.removeChild(li);
            saveTasks(); // タスクを削除した後に保存
        });

        completeButton.addEventListener('click', function() {
            completeTask(taskText);
            taskList.removeChild(li);
            saveTasks(); // タスクを完了した後に保存
        });

        li.appendChild(taskContent);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
        
        saveTasks(); // 新しいタスクを追加した後に保存
    }

    function completeTask(taskText) {
        const completedTaskItem = document.createElement('li');
        completedTaskItem.textContent = taskText;
        completedTasksList.appendChild(completedTaskItem);
        addPoints(10); // 10ポイント追加
    }

    function addPoints(pointsToAdd) {
        points += pointsToAdd;
        updateLevelBar();

        if (points >= 100) {
            levelUp();
        }
    }

    function updateLevelBar() {
        const percentage = (points % 100);
        levelFill.style.width = percentage + '%';
    }

    function levelUp() {
        level++;
        points = points % 100; // 100ポイントを超えた場合はリセット
        levelText.textContent = 'Level: ' + level;
    }

    function saveTasks() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('li');
        taskItems.forEach(item => {
            const taskText = item.getAttribute('data-task-text');
            const deadline = item.getAttribute('data-deadline');
            const notes = item.getAttribute('data-notes');
            const priority = item.getAttribute('data-priority');
            tasks.push({ taskText, deadline, notes, priority });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // タスクをローカルストレージに保存
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                addTask(task.taskText, task.deadline, task.notes, task.priority);
            });
        }
    }
});
