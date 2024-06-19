import { useUser } from "../../contexts/UserContext";

export function ChatList() {
  const { user } = useUser();
  console.log(user, "WAS HERE BEBY");
  return <h1>Hello there</h1>;
}
