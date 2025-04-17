const TimeSlotPicker = ({ selectedTime, onTimeSelect }) => {
  const timeSlots = [
    { time: "11:00", period: "Trưa" },
    { time: "11:30", period: "Trưa" },
    { time: "12:00", period: "Trưa" },
    { time: "12:30", period: "Trưa" },
    { time: "17:30", period: "Tối" },
    { time: "18:00", period: "Tối" },
    { time: "18:30", period: "Tối" },
    { time: "19:00", period: "Tối" },
    { time: "19:30", period: "Tối" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Chọn thời gian</h3>
      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map(({ time, period }) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`p-3 rounded-lg border transition-all duration-300 transform hover:scale-105
              ${
                selectedTime === time
                  ? "border-yellow-500 bg-yellow-50 text-yellow-600"
                  : "border-gray-200 hover:border-yellow-200"
              }
            `}
          >
            <div className="text-sm font-medium">{time}</div>
            <div className="text-xs text-gray-500">{period}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker; 