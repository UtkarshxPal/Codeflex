import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = "https://codeflex-wjlg.onrender.com";
// const BASE_URL = "http://localhost:5000";

function ProfilePage() {
  const [allPlans, setAllPlans] = useState([]);
  const { user } = useAuth0();
  const userId = user.sub;
  const encodedUserId = encodeURIComponent(userId);

  useEffect(() => {
    async function fetchAllPlans() {
      try {
        const res = await axios.get(`${BASE_URL}/getplans/${encodedUserId}`);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllPlans();
  }, [encodedUserId]);

  return <div>ProfilePage</div>;
}

export default ProfilePage;
