const createBtn = $("#create__btn");
const userWriteInput = $("#user__wirte");
const todoBox = $(".todo__box");
const userTodoInput = $("#user__todo");

const newTodo = function () {
  // 랜덤 키 생성
  const randomNum = Math.random().toString();
  // 사용자가 입력한 값
  const todoValue = userWriteInput.val();
  const todoData = {
    id: randomNum,
    value: todoValue,
    checked: false,
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
                <i class="fa-solid fa-eraser" id="remove__btn"></i>
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
    <div class="todo__list ${todoData.checked ? "complete" : ""}" id="${
      todoData.id
    }"> 
                <input type="checkbox" id="ckbox" ${
                  todoData.checked ? "checked" : ""
                }>
                <input type="text" disabled id="user__todo" value="${
                  todoData.value
                }"> 
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
  if ($(this).parent().hasClass("complete")) {
    $(this).parent().removeClass("complete");
  } else {
    $(this).parent().addClass("complete");
  }
  const todoId = $(this).closest(".todo__list").attr("id");
  const isChecked = $(this).prop("checked");

  let localTodoData = JSON.parse(localStorage.getItem("todos")) || [];
  const todoIndex = localTodoData.findIndex((todo) => todo.id === todoId);
  localTodoData[todoIndex].checked = isChecked;
  localStorage.setItem("todos", JSON.stringify(localTodoData));
});

// editBtn 수정 기능
let editCount = 0;
todoBox.on("click", "#edit__btn", function () {
  // 클릭된 에딧 버튼의 부모 요소인 todo__list의 id 값을 가져옵니다.
  const todoId = $(this).closest(".todo__list").attr("id");

  // 해당 todo의 체크박스가 체크된 상태인지 확인합니다.
  const isChecked = $(this)
    .closest(".todo__list")
    .find("#ckbox")
    .prop("checked");

  // 체크박스가 체크되어 있으면 수정할 수 없도록 합니다.
  if (isChecked) {
    return; // 수정할 수 없는 상태이므로 함수를 종료합니다.
  }

  // 에딧 카운트를 증가시킵니다.
  editCount++;

  // 에딧 카운트가 홀수일 때(수정 모드일 때)
  if (editCount % 2 === 1) {
    // 에딧 버튼 아이콘을 체크 모양으로 변경합니다.
    $(this).removeClass().addClass("fa-solid fa-check");

    // 해당 todo의 텍스트 input을 활성화하고 포커스를 줍니다.
    $(this)
      .closest(".todo__list")
      .find("input[type='text']")
      .removeAttr("disabled")
      .focus();
  } else {
    // 에딧 카운트가 짝수일 때(수정 완료 모드일 때)
    // 에딧 버튼 아이콘을 다시 펜으로 변경합니다.
    $(this).removeClass().addClass("fa-regular fa-pen-to-square");

    // 수정된 텍스트를 가져옵니다.
    const editedValue = $(this)
      .closest(".todo__list")
      .find("input[type='text']")
      .val();

    // 로컬 스토리지에서 해당 할 일 데이터를 가져옵니다.
    let localTodoData = JSON.parse(localStorage.getItem("todos")) || [];

    // 해당 ID와 일치하는 할 일 데이터를 찾습니다.
    const matchedTodo = localTodoData.find((todo) => todo.id === todoId);

    // 수정된 값을 할 일 데이터에 반영합니다.
    matchedTodo.value = editedValue;

    // 수정된 할 일 데이터를 다시 로컬 스토리지에 저장합니다.
    localStorage.setItem("todos", JSON.stringify(localTodoData));

    // 수정이 완료되면 텍스트 input을 비활성화합니다.
    $(this)
      .closest(".todo__list")
      .find("input[type='text']")
      .attr("disabled", true);
  }
});

// reset 버튼 클릭 시 모든 로컬 스토리지 삭제
$("#reset").click(function () {
  localStorage.removeItem("todos");
  location.reload();
});
