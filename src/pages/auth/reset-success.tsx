import { FaCircleCheck } from "react-icons/fa6";
import DevButton from "../../components/dev-components/dev-button";
import { IoMdHappy } from "react-icons/io";
import Logo from "../../components/global-cmp/logo";

const ResetSuccess = () => {
  return (
    <section className="flex items-center justify-center gap-5 w-full h-full bg-shade/30">
      <div className=" flex-grow  rounded-xl border border-shade/50 max-w-xl bg-white w-full flex flex-col p-5 justify-center">
      <Logo size="50px"/>
      <br />
        <div className="space-y-4">
          <div className="bg-accent/20 rounded-2xl p-1 w-fit">
          <IoMdHappy className="text-6xl text-accent" />
          </div>
          <h2 className="text-4xl font-semibold">
            All good!
          </h2>
          <p>
            Your password has been successfully reset. Go back to the login page
            and try logging in again..
          </p>
        </div>
        <br />
        <DevButton href="/login" className="w-full" type="submit">Back to Login</DevButton>
      </div>
    </section>
  );
};

export default ResetSuccess;
