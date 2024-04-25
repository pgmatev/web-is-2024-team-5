import { useState, ChangeEvent, FormEvent } from "react";

interface FileInfo {
  fileName: string;
  fileSize: number;
}

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    // Default submit behaviour would refresh the page
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    // FormData is used for form submissions
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/file", {
        method: "POST",
        body: formData,
        // FormData automatically handles the Content-Type header
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });

      if (response.ok) {
        const data: FileInfo = await response.json();
        setFileInfo(data);
      } else {
        console.error("Failed to upload file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* For multiple files, add 'multiple' as a prop in the input element */}
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {fileInfo && (
        <div>
          <p>File Name: {fileInfo.fileName}</p>
          <p>File Size: {fileInfo.fileSize} bytes</p>
        </div>
      )}
    </div>
  );
}
