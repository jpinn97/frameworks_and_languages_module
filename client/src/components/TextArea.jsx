const TextArea = ({ label, name, value, onChange, placeholder }) => {
    return (
      <div className="flex items-center mb-5">
        <label htmlFor={name} className="mr-2">{label}:</label>
        <textarea      
          className="border-b-2 border-gray-400 mx-auto flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400"
          id={name}
          name={name}
          rows="3"
          aria-label={label} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        ></textarea>                                                      
      </div>
    );
  };

  export default TextArea;