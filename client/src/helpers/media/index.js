import { v4 as uuidv4 } from "uuid";

export const addClass = (nameClass, element) => {
  const array = nameClass.split(" ");

  array.forEach((el) => {
    element.classList.add(el);
  });
};

export const replaceClass = (class1, class2, el) => {
  if (el.classList.contains(class1)) {
    el.classList.replace(class1, class2);
  } else {
    el.classList.replace(class2, class1);
  }
};

export const openStream = (isVideo) => {
  const config = {
    video: isVideo,
    audio: true,
  };

  return navigator.mediaDevices.getUserMedia(config);
};

export const findStream = (streamId) => {
  const listVideoContainer = Array.from(document.querySelectorAll(`.video`));

  return listVideoContainer.find(
    (el) => el.getAttribute("streamId") === streamId
  );
};

export const addVideoStream = (stream, isYou = false) => {
  if (!stream) return;

  const divStream = findStream(stream.id);

  if (divStream) return;

  const divEl = document.createElement("div");
  const imgEl = document.createElement("img");
  imgEl.style.display = "none";
  divEl.setAttribute("streamId", stream?.id);
  const iEl = document.createElement("i");
  addClass("fa-solid fa-thumbtack icon_video", iEl);
  divEl.classList.add("video");

  if (isYou) {
    divEl.classList.add("you_video");
  }

  const video = document.createElement("video");
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  iEl.onclick = (e) => {
    const videoPinCurent = document.querySelector(".video.pin");

    if (iEl.classList.contains("fa-thumbtack")) {
      if (videoPinCurent) {
        videoPinCurent.classList.remove("pin");
        const iconVideoPin = videoPinCurent.querySelector(".icon_video");
        replaceClass("fa-thumbtack", "fa-circle-xmark", iconVideoPin);
      }
      divEl.classList.add("pin");
    } else {
      divEl.classList.remove("pin");
    }
    replaceClass("fa-thumbtack", "fa-circle-xmark", e.target);
  };

  divEl.append(video);
  divEl.append(imgEl);
  divEl.append(iEl);

  document.querySelector(".video-joins").append(divEl);
};

export const playStream = (video, stream) => {
  if (!video) return;
  video.srcObject = stream;
  video.play();
  if (!video.uuid) {
    video.uuid = uuidv4();
  }
};

export const handleUpdateUserCamera = (data) => {
  const { img, streamId } = data;
  const divEl = findStream(streamId);

  if (divEl) {
    const videoEl = divEl.querySelector("video");
    const imgEl = divEl.querySelector("img");

    if (videoEl && imgEl) {
      if (img) {
        videoEl.style.display = "none";
        videoEl.pause();
        imgEl.src = img;
        imgEl.style.display = "block";
      } else {
        videoEl.style.display = "block";
        videoEl.play();
        imgEl.src = "";
        imgEl.style.display = "none";
      }
    }
  }
};
