import { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../filebase";
import { addDoc, collection } from "firebase/firestore";
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0%;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitButton = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: 10px 0;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<string | null>(null);

  const FileChangeHandle = (
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
  const OnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const OnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    FileChangeHandle(e, (fileData) => {
      setFile(fileData);
    });
  };

  const OnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 140) return;

    try {
      setLoading(true);
      await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        fileData: file,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={OnSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={140}
        onChange={OnChange}
        value={tweet}
        placeholder="무슨 일이 일어나고 있나요?"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={OnFileChange}
        id="file"
        type="file"
        accept="image/*"
      />
      <SubmitButton
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
}
