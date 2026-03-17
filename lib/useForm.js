import { useEffect, useState } from "react";

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);
  const initialValue = Object.values(initial).join("");

  useEffect(() => {
    setInputs(initial);
  }, [initialValue]);

  function handleChange(e) {
    let { name, value, type } = e.target;
    if (type === "number") {
      value = parseFloat(value);
    }
    if (type === "file") {
      [value] = e.target.files;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  }
  function resetForm() {
    setInputs(initial);
  }
  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ""]),
    );
    setInputs(blankState);
  }
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
