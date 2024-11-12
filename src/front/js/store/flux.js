const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			user: {
				email: [],
				password: [],
			},
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},


			logout: () => {
				localStorage.removeItem("token");
				setStore({ foundation: false });
			},

			login: async (email, password) => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							'email': email,
							'password': password
						})
					};
					const response = await fetch(process.env.BACKEND_URL + "/api/login", requestOptions);

					if (!response.ok) {
						console.error("Login failed:", response.statusText);
						return false;
					}

					const data = await response.json();
					localStorage.setItem("token", data.access_token);
					setStore({ foundation: data.user });  // Update as necessary for your app
					return true;
				} catch (error) {
					console.error("Error during login:", error);
					return false;
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
