import { Input } from "antd";
import { useRef, useState } from "react";

const CustomOtpInput = ({
  value = "",       // value ที่ Form คุม (จะมีค่าเฉพาะตอนครบ)
  onChange,
  length = 4,
  disabled = false,
}) => {
  const inputsRef = useRef([]);
  const [innerValue, setInnerValue] = useState("");

  const otpArray = Array.from(
    { length },
    (_, i) => innerValue[i] || ""
  );

  const emitToForm = (val) => {
     if (val.length !== length || val.split("").includes("")) {
    onChange?.("");
    return;
  }

    // ✅ ครบ → ส่งค่าเข้า Form
    onChange?.(val);
  };

  const updateOtp = (index, val) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newInner =
      innerValue.slice(0, index) +
      val +
      innerValue.slice(index + 1);

    setInnerValue(newInner);
    emitToForm(newInner);

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key !== "Backspace") return;

    e.preventDefault();

    const newInner =
      innerValue.slice(0, index) +
      "" +
      innerValue.slice(index + 1);

    setInnerValue(newInner);
    emitToForm(newInner);

    if (index > 0) {
      requestAnimationFrame(() => {
        inputsRef.current[index - 1]?.focus();
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const paste = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);

    if (!paste) return;

    setInnerValue(paste);
    emitToForm(paste);

    inputsRef.current[Math.min(paste.length, length) - 1]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {otpArray.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          value={digit}
          maxLength={1}
          disabled={disabled}
          inputMode="numeric"
          style={{
            width: 60,
            height: 60,
            textAlign: "center",
            fontSize: "28px",
            borderRadius: 12,
            backgroundColor:"#d1cfcfff"
          }}
          onChange={(e) => updateOtp(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default CustomOtpInput;
