import { FaUser, FaUtensils, FaFileInvoice } from "react-icons/fa";

const StepProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, title: "Thông tin", icon: FaUser },
    { id: 2, title: "Chọn món", icon: FaUtensils },
    { id: 3, title: "Xác nhận", icon: FaFileInvoice },
  ];

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex justify-between items-center relative">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 w-full -z-10" />
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-yellow-500 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${
              currentStep >= step.id ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
                ${
                  currentStep >= step.id
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200"
                }
                transition-all duration-500 transform
                ${currentStep === step.id ? "scale-110" : ""}
              `}
            >
              <step.icon className={`text-xl ${
                currentStep >= step.id ? "animate-bounce" : ""
              }`} />
            </div>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress; 