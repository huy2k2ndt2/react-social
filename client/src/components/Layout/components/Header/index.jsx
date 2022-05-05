import { useEffect } from "react";

function Header() {
  useEffect(() => {
    console.log("useEect header");
  }, []);

  return <h2>Header</h2>;
}

export default Header;
