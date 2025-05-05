
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

const ProgressIndicator = ({ currentStep, totalSteps, stepNames }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium text-gray-900">
        Etapa {currentStep} de {totalSteps}: {stepNames[currentStep - 1]}
      </h3>
      <div className="flex space-x-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`h-2 w-2 rounded-full ${
              index + 1 <= currentStep ? "bg-linkeblue-600" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
