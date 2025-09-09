import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
export default function Input(props) {
  const {
    label,
    name,
    id,
    type,
    onChange,
    newClass,
    value,
    defaultValue,
    errorMessage,
    placeholder,
    disabled,
    onFocus,
    readOnly,
    onKeyPress,
    checked,
    onClick,
    ref,
    required,
    style,
    accept,
    fieldClass,
    labelShow,
  } = props;

  const [types, setTypes] = useState(type);
  

  const hideShow = () => {
    types === "password" ? setTypes("text") : setTypes("password");
  };

  useEffect(() => {
    const handleWheel = (event) => {
      if (document.activeElement.type === "number") {
        event.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <>
      <div
        className={`custom-input ${type} ${newClass} ${
          type === "gender" && "me-2 mb-0"
        }`}
      >
       {labelShow == false ? " " : <label className="m-0" htmlFor={id}>{label}</label>}
        <input
          type={types}
          className={`${type === "file" ? "form-control": "form-input"}  ${fieldClass}`}
          // id={id}
          onChange={onChange}
          value={value ?? ""}
          defaultValue={defaultValue}
          name={name}
          // onWheel={(e) => type === "number"}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onKeyDown={onKeyPress}
          checked={checked}
          onClick={onClick}
          required={required}
          onFocus={onFocus}
          style={style}
          ref={ref}
          accept={accept}
          autoComplete="off"
        />

        {type !== "search" && errorMessage && (
          <p className="errorMessage">{errorMessage && errorMessage}</p>
        )}

        {type === "password" && (
          <div className="passHideShow" onClick={hideShow}>
            {types === "password" ? (
              <VisibilityIcon sx={{ fill: "#c9c9c9" }} />
            ) : (
              <VisibilityOffIcon sx={{ fill: "#c9c9c9" }} />
            )}
          </div>
        )}
        {type === "search" && !value && (
          <div className="searching">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        )}
      </div>
    </>
  );
}

export const Textarea = (props) => {
  const {
    id,
    label,
    row,
    col,
    placeholder,
    name,
    errorMessage,
    onChange,
    readOnly,
    value,
  } = props;
  const [error, setError] = useState("d-none");
  return (
    <div className="inputData text-start">
      <label
        style={{ color: "black", fontWeight: 600, marginBottom: "5px" }}
        htmlFor={id}
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={row}
        cols={col}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readOnly}
      ></textarea>
      <p
        className={`errorMessage text-start text-danger ${error}`}
        id={`error-${name}`}
      >
        {errorMessage}
      </p>
    </div>
  );
};
