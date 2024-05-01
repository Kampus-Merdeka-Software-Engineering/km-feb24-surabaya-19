//Toggle class active
const disdikbar = document.querySelector(".disdik-bar");
//Ketika pilihan di klik
document.querySelector("#menu").onclick = () => {
  disdikbar.classList.toggle("active");
};

//Klik diluar sidebar untuk menghulangkan bar
const menu = document.querySelector("#menu");

document.addEventListener("click", function (e) {
  if (!menu.contains(e.target) && !disdikbar.contains(e.target)) {
    disdikbar.classList.remove("active");
  }
});
