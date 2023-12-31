document.addEventListener("DOMContentLoaded", function () {
  const addForm = document.querySelector("#addForm form");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const articleTable = document.querySelector("#articleTable table");
  const articleContent = document.getElementById("articleContent");

  const storedArticles = JSON.parse(localStorage.getItem("articles")) || [];

  function updateArticleTable() {
    articleTable.innerHTML = `
      <tr>
          <th>Title</th>
          <th>Content</th>
          <th>Actions</th>
      </tr>
    `;

    for (const [index, article] of storedArticles.entries()) {
      const newRow = articleTable.insertRow();
      const titleCell = newRow.insertCell();
      const actionsCell = newRow.insertCell();

      titleCell.textContent = article.title;
      titleCell.classList.add("article-title");

      actionsCell.innerHTML = `
        <div class="btn-container">
          <button class="button-50 btn-edit" data-index="${index}">Edit</button>
          <button class="button-50 btn-delete" data-index="${index}">Delete</button>
        </div>
      `;

      const contentRow = articleTable.insertRow();
      const contentCell = contentRow.insertCell();
      contentCell.classList.add("article-content");
      contentCell.colSpan = 3;
      contentCell.textContent = article.content;
      contentCell.style.display = "none";
    }
  }

  window.addEventListener("load", function () {
    updateArticleTable();
  });

  addForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value;
    const content = contentInput.value;

    storedArticles.push({ title, content });
    localStorage.setItem("articles", JSON.stringify(storedArticles));

    updateArticleTable();
    titleInput.value = "";
    contentInput.value = "";
  });

  articleTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("article-title")) {
      const contentCell =
        event.target.parentElement.nextElementSibling.querySelector(
          ".article-content"
        );
      contentCell.style.display =
        contentCell.style.display === "none" ? "table-cell" : "none";
    } else if (event.target.classList.contains("btn-edit")) {
      const index = event.target.getAttribute("data-index");
      const article = storedArticles[index];

      titleInput.value = article.title;
      contentInput.value = article.content;

      storedArticles.splice(index, 1);
      localStorage.setItem("articles", JSON.stringify(storedArticles));

      updateArticleTable();
    } else if (event.target.classList.contains("btn-delete")) {
      const index = event.target.getAttribute("data-index");

      storedArticles.splice(index, 1);
      localStorage.setItem("articles", JSON.stringify(storedArticles));

      updateArticleTable();
    }
  });

  function addToArticle(content) {
    const element = document.createElement("div");
    element.innerHTML = content;
    articleContent.appendChild(element);
  }

  document.getElementById("addImage").addEventListener("click", (event) => {
    event.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          addToArticle(`<img src="${e.target.result}" alt="Image">`);
        };
        reader.readAsDataURL(file);
      }
    });
    input.click();
  });

  document.getElementById("addVideo").addEventListener("click", (event) => {
    event.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          addToArticle(
            `<video controls><source src="${e.target.result}" type="video/mp4">Your browser does not support the video tag.</video>`
          );
        };
        reader.readAsDataURL(file);
      }
    });
    input.click();
  });

  document.getElementById("addImageUrl").addEventListener("click", (event) => {
    event.preventDefault();
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      addToArticle(`<img src="${imageUrl}" alt="Image">`);
    }
  });

  document.getElementById("addVideoUrl").addEventListener("click", (event) => {
    event.preventDefault();
    const videoUrl = prompt("Enter video URL:");
    if (videoUrl) {
      addToArticle(
        `<video controls><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`
      );
    }
  });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("articles", JSON.stringify(storedArticles));
  });

  const darkModeToggle = document.getElementById("dark-mode-toggle");

  darkModeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });

  const darkModePreference = localStorage.getItem("darkMode");

  if (darkModePreference === "enabled") {
    darkModeToggle.checked = true;
    document.body.classList.add("dark-mode");
  }
});
