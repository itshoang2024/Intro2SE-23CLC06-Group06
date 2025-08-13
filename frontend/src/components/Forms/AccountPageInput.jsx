import { useEffect, useRef, useState } from "react";
import { EyeOpen, EyeClosed } from "../../assets/icons/index.jsx";

const AccountPageInput = (props) => {
  const inputRef = useRef(null); // tranh render lai khi thay doi props type
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (props.type === "submit" && inputRef.current) {
      inputRef.current.classList.add("cursor-pointer");
    }
  }, [props.type]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordField = props.type === "password";
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : props.type;

  return (
    <div className="input">
      {props.label && (
        <label htmlFor={props.id || props.name}>
          {props.label}
          {props.labelIcon && (
            <img
              src={props.labelIcon}
              alt="required"
              style={{ marginLeft: "2px", verticalAlign: "middle" }}
            />
          )}
        </label>
      )}
      <div className="input__container">
        <input
          ref={inputRef}
          type={inputType}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          pattern={props.pattern}
          required={props.required}
          disabled={props.disabled}
          className={`input__${props.type || ""}`}
        />
        {isPasswordField && (
          <button
            type="button"
            className="input__eye-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <img 
              src={showPassword ? EyeClosed : EyeOpen} 
              alt={showPassword ? "Hide password" : "Show password"}
            />
          </button>
        )}
      </div>
      {props.error && <div className="input-error">{props.error}</div>}
    </div>
  );
};

export default AccountPageInput;
