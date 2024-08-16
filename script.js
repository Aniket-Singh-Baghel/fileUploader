const form = document.querySelector("form");
const fileInput = document.querySelector("input");
const container = document.getElementById("file_info");
const dropZone = document.getElementById("drop-zone");
const modal = document.getElementById("video-modal");
const closeButton = document.querySelector(".close-button"); // Close button for modal
const videoPlayer = document.querySelector(".video-player");

dropZone.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragging");
});

dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragging");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragging");
  const files = e.dataTransfer.files;
  fileInput.files = files;
  displayFiles(files);
});

fileInput.addEventListener("change", () => {
  displayFiles(fileInput.files);
});

function displayFiles(files) {
  //   container.innerHTML = "";

  for (let i = 0; i < fileInput.files.length; i++) {
    console.log(fileInput.files);
    const file = files[i];
    const truncatedName = file.name.substring(0, 35);
    const fullName = file.name;
    const sizeKB = (file.size / 1024).toFixed(2);

    const reader = new FileReader();

    reader.onload = function (event) {
      const previewUrl = event.target.result;
      const infoDiv = document.createElement("div");
      infoDiv.classList.add("info");
      let fileType = "unknown";
      if (file.type.startsWith("image/")) {
        fileType = "image";
      }
      if (file.type.startsWith("video/")) {
        fileType = "video";
      }
      if (file.type.startsWith("text/")) {
        fileType = "text";
      }
      infoDiv.innerHTML = `
            <p>${fileType}</p>
             <p class="image_info" data-fullname="${fullName}">${truncatedName}..</p>
            <p class="percentage image_size">${sizeKB} KB</p>
        `;
      if (file.type.startsWith("image/")) {
        infoDiv.innerHTML += `
          <img src="${previewUrl}" alt="Preview" class="file-preview"/>
          <button class="delete">Delete</button>`;

        container.appendChild(infoDiv);

        const deleteButton = infoDiv.querySelector(".delete");

        deleteButton.addEventListener("click", () => {
          infoDiv.remove();
        });
      } else if (file.type.startsWith("video/")) {
        infoDiv.innerHTML += `
          <div class="video-container">
              <video src="${previewUrl}" class="video-preview"></video>
              <button class="play-button">
                  <i class="ri-play-circle-fill"></i>
              </button>
          </div>
          <button class="delete">Delete</button>`;

        const playButton = infoDiv.querySelector(".play-button");
        playButton.addEventListener("click", () => {
          videoPlayer.src = previewUrl; // Set the video source
          modal.style.display = "block"; // Show the modal
          videoPlayer.play(); // Play the video
        });

        container.appendChild(infoDiv);

        const deleteButton = infoDiv.querySelector(".delete");

        deleteButton.addEventListener("click", () => {
          infoDiv.remove();
        });
      }
    };

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      reader.readAsDataURL(file);
    } else {
      // Handle other

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("info");

      infoDiv.innerHTML += `
          <div className="image_desc">
            <p class="image_info" data-fullname="${fullName}">${truncatedName}</p>
            <p class="percentage image_size">${sizeKB} KB</p>
          </div>
          <button class="delete">Delete</button>`;

      container.appendChild(infoDiv);
      const deleteButton = infoDiv.querySelector(".delete");
      deleteButton.addEventListener("click", () => {
        infoDiv.remove();
      });
    }
  }
}
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
  videoPlayer.pause();
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    videoPlayer.pause();
  }
});
