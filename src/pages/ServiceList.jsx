import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { toast } from "react-toastify";
import "react-calendar/dist/Calendar.css";

const ServiceList = () => {
  const services = [
    { id: 1, name: "Corte de Cabelo", duration: "1h" },
    { id: 2, name: "Manicure", duration: "2h" },
    { id: 3, name: "Massagem Relaxante", duration: "3h" },
  ];

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [availableTimesByService, setAvailableTimesByService] = useState({});
  const [bookedTimes, setBookedTimes] = useState([]); // Armazenar os horários já agendados

  // Simula a obtenção de horários permitidos para cada serviço
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      // Exemplo de resposta da API para horários disponíveis
      const response = {
        1: ["09:00", "13:00", "17:00"], // Corte de cabelo
        2: ["09:00", "13:00"], // Manicure
        3: ["10:00", "14:00", "18:00"], // Massagem relaxante
      };
      setAvailableTimesByService(response);
    };

    fetchAvailableTimes();
  }, []);

  // Função para buscar os agendamentos no dia selecionado
  const fetchBookedTimes = async (serviceId, date) => {
    // Exemplo de requisição API para buscar horários já agendados para o serviço e a data
    // const response = await fetch(`/api/agendamentos?serviceId=${serviceId}&date=${date}`);
    // const data = await response.json();
    
    // if (data.bookedTimes) {
    //   setBookedTimes(data.bookedTimes);
    // }

    setBookedTimes(['13:00'])
  };

  const handleDateChange = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
  
    // Ajustar a data para desconsiderar a hora (apenas ano, mês e dia)
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
  
    // Verificar se a data selecionada é no futuro
    if (selectedDate < today) {
      toast.warning("A data selecionada já passou. Por favor, selecione uma data futura.");
      return; // Não permitir seleção de data passada
    }
    
    setSelectedDate(date);
    if (selectedService) {
      const formattedDate = date.toISOString().split("T")[0]; // Formatar a data para o formato YYYY-MM-DD
      fetchBookedTimes(selectedService.id, formattedDate); // Buscar horários já agendados para a data e o serviço selecionado
    }
  };

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      toast.warning("Por favor, selecione uma data e horário!");
      return;
    }

    toast.success("Serviço agendado com sucesso!");
    setShowModal(false);
    setSelectedDate(null);
    setSelectedTime("");
  };

  const availableTimes = () => {
    if (!selectedService) return [];
    // Filtrar os horários disponíveis removendo os que já estão agendados
    return availableTimesByService[selectedService.id].filter(time => !bookedTimes.includes(time));
  };

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
                    onClick={() => {
                      setSelectedService(service);
                      setShowModal(true);
                    }}
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Selecione uma data e horário
            </h2>
            <div className="mb-4">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Horário
              </label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Selecione um horário</option>
                {availableTimes().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSchedule}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceList;
