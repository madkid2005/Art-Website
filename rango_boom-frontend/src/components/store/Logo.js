import React from 'react'
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function Logo() {
    const navigate = useNavigate("")
    
  return (
    <div>
     <div onClick={() => navigate("/")} className="d-block d-md-none text-center">
              <img className="mt-3" style={{ width: "300px" }} src={logo} alt="Logo" />
            </div>
    </div>
  )
}
