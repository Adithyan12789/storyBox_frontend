"use client";

export default function Button(props) {
  const {
    newClass,
    btnColor,
    btnName,
    onClick,
    style,
    btnIcon,
    disabled,
    type,
  } = props;

  return (
    <>
      <button
        className={`themeBtn text-center ${newClass || ""} ${btnColor || ""}`}
        onClick={onClick}
        style={style}
        disabled={disabled}
        type={type}
      >
        {btnIcon ? (
          <>
            {btnIcon}
             {btnName}
          </>
        ) : (
          btnName
        )}
      </button>
    </>
  );
}
