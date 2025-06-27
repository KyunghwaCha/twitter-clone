export const FileChangeHandle = (
  e: React.ChangeEvent<HTMLInputElement>,
  onFileLoad: (fileData: string) => void
) => {
  const { files } = e.target;
  if (files && files.length === 1) {
    const { files } = e.target;
    if (files && files.length === 1) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onFileLoad(result);
      };
      reader.readAsDataURL(files[0]);
    }
  }
};
