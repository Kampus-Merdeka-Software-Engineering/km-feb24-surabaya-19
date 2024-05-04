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
        opt.classList.remove('active');
      });
      option.classList.add('active');
    });
  });
});
