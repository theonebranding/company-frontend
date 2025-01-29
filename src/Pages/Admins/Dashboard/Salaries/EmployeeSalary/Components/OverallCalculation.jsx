import React from "react";
import {
  DollarSign,
  AlertCircle,
  Trophy,
  Clock,
  UserMinus,
  CalendarX,
  ArrowRight,
  Info,
} from "lucide-react";

const OverallCalculation = ({ baseSalary, bonuses, deductions }) => {
  const {
    totalLateCheckinDeduction,
    totalHalfDayDeduction,
    totalAbsentDayDeduction,
  } = deductions;

  const formatCurrency = (amount) => {
    const value = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(value);
  };

  const totalDeductions = 
    (Number(totalLateCheckinDeduction) || 0) + 
    (Number(totalHalfDayDeduction) || 0) + 
    (Number(totalAbsentDayDeduction) || 0);
    
  const finalSalary = 
    (Number(baseSalary) || 0) + 
    (Number(bonuses) || 0) - 
    totalDeductions;

  const SalaryCard = ({ title, subtitle, amount, icon: Icon, colorClass, prefix = "₹" }) => (
    <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg bg-gray-800/80 ${colorClass} ring-1 ring-gray-700/50`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-100 font-medium tracking-wide">{title}</p>
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          </div>
        </div>
        <span className={`text-xl font-semibold ${colorClass}`}>
          {prefix}{formatCurrency(amount)}
        </span>
      </div>
    </div>
  );

  const DeductionItem = ({ icon: Icon, label, amount }) => (
    <div className="flex justify-between items-center px-4 py-3 rounded-lg hover:bg-gray-800/40 transition-all">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-red-400/90" />
        <span className="text-gray-300">{label}</span>
      </div>
      <span className="text-red-400/90 font-medium">-₹{formatCurrency(amount)}</span>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 p-3 rounded-xl">
            <DollarSign className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Salary Overview</h2>
            <p className="text-gray-400 text-sm mt-1">Monthly Breakdown</p>
          </div>
        </div>
        <div className="bg-gray-800/40 px-4 py-2 rounded-lg flex items-center gap-2 text-gray-400 text-sm border border-gray-700/50">
          <Info className="w-4 h-4" />
          <span>Current Month</span>
        </div>
      </div>

      <div className="space-y-6">
        <SalaryCard 
          title="Base Salary"
          subtitle="Monthly base compensation"
          amount={baseSalary}
          icon={DollarSign}
          colorClass="text-indigo-400"
        />

        <SalaryCard 
          title="Bonuses"
          subtitle="Performance rewards"
          amount={bonuses}
          icon={Trophy}
          colorClass="text-green-400"
          prefix="+₹"
        />

        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-gray-200 font-medium">Deductions</h3>
            </div>
            <span className="text-red-400 font-medium text-lg">-₹{formatCurrency(totalDeductions)}</span>
          </div>

          <div className="space-y-1">
            <DeductionItem 
              icon={Clock}
              label="Late Check-ins"
              amount={totalLateCheckinDeduction}
            />
            <DeductionItem 
              icon={UserMinus}
              label="Half-Days"
              amount={totalHalfDayDeduction}
            />
            <DeductionItem 
              icon={CalendarX}
              label="Absences"
              amount={totalAbsentDayDeduction}
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-700"></div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-100 text-sm font-medium">Final Salary</p>
                <p className="text-white text-3xl font-bold tracking-tight mt-1">
                  ₹{formatCurrency(finalSalary)}
                </p>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallCalculation;