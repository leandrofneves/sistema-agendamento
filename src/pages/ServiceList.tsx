import React, { useState } from "react";
import { toast } from "react-toastify";

const ServiceList = () => {
  const services = [
    { id: 1, name: "Corte de Cabelo", duration: "1h" },
    { id: 2, name: "Manicure", duration: "2h" },
    { id: 3, name: "Massagem Relaxante", duration: "3h" },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Lista de Serviços
            </h1>
            <ul className="space-y-4">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {service.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duração: {service.duration}
                  </p>
                  <button
                    className="mt-2 text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                  >
                    Agendar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
