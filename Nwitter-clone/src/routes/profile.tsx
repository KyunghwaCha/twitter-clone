import styled from "styled-components";
import { auth, db } from "../filebase";
import { useEffect, useState } from "react";
import { FileChangeHandle } from "../utils/util";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState("");
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    const profileQuery = query(
      collection(db, "profile"),
      where("userId", "==", user?.uid)
    );

    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );

    const unsubscribe = onSnapshot(profileQuery, (snapshot) => {
      if (snapshot.empty) return;
      const { imgSrc } = snapshot.docs[0].data();
      setAvatar(imgSrc);
    });

    const unsubscribe2 = onSnapshot(tweetQuery, (snapshot) => {
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, fileData } = doc.data();
        return {
          tweet,
          createdAt,
          userId,
          username,
          fileData,
          id: doc.id,
        };
      });
      setTweet(tweets);
    });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    FileChangeHandle(e, (fileData) => {
      setAvatar(fileData);
      saveProfile(fileData);
    });
  };

  const saveProfile = async (fileData: string) => {
    try {
      if (!user?.uid) return;
      const docRef = doc(db, "profile", user?.uid);
      await setDoc(
        docRef,
        {
          imgSrc: fileData,
          userId: user?.uid,
        },
        { merge: true }
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "Anonymous"}</Name>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
