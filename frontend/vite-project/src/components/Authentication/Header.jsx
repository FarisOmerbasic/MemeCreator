import Login from "./Login";
import Logout from "./Logout";
import UserProfile from "./UserProfile";

export default function Header() {
  return (
    <header>
      <div>
        <UserProfile />
        <Login />
        <Logout />
      </div>
    </header>
  );
}
