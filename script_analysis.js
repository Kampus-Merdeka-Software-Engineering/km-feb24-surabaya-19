//create by Farhan

var changeScroll_top = 0;
var changeScroll_bottom = 0;
var navbar = document.querySelector(".navbar"); // Mengubah pemilihan elemen menjadi class navbar
var navLinks = document.querySelectorAll(".navbar-nav a"); // Menambahkan variabel untuk menyimpan semua tautan navbar
var footer = document.querySelector(".footer");
var footerText = document.querySelectorAll(".footer-text");

window.addEventListener("scroll", function(){
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var scrollBottom = window.pageYOffset || document.documentElement.scrollBottom;
  if(scrollTop > changeScroll_top){
    navbar.style.top = "-80px"; // Mengubah style top menjadi -80px untuk menyembunyikan navbar
    navLinks.forEach(function(link) {
      link.style.opacity = "0"; // Menyembunyikan tautan navbar dengan mengubah opacity menjadi 0
      link.style.transition = "0.5s";
    });

    if (scrollBottom > changeScroll_bottom){
      footer.style.bottom = "0"; // Mengubah style top menjadi -80px untuk menyembunyikan navbar
    footerText.forEach(function(link) {
      link.style.opacity = "1"; // Menyembunyikan tautan navbar dengan mengubah opacity menjadi 0
      link.style.transition = "0.5s";
    });
    }
  } else {
    navbar.style.top = "0"; // Mengembalikan style top menjadi 0 untuk menampilkan navbar kembali
    footer.style.bottom = "-80px"
    navLinks.forEach(function(link) {
      link.style.opacity = "1"; // Menampilkan kembali tautan navbar dengan mengubah opacity menjadi 1
      link.style.transition = "0.5s";
    });

    footerText.forEach(function(link) {
      link.style.opacity = "0"; // Menyembunyikan tautan navbar dengan mengubah opacity menjadi 0
      link.style.transition = "0.5s";
    });
  }
  changeScroll_top = scrollTop;
  changeScroll_bottom = scrollBottom;
});



//Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
//Ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};


//Klik diluar sidebar untuk menghilangkan bar
const hamburgerMenu = document.querySelector("#hamburger-menu"); // Mengubah variabel menjadi hamburgerMenu
document.addEventListener("click", function (e) {
  if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) { // Mengubah hamburger menjadi hamburgerMenu
    navbarNav.classList.remove("active");
  }
});

const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => { // Menggunakan forEach untuk iterasi pada setiap dropdown
  const select = dropdown.querySelector('.select');
  const pickme = dropdown.querySelector('.pickme');
  const menu = dropdown.querySelector('.menu');
  const options = dropdown.querySelectorAll('.menu li'); // Mengubah menjadi querySelectorAll
  const selected = dropdown.querySelector('.selected');

  select.addEventListener('click', () => {
    select.classList.toggle('select-clicked');
    pickme.classList.toggle('pickme-rotate');
    menu.classList.toggle('menu-open');
  });

  options.forEach(option => { // Menggunakan forEach untuk iterasi pada setiap opsi
    option.addEventListener('click', () => {
      selected.innerText = option.innerText;
      select.classList.remove('select-clicked');
      pickme.classList.remove('pickme-rotate');
      menu.classList.remove('menu-open');

      options.forEach(opt => {
        opt.classList.remove('active-click');
      });
      option.classList.add('active-click');
    });
  });
});

const photo_coffe = document.querySelectorAll(".photo_coffe");