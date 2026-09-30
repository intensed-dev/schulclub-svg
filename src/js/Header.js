export function loadHeader(headerEl) {
  document.getElementById(headerEl).innerHTML = HeaderTemplate;
}

export const Menu = `
<label for="page-content" aria-label="open sidebar" class="btn btn-square btn-ghost drawer-button">
  <!-- Sidebar toggle icon -->
  <i class="fa-solid fa-chevron-right"></i>
</label>
`;

export const Title = `
<a class="btn btn-ghost text-xl" href="/toolbox">Schulclub SVG</a>
`;

export const ThemeSwitcher = `
<div class="dropdown">
  <div tabindex="0" role="button" class="btn m-1">
    Theme
    <svg
      width="12px"
      height="12px"
      class="inline-block h-2 w-2 fill-current opacity-60"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048">
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
    </svg>
  </div>
  <ul tabindex="-1" class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Default"
        value="default" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Retro"
        value="retro" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Cyberpunk"
        value="cyberpunk" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Valentine"
        value="valentine" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Aqua"
        value="aqua" />
    </li>
  </ul>
</div>
`;

export const HeaderTemplate = `
<nav class="navbar bg-base-100 shadow-sm w-full">
  <div class="flex-none">
    ${Menu}
  </div>
  <div class="flex-1">
    ${Title}
  </div>
  <div class="flex-none">
    ${ThemeSwitcher}

    
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <div class="grid place-items-center h-[100%] bg-base-300 border border-neutral-300 rounded-full">
            <i class="fa-regular fa-user text-xl rounded-full"></i>
          </div>
        </div>
      </div>
      <ul
        tabindex="-1"
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a class="justify-between">
            Profile
            <span class="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</nav>
`;