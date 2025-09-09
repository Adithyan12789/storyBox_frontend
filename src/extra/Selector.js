export default function Selector(props) {
  const {
    label,
    placeholder,
    selectValue,
    paginationOption,
    id,
    labelShow,
    selectData,
    onChange,
    defaultValue,
    errorMessage,
    selectId,
    disabled,
  } = props;

  return (
    <div className="selector-custom">
      {labelShow === false ? (
        " "
      ) : (
        <label htmlFor={id} className="label-selector-custom m-0">
          {label}
        </label>
      )}

      <div style={{ minWidth: 120 }} className="form-group">
        <div className="form-outline w-100">
          <select
            id="formControlLg"
            className="form-select py-2 text-capitalize"
            value={selectValue || ""}
            onChange={onChange}
            style={{ borderRadius: "5px", maxHeight: "200px" }}
            disabled={disabled}
          >
            {paginationOption !== false && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {selectData?.map((item, index) => (
              <option
                key={index}
                value={typeof item === "string" ? item : item.value || ""}
              >
                {typeof item === "string" ? item : item.label || item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
    </div>
  );
}
