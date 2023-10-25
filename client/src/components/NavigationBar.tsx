function NavigationBar() {
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
          <img
            src="/src/assets/Recycle001.svg"
            className="h-8 mr-3"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Freecycle-inc
          </span>
        </a>
        <div
          className="hidden w-full md:block md:w-auto"
          id="navbar-default"
        ></div>
      </div>
    </nav>
  );
}

export default NavigationBar;
