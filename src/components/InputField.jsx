const InputField = ({
  label,
  id,
  type = "text",
  errors = {},
  register,
  message,
  className = "",
  min,
  placeholder,
  value,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        className={`${className} px-2 py-2 border rounded-md outline-none bg-transparent text-slate-800 ${
          errors[id] ? "border-red-500" : "border-slate-300"
        }`}
        {...register(id, {
          required: {
            value: true,
            message: message || "This field is required",
          },
          minLength: min
            ? {
                value: min,
                message: `Minimum ${min} characters required`,
              }
            : undefined,
          pattern:
            type === "email"
              ? {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                }
              : type === "url"
              ? {
                  value: /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
                  message: "Invalid URL",
                }
              : undefined,
        })}
      />

      {errors[id] && (
        <p className="text-red-500 text-sm mt-1">{errors[id]?.message}</p>
      )}
    </div>
  );
};

export default InputField;
