import { SiGithub } from "react-icons/si";

const GithubCta = () => {
  return (
    <a
      target="_blank"
      href={"https://github.com/devyanshyadav/dev-imgkit"}
      className="fixed bottom-3 right-3 w-20 aspect-square  rounded-full z-50"
    >
      <div className="relative w-full h-full">
        <div className="bg-accent/30 absolute inset-1 animate-pulse rounded-full" />
        <div className="bg-accent/40 absolute inset-3 animate-pulse rounded-full" />
        <div className="bg-accent p-2 absolute flex items-center inset-5 rounded-full">
          <SiGithub className="text-3xl text-white" />
        </div>
      </div>
    </a>
  );
};

export default GithubCta;
