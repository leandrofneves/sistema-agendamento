import React, { useState } from "react";
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.warning('Por favor, preencha todos os campos!');
      return;
    }

    console.log("Login Data:", form);

  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen h-screen">
        
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 max-w-md">
          
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Login
              </h1>

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={form.email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    required="" 
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    value={form.password}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    required="" 
                  />
                </div>

                <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-primary-800">Entrar</button>
               
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Não possui uma conta? <a href="register" className="font-medium">Cadastre-se aqui</a>
                </p>

              </form>

          </div>

        </div>
          
      </div>

    </section>
  );
};

export default Login;
