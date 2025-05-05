import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import ChatBot from "../components/layout/chatBot";

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  
  // Feriados fixos + exemplos para demonstração
  const fixedHolidays = [
    { date: '01-01', name: 'Ano Novo' },
    { date: '04-21', name: 'Tiradentes' },
    { date: '05-02', name: 'Dia do Trabalho' },
    { date: '09-07', name: 'Independência' },
    { date: '10-12', name: 'Nossa Senhora Aparecida' },
    { date: '11-02', name: 'Finados' },
    { date: '11-15', name: 'Proclamação da República' },
    { date: '12-25', name: 'Natal' },
    // Adicionando alguns feriados móveis para demonstração
    { date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().slice(5, 10), name: 'Feriado Local' },
    { date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString().slice(5, 10), name: 'Feriado Estadual' }
  ];

  useEffect(() => {
    const currentYear = currentDate.getFullYear();
    const yearHolidays = fixedHolidays.map(holiday => {
      // Verifica se a data já é um objeto Date (feriados móveis)
      const dateObj = typeof holiday.date === 'string' 
        ? new Date(`${currentYear}-${holiday.date}`) 
        : new Date(holiday.date);
      return {
        date: dateObj,
        name: holiday.name
      };
    });
    setHolidays(yearHolidays);
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(direction === 'prev' ? newDate.getMonth() - 1 : newDate.getMonth() + 1);
      return newDate;
    });
  };

  const isHoliday = (day) => {
    return holidays.some(holiday => 
      holiday.date.getDate() === day.getDate() &&
      holiday.date.getMonth() === day.getMonth() &&
      holiday.date.getFullYear() === day.getFullYear()
    );
  };

  const isWeekend = (day) => {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const weeks = [];
    let days = [];
    
    // Dias vazios para o início do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-1"></div>);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const isHolidayDay = isHoliday(currentDay);
      const isWeekendDay = isWeekend(currentDay);
      const isCurrentDay = isToday(currentDay);
      
      let dayClass = "h-24 p-2 border border-gray-100 flex flex-col";
      
      if (isCurrentDay) {
        dayClass += " bg-blue-50 border-blue-300 font-bold";
      } else if (isHolidayDay) {
        dayClass += " bg-orange-50 border-orange-200";
      } else if (isWeekendDay) {
        dayClass += " bg-blue-50 border-blue-100";
      } else {
        dayClass += " hover:bg-gray-50 transition-colors duration-200";
      }
      
      days.push(
        <div key={`day-${day}`} className={dayClass}>
          <div className="flex justify-between items-start">
            <span className={`text-sm ${isCurrentDay ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {isHolidayDay && (
              <FaExclamationCircle className="text-orange-400 text-xs mt-0.5" />
            )}
          </div>
          {isHolidayDay && (
            <div className="mt-1 text-xs text-orange-600 font-medium truncate">
              {holidays.find(h => 
                h.date.getDate() === day && 
                h.date.getMonth() === month
              )?.name}
            </div>
          )}
        </div>
      );
      
      if (days.length === 7 || day === daysInMonth) {
        weeks.push(
          <div key={`week-${day}`} className="grid grid-cols-7 gap-0">
            {days}
          </div>
        );
        days = [];
      }
    }
    
    return weeks;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Calendário</h1>
          <p className="text-lg text-gray-600">Acompanhe seus eventos e feriados</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          {/* Cabeçalho do calendário */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <FaChevronLeft className="text-lg" />
              </button>
              
              <div className="flex items-center">
                <FaCalendarAlt className="mr-3 text-xl" />
                <h2 className="text-2xl font-bold">
                  {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
              </div>
              
              <button 
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <FaChevronRight className="text-lg" />
              </button>
            </div>
          </div>
          
          {/* Dias da semana */}
          <div className="grid grid-cols-7 bg-blue-50 text-blue-800 font-medium text-sm">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <div 
                key={day} 
                className={`py-3 text-center ${index === 0 ? 'text-red-500' : ''}`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid do calendário */}
          <div className="divide-y divide-gray-100">
            {renderCalendar()}
          </div>
        </div>
        
        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Feriados</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Finais de semana</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Hoje</span>
          </div>
        </div>
      </div>
      
      <ChatBot />
    </div>
  );
};

export default Home;