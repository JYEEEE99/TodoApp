const createBtn = $("#create__btn");
const userWriteInput = $("#user__wirte");
const todoBox = $(".todo__box");

const newTodo = function () {
  // 랜덤 키 생성
  const randomNum = Math.random().toString();
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
            <div class="todo__list" id="${todoData.id}"> 
                <input type="checkbox" id="ckbox">
                <input type="text" disabled id="user__todo" value="${todoData.value}"> 
                <i class="fa-regular fa-pen-to-square" id="edit__btn"></i>
                <i class="fa-solid fa-eraser" id"remove__btn"></i>
            </div>`;
    todoBox.prepend(todoListAdd);
    userWriteInput.val("");
  }
};
// 새로운 todo 생성
// createBtn을 눌렀을 때 새로운 todo 생성
createBtn.click(function () {
  newTodo();
});
// 사용자가 input에 todo를 입력하고 엔터키를 치면 생성
userWriteInput.keypress(function (e) {
  if (e.keyCode === 13) {
    newTodo();
  }
});

// 로컬 스토리지에 저장한 데이터 불러오기
$(document).ready(function () {
  const localTodoData = JSON.parse(localStorage.getItem("todos")) || [];
  // 순서대로 저장된 데이터를 역순으로 반복해서 화면에 추가
  localTodoData.reverse().forEach(function (todoData) {
    const todoListAdd = `
    <div class="todo__list" id="${todoData.id}"> 
                <input type="checkbox" id="ckbox">
                <input type="text" disabled id="user__todo" value="${todoData.value}"> 
                <i class="fa-regular fa-pen-to-square" id="edit__btn"></i>
                <i class="fa-solid fa-eraser" id="remove__btn"></i>
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

// 체크박스 체크on off 기능
todoBox.on("change", "#ckbox", function () {
  // 체크박스에 저장된 count 값을 가져온다. 없으면 초기값 0을 사용
  let ckCount = $(this).data("count") || 0;

  // 카운트를 증가시킨다
  ckCount++;

  // 체크박스에 새로운 count 값을 저장
  $(this).data("count", ckCount);

  // 홀수, 짝수에 따라 클래스 추가 또는 제거
  if (ckCount % 2 === 1) {
    $(this).parent().addClass("complete");
  } else {
    $(this).parent().removeClass("complete");
  }
});

// editBtn 수정 기능
let editCount = 0;
todoBox.on("click", "#edit__btn", function () {
  editCount++;
  // 카운트 0 부터 시작 첫 번째 클릭 = 1 2번 째 클릭 = 2
  if (editCount % 2 === 1) {
    // 카운트가 홀 수 일때 check로 아이콘 변경
    $(this).removeClass();
    $(this).addClass("fa-solid fa-check");
  } else {
    // 카운트가 짝 수 일때 pen으로 아이 콘 변경
    $(this).removeClass();
    $(this).addClass("fa-regular fa-pen-to-square");
  }
});
