document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form[action='/new']");
  const box = document.querySelector("#posts-container");

  function addPost(title, text) {
    box.innerHTML += `
      <div>
        <h3>${title}</h3>
        <p>${text}</p>
        <button class="del">Delete</button>
        <button class="edit">Edit</button>
        <hr>
      </div>
    `;
  }

  function delPost(btn) {
    btn.parentElement.remove();
  }

  function editPost(btn) {
    const div = btn.parentElement;
    const h3 = div.querySelector("h3");
    const p = div.querySelector("p");
    const newTitle = prompt("Edit title:", h3.innerText);
    const newText = prompt("Edit content:", p.innerText);
    if (newTitle !== null) h3.innerText = newTitle;
    if (newText !== null) p.innerText = newText;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = form.querySelector("input[name='title']").value.trim();
    const text = form.querySelector("textarea[name='content']").value.trim();
    if (title && text) {
      addPost(title, text);
      form.reset();
    }
  });

  box.addEventListener("click", function (e) {
    if (e.target.classList.contains("del")) delPost(e.target);
    if (e.target.classList.contains("edit")) editPost(e.target);
  });
});
