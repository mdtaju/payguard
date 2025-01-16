const Input = ({
  title,
  required,
  ...rest
}: {
  title: string;
  placeholder: string;
  type: string;
  name: string;
  required: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex flex-col gap-1 w-full mt-4">
      <span className="text-sm font-semibold text-gray-800">
        {title} {required && <span className="text-bold text-red-500">*</span>}
      </span>
      <input
        className="w-full px-3 py-2 bg-secondary border border-gray-300 rounded-md outline-gray-500 transition-all"
        required={required}
        {...rest}
      />
    </div>
  );
};

export default Input;
