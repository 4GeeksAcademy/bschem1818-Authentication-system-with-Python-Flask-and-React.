import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import { useNavigate } from "react-router-dom";

import "../../styles/home.css";


export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()

	function handleLogout(){
		actions.logout()
		navigate("/form")
	}
	function handleLogin(){
		actions.logout()
		navigate("/login")
	}
	return (
		<div className="text-center mt-5">
			{store.auth ? <button onClick={()=>handleLogout()} className="btn btn-primary">Logout</button>:null}
			{store.auth ? <h1>Esto solo se ve cuando estas estes logeado</h1> :null}
			<button onClick={()=>handleLogin()} className="btn btn-primary">Login</button>

			<h1>Hello Rigo!!</h1>
			<p>
				<img src={rigoImageUrl} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
				
			</p>
		</div>
	);
};
