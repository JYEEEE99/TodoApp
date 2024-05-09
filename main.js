const createBtn = $("#create__btn");
const userWriteInput = $("#user__wirte");
const todoBox = $(".todo__box");

// 랜덤 키 생성
const randomNum = Math.random().toString();
// 새로운 todo 생성
createBtn.click(function () {
  // 사용자가 입력한 값
  const todoValue = userWriteInput.val();
  const todoData = {
    id: randomNum,
    value: todoValue,
  };
  if (todoValue == "") {
    alert("할 일 목록을 작성해 주세요.");
  } else {
    // 로컬 스토리지에서 데이터 가져오기
    const localTodoData = JSON.parse(localStorage.getItem("todos")) || [];
    // 로컬 스토리지에 새로운 데이터 추가
    localTodoData.unshift(todoData);
    // 로컬 스토리지에 저장
    localStorage.setItem("todos", JSON.stringify(localTodoData));
    const todoListAdd = `
            <div class="todo__list" id="${randomNum}">
                <input type="checkbox">
                <input type="text" disabled id="user__todo" value="${todoValue}">
                <button id="edit__btn"><i class="fa-regular fa-pen-to-square"></i></button>
                <button id="remove__btn"><i class="fa-solid fa-eraser"></i></button>
            </div>`;
    todoBox.prepend(todoListAdd);
    userWriteInput.val("");
  }
});

// 로컬 스토리지에 저장한 데이터 불러오기
$(document).ready(function () {
  const localTodoData = JSON.parse(localStorage.getItem("todos")) || [];
  // 순서대로 저장된 데이터를 역순으로 반복해서 화면에 추가
  localTodoData.reverse().forEach(function (todoData) {
    const todoListAdd = `
    <div class="todo__list" id="${todoData.id}"> 
                <input type="checkbox">
                <input type="text" disabled id="user__todo" value="${todoData.value}"> 
                <button id="edit__btn"><i class="fa-regular fa-pen-to-square"></i></button>
                <button id="remove__btn"><i class="fa-solid fa-eraser"></i></button>
            </div>`;
    todoBox.prepend(todoListAdd);
  });
});

// remove 버튼을 누르면 localstorage에서 해당 데이터 삭제
todoBox.on("click", "#remove__btn", function () {
  const todoList = $(this).closest(".todo__list");
  const key = todoList.attr("id");

  // 로컬 스토리지에서 해당 id를 가진 데이터 삭제
  let localTodoData = JSON.parse(localStorage.getItem("todos")) || [];
  localTodoData = localTodoData.filter((item) => item.id !== key);
  localStorage.setItem("todos", JSON.stringify(localTodoData));

  // 화면에서 해당 요소 삭제
  todoList.remove();
});
