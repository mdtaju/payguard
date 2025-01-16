import { ReactNode } from "react";

const Form = ({
  title = "",
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="bg-white custom_shadow rounded-md p-4 w-full max-w-[600px] mx-auto mt-6">
      <h1 className="text-center text-2xl font capitalize font-medium">
        {title}
      </h1>
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default Form;
