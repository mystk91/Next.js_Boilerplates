"use client";

/*
 * Returns a onChange function to be used on a form that will update its formData
 * Example:
 *    const [formData, setFormData] = useState(parameters);
 *    const handleChange = useFormUpdater(setFormData);
 *
 * setFormData - a setState from a useState hook
 */
export function useFormUpdater<T extends Record<string, any>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>
) {
  return function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
}
