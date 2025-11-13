import ThemeToggle from "./ThemeToggle";

const Logo = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex justify-center md:justify-start flex-1 md:flex-none">
        <img
          src="/logo-light.svg"
          alt="Logo"
          className="h-[2.5rem] md:h-[3rem] dark:hidden"
        />
        <img
          src="/logo-dark.svg"
          alt="Logo"
          className="h-[2.5rem] md:h-[3rem] hidden dark:block"
        />
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Logo;
