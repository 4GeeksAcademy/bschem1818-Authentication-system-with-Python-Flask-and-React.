import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import { useNavigate } from "react-router-dom";

import "../../styles/home.css";


export const Private = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()

	function handleLogout(){
		actions.logout()
		navigate("/login")
	}
	return (
		<div className="text-center mt-5">
			{store.auth ? <button onClick={()=>handleLogout()} className="btn btn-primary">Logout</button>:null}
			{store.auth ? <h1>Esto solo se ve cuando estas estes logeado</h1> :null}

			
		</div>
	);
};
