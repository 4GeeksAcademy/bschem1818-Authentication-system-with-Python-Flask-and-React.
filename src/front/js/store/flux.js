const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            auth: localStorage.getItem("token") ? true : false, 
            user: null, 
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
        },

        actions: {
            signup: async (formData) => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                };
                const response = await fetch(process.env.BACKEND_URL + "/api/signup", requestOptions);
                const data = await response.json();

                if (response.ok) {
                    // Guardar el token si el backend lo envía, y actualizar auth a true
                    if (data.access_token) localStorage.setItem("token", data.access_token);
                    setStore({ auth: true });
                    return { success: true };
                } else {
                    console.error("Signup error:", data);
                    return { success: false, message: data.msg };
                }
            },

            login: async (email, password) => {
                try {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 'email': email, 'password': password })
                    };
                    const response = await fetch(process.env.BACKEND_URL + "/api/login", requestOptions);

                    if (!response.ok) {
                        console.error("Login failed:", response.statusText);
                        return false;
                    }

                    const data = await response.json();
                    localStorage.setItem("token", data.access_token);
                    setStore({ auth: true, user: data.user });  // Actualizamos auth y user
                    return true;
                } catch (error) {
                    console.error("Error during login:", error);
                    return false;
                }
            },

            logout: () => {
                localStorage.removeItem("token");
                setStore({ auth: false, user: null });  // Actualizamos auth a false y eliminamos el usuario
            },

            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            private: async () => {
                const response = await fetch(process.env.BACKEND_URL + "/api/private", {
                    headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
                });
                const data = await response.json();
                if (response.ok) {
                    setStore({ user: data.user });
                    return true;
                }
                setStore({ user: false });
                return false;
            },

            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            }
        }
    };
};

export default getState;
