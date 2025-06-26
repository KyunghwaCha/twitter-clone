import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../filebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  fileData?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
  scrollbar-width: none;
`;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
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
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
