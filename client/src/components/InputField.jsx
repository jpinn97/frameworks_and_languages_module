// Define the InputField functional component with destructured props.
const InputField = ({ label, name, type, value, onChange, placeholder }) => {
    return (
      <div className="flex items-center mb-5">
        <label htmlFor={name} className="mr-2">{label}:</label>
        <input
          className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-100 outline-none focus:border-green-400"
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };

  
// Export the InputField component for reuse in other parts of the application.
export default InputField;