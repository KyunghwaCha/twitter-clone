import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 12px;
`;
const Payload = styled.p`
  margin: 20px 0;
  font-size: 12px;
`;

interface repliesListForm {
  userName: string;
  comment: string;
}

export default function RepliesList({ userName, comment }: repliesListForm) {
  return (
    <Wrapper>
      <Username>{userName}</Username>
      <Payload>{comment}</Payload>
    </Wrapper>
  );
}
