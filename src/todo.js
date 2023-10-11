const pendingList = document.getElementById("js-pending"),
    finishedList = document.getElementById("js-finished"),
    form = document.getElementById("js-form"),
    input = form.querySelector("input"); 

const PENDING = "PENDING";
const FINISHED = "FINISHED"; 

let pendingTasks, finishedTasks; 

// 사용자가 입력한 텍스트를 받아와서 할 일 항목을 생성하고 고유한 ID를 부여
function getTaskObject(text) {
    console.log(text);
    return {
        id: String(Date.now()),
        text
    };
}

// 할 일 목록을 저장하기 위해 로컬 스토리지에 데이터를 저장
function savePendingTask(task) { 
    pendingTasks.push(task); 
} 

// 완료한 항목 목록에서 특정 ID의 항목을 찾아 반환
function findInFinished(taskId) { 
    return finishedTasks.find(function(task) { 
        return task.id === taskId;
    });
}

// 보류 중인 항목 목록에서 특정 ID의 항목을 찾아 반환
function findInPending(taskId) { 
    return pendingTasks.find(function(task) { 
        return task.id === taskId; 
    }); 
} 

// 특정 ID의 항목을 보류 중 항목 목록에서 제거
function removeFromPending(taskId) { 
    pendingTasks = pendingTasks.filter(function(task) { 
        return task.id !== taskId; 
    }); 
} 
// 특정 ID의 항목을 완료한 항목 목록에서 제거
function removeFromFinished(taskId) { 
    finishedTasks = finishedTasks.filter(function(task) { 
        return task.id !== taskId; 
    });
} 

// 항목을 완료한 항목 목록에 추가
function addToFinished(task) { 
    finishedTasks.push(task); 
} 

// 항목을 보류 중인 항목 목록에 추가
function addToPending(task) { 
    pendingTasks.push(task);
} 

// 항목을 삭제하고, 해당 항목을 보류 중 및 완료한 항목 목록에서 모두 제거 후, 상태를 저장
function deleteTask(e) { 
    const li = e.target.parentNode; 
    li.parentNode.removeChild(li); 
    removeFromFinished(li.id); 
    removeFromPending(li.id); 
    saveState(); 
} 

// 항목을 완료한 항목 목록에 이동하고, 해당 항목을 보류 중 목록에서 제거 후, 상태를 저장
function handleFinishClick(e) { 
    const li = e.target.parentNode; 
    li.parentNode.removeChild(li); 
    const task = findInPending(li.id); 
    addToFinished(task); 
    removeFromPending(li.id);
    paintFinishedTask(task); 
    saveState(); 
} 

// 완료한 항목을 보류 중 목록에 다시 이동하고, 해당 항목을 완료한 항목 목록에서 제거한 후, 상태를 저장
function handleBackClick(e) { 
    const li = e.target.parentNode; 
    li.parentNode.removeChild(li);
    const task = findInFinished(li.id); 
    removeFromFinished(li.id);
    addToPending(task);
    paintPendingTask(task);
    saveState(); 
} 

// 보류 중인 항목을 화면에 표시
function paintPendingTask(task) { 
    const genericLi = buildGenericLi(task); 
    const span = document.createElement("span"); 
    const completeBtn = document.createElement("button"); 
    span.innerText = task.text; 
    completeBtn.innerText = "✅"; 
    completeBtn.addEventListener("click", handleFinishClick); 
    genericLi.append(completeBtn); 
    pendingList.append(genericLi); 
}

// 항목을 보여주는 리스트 아이템을 생성
function buildGenericLi(task) { 
    const li = document.createElement("li"); 
    const span = document.createElement("span"); 
    const deleteBtn = document.createElement("button"); 
    span.innerText = task.text; 
    deleteBtn.innerText = "❌"; 
    deleteBtn.addEventListener("click", deleteTask); 
    li.append(span, deleteBtn);
    li.id = task.id;
    return li; 
}

// 완료한 항목을 화면에 표시
function paintFinishedTask(task) { 
    const genericLi = buildGenericLi(task); 
    const backBtn = document.createElement("button"); 
    backBtn.innerText = "⏪"; 
    backBtn.addEventListener("click", handleBackClick); 
    genericLi.append(backBtn); finishedList.append(genericLi); 
} 

// 현재의 보류 중 및 완료한 항목 목록을 로컬 스토리지에 저장
function saveState() { localStorage.setItem(PENDING, JSON.stringify(pendingTasks)); 
    localStorage.setItem(FINISHED, JSON.stringify(finishedTasks)); 
} 

// 이전에 저장한 항목 목록을 로드
function loadState() { 
    pendingTasks = JSON.parse(localStorage.getItem(PENDING)) || []; 
    finishedTasks = JSON.parse(localStorage.getItem(FINISHED)) || []; 
} 

// 이전에 저장한 항목 목록을 화면에 복원
function restoreState() { 
    pendingTasks.forEach(function(task) { paintPendingTask(task); }); 
    finishedTasks.forEach(function(task) { paintFinishedTask(task); }); 
} 

// 사용자가 입력한 새로운 항목을 생성하여 보류 중 목록에 추가하고, 입력 필드를 지움
function handleFormSubmit(e) {
    e.preventDefault(); 
    const taskObj = getTaskObject(input.value); 
    input.value = ""; 
    paintPendingTask(taskObj); 
    savePendingTask(taskObj); 
    saveState(); 
} 

function init() {
    form.addEventListener("submit", handleFormSubmit);
    loadState();
    restoreState();
} 

init();