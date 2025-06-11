import { useDispatch } from "react-redux"
import {logoutUser} from "../../services/user.js"
import {logout} from "../../store/slices/authSlice.js"


function LogoutBtn() {

  const dispatch = useDispatch()

  async function logoutHandler(){
       const response = await logoutUser()

       if(response.success){
        console.log("logout done successfully")
           dispatch(logout())
       }
  }

  return (
    <button className="inline-block px-6 py-2 rounded-md bg-purple-400 hover:bg-green-500 transition-colors duration-300 cursor-pointer"
      onClick={logoutHandler}
    >
        Logout
    </button>
  )
}

export default LogoutBtn