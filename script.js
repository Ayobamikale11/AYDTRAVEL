function toggleNav() {
  const navbar = document.querySelector('.navbar');
  const body = document.body;

  navbar.classList.toggle('active');
  body.classList.toggle('nav-open');
}
