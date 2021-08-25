import app from './js/app.js';
import './style.css';
import Logo from './img/logo.svg';

const view = `
<header class="app-bar bg-primary-dark text-white">
  <nav class="navbar">
    <a href="./"><img src=${Logo} alt="" class="logo" /></a>
  </nav>
</header>
<main class="app-body bg-primary">
  <h1>Hello Webpack!</h1>
</main>
<footer class="app-footer">Footer</footer>
`;

const root = document.getElementById('root');
root.innerHTML = view;

window.addEventListener('load', () => app());