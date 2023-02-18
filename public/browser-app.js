const displayDOM = document.querySelector(".display");

let searching = false;
// check is list is empty
let haveList = false;
// check if editing list name;
let isEditingName = false;
// track ID that is being edit
let editingID = "";
// add list section
const inputAddDOM = document.querySelector(".input-add");
const inputSearchDOM = document.querySelector(".input-search");
const btnAddDOM = document.querySelector(".btn-add");
const btnSearchDOM = document.querySelector(".btn-search");
// delete list section
const deleteList = (listsID) => {
  if (haveList) {
    const btnDeleteDOM = document.querySelectorAll(".btn-delete");
    const btnsArr = Array.from(btnDeleteDOM);
    btnsArr.map((singleBtn, index) => {
      singleBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await axios.delete(
          `https://to-do-list-6eom.onrender.com/api/v1/lists/${listsID[index]}`
        );
        fetchLists();
      });
    });
  }
};

// add line-through to complete list, click at list name to trigger function
const finishedList = (listsID, listsStatus) => {
  if (haveList) {
    const listsText = document.querySelectorAll("h3");
    const listsTextArr = Array.from(listsText);
    listsTextArr.map((listText, index) => {
      listText.addEventListener("click", async (e) => {
        e.preventDefault();

        await axios.patch(
          `https://to-do-list-6eom.onrender.com/api/v1/lists/${listsID[index]}`,
          {
            status: !listsStatus[index],
          }
        );
        fetchLists();
      });
    });
  }
};

// edit list's name
const editList = async (listsID) => {
  if (haveList) {
    const btnsEdit = document.querySelectorAll(".btn-edit");

    const btnsEditArr = Array.from(btnsEdit);
    btnsEditArr.map((btn, index) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        isEditingName = true;
        editingID = listsID[index];
        fetchLists();
      });
    });
  }
};

// done editing list's name
const doneEdit = (editingID) => {
  const btnDone = document.querySelector(".btn-done");
  btnDone.addEventListener("click", async () => {
    const inputListName = document.querySelector(".input-list-name");
    const newName = inputListName.value;
    await axios.patch(
      `https://to-do-list-6eom.onrender.com/api/v1/lists/${editingID}`,
      {
        name: newName,
      }
    );
    isEditingName = false;
    editingID = "";
    fetchLists();
  });
};

// fetch all lists data
const fetchLists = async (query) => {
  try {
    let data;
    if (searching) {
      data = await axios.get(
        `https://to-do-list-6eom.onrender.com/api/v1/lists?search=${query}`
      );
      searching = false;
    } else {
      data = await axios.get(
        `https://to-do-list-6eom.onrender.com/api/v1/lists`
      );
    }
    const lists = data.data.lists;
    if (lists.length > 0) {
      haveList = true;
    }
    const listsID = [];
    const listsStatus = [];
    const allLists = lists
      .map((list) => {
        const { _id: listID, name, status } = list;

        listsID.push(listID);
        listsStatus.push(status);
        return `<article class="single-display ${
          isEditingName && editingID === listID && "editing"
        }">
        <div class="list=text-container">
       ${
         isEditingName && editingID === listID
           ? `<input type="text" class="input-list-name"></input>`
           : `<h3 class=${status && "completed"}>${name}</h3>`
       }
      </div>
      <div class="list-btn-container">${
        isEditingName && editingID === listID
          ? `<button type="submit" class="btn btn-done">done 
      </button>`
          : `<button type="submit" class="btn btn-edit">edit 
      </button>`
      }
          <button class="btn btn-delete">delete</button>
      </div>
  </article>`;
      })
      .join("");
    displayDOM.innerHTML = allLists;
    deleteList(listsID);
    if (isEditingName) {
      doneEdit(editingID);
    } else {
      editList(listsID);
      finishedList(listsID, listsStatus);
    }
  } catch (err) {
    console.log(err);
  }
};

fetchLists();

btnAddDOM.addEventListener("click", async (e) => {
  e.preventDefault();

  const listName = inputAddDOM.value;
  try {
    await axios.post("https://to-do-list-6eom.onrender.com/api/v1/lists", {
      name: listName,
    });
    fetchLists();
    inputAddDOM.value = "";
  } catch (err) {
    console.log(err);
  }
});

btnSearchDOM.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    searching = true;
    fetchLists(inputSearchDOM.value);
    inputSearchDOM.value = "";
  } catch (err) {
    console.log(err);
  }
});
