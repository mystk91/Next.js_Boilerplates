"use client";

/*
 * Returns a onChange function to be used on form inputs that will update its formData
 * Example:
 *    const [formData, setFormData] = useState(parameters);
 *    const handleChange = useFormUpdater(setFormData);
 *
 * setFormData - a setState from a useState hook
 */
export function useFormUpdater<T>(
  setFormData: React.Dispatch<React.SetStateAction<T>>
) {
  return function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
}
