import { useAuth } from "../Context/AuthContext";
import Admin from "./Admin";
import Employee from "./Employee";
import Customer from "./Customer";
import Login from "./Login";




const Home = () => {
    const { user, loading } = useAuth();
    if (loading) return <p>Loading, Please Wait ...</p>;

    if (user) {
        // console.log(user.user.roles);
    }

    switch(user.user.roles) {
        case "Admin":
          return <Admin/>
          break;
        case "Employee":
            return <Employee/>
          break;
        case "Customer":
            return <Customer/>
          break;
        default:
            return <Login/>
      }


    
}
export default Home;