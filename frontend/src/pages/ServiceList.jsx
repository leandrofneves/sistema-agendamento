import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { toast } from "react-toastify";
import api from "../config/api";
import "react-calendar/dist/Calendar.css";
import "../assets/calendar.css";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        toast.error("Erro ao carregar serviços!");
      }
    };

    fetchServices();
  }, []);

  const fetchAvailableTimes = async (serviceId) => {
    try {
      const response = await api.get(`/appointments/available-times/${serviceId}`);
      setAvailableTimes(response.data);
    } catch (err) {
      console.error("Erro ao buscar horários disponíveis:", err);
      toast.error("Erro ao carregar horários disponíveis!");
    }
  };

  const fetchBookedTimes = async (serviceId, date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0]; //formatando a data
      const response = await api.get(`/appointments/block-times?idservice=${serviceId}&date=${formattedDate}`);
  
      if (response.data && Array.isArray(response.data)) {
        // Mapear os horários ou processar se necessário
        const bookedTimes = response.data.map(item => item.horario);
        setBookedTimes(bookedTimes);
      } else {
        setBookedTimes([]);
      }
    } catch (err) {
      console.error("Erro ao buscar horários agendados:", err);
      toast.error("Erro ao carregar horários agendados!");
    }
  };

  const handleDateChange = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      toast.warning("Data inválida.");
      return;
    }

    setSelectedDate(date);

    if (selectedService) {
      fetchBookedTimes(selectedService.idservice, date);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.warning("Por favor, selecione uma data e horário!");
      return;
    }

    setIsLoading(true);

    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];

      const date = new Date(selectedDate);
      
      const day = String(date.getDate()).padStart(2, '0');  // Adiciona zero à esquerda
      const month = String(date.getMonth() + 1).padStart(2, '0');  // Mês começa de 0
      const year = date.getFullYear();
      
      const formattedDateString = `${day}/${month}/${year}`;

      await api.post("/appointments/user-services", {
        iduser: localStorage.getItem("idusuario"),
        idservice: selectedService.idservice,
        date: formattedDate,
        formattedDate: formattedDateString,
        idavailable_times: selectedTime
      });

      toast.success("Serviço agendado com sucesso!");
      setShowModal(false);
      setSelectedDate(null);
      setSelectedTime("");
    } catch (err) {
      console.error("Erro ao agendar serviço:", err);
      toast.error("Erro ao agendar serviço!");
    } finally {
      setIsLoading(false); // Desativa o carregamento
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const availableFilteredTimes = availableTimes.filter(
    (time) => !bookedTimes.includes(time.horario)
  );

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
                  key={service.idservice}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {service.description}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duração: {service.duration}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      fetchAvailableTimes(service.idservice);
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

          <div className="p-6 pt-0 space-y-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-600"
            >
              Sair
            </button>
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
                className="rounded-lg"
                onChange={handleDateChange}
                value={selectedDate}
                formatShortWeekday={(locale, date) =>
                  date.toLocaleDateString(locale, { weekday: "short" })
                }
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
                {availableFilteredTimes.map((time) => (
                  <option key={time.horario} value={time.idavailable_times}>
                    {time.horario}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDate(null);
                  setSelectedTime("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSchedule}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-600"
              >
                {isLoading ? "Carregando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

    
    </section>
  );
};

export default ServiceList;
