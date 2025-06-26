import styled from "styled-components";
import type { ITweet } from "./timeline";
import { auth, db } from "../filebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0;
  font-size: 18px;
`;

const MyPayload = styled.textarea`
  border: 2px solid white;
  margin: 10px 0;
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

const DeleteButton = styled.button`
  margin: 0 5px;
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 15px;
  cursor: pointer;
`;

const EditButton = styled.button`
  margin: 0 5px;
  background-color: white;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 15px;
  cursor: pointer;
`;

export default function Tweet({
  username,
  tweet,
  fileData,
  userId,
  id,
}: ITweet) {
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("정말로 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
    } catch (e) {
      console.log(e);
    }
  };

  const onEdit = async () => {
    try {
      await updateDoc(doc(db, "tweets", id), {
        tweet: editTweet,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onTweetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };

  const [editTweet, setEditTweet] = useState(tweet);
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {user?.uid === userId ? (
          <MyPayload onChange={onTweetChange} value={editTweet} />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <div>
            <EditButton onClick={onEdit}>Edit</EditButton>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          </div>
        ) : null}
      </Column>
      <Column>{fileData ? <Photo src={fileData} /> : null}</Column>
    </Wrapper>
  );
}
