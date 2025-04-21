import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = "https://codeflex-wjlg.onrender.com";
// const BASE_URL = "http://localhost:5000";

function ProfilePage() {
  const [allPlans, setAllPlans] = useState([]);
  const { user } = useAuth0();

  useEffect(() => {
    async function fetchAllPlans() {
      try {
        const res = await axios.get(`${BASE_URL}/getplans/${user.sub}`);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllPlans();
  });

  return <div>ProfilePage</div>;
}

export default ProfilePage;
