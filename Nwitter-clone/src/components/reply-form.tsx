import { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../filebase";
import { addDoc, collection } from "firebase/firestore";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
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
const SubmitButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  border: 10px 0;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
`;

interface ReplyForm {
  docId: string;
}

export default function ReplyForm({ docId }: ReplyForm) {
  const [comment, setComment] = useState("");
  const user = auth.currentUser;
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || comment == "") return;
    try {
      await addDoc(collection(db, "replies"), {
        docId,
        createdAt: Date.now(),
        comment,
        userId: user.uid,
        userName: user.displayName ?? "Anonymous",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={1}
        maxLength={140}
        placeholder="답글을 남겨보세요!"
        value={comment}
        onChange={onChange}
      />
      <SubmitButton type="submit">Add Reply!</SubmitButton>
    </Form>
  );
}
