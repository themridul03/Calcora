import React, { useState, useEffect } from 'react';
import { X, Minimize2, Maximize2, Delete } from 'lucide-react';

interface AppleCalculatorWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult?: (val: number) => void;
}

export const AppleCalculatorWidget: React.FC<AppleCalculatorWidgetProps> = ({
  isOpen,
  onClose,
  onApplyResult,
}) => {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDot();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        performOperation(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        performOperation('=');
      } else if (e.key === 'Escape') {
        clearAll();
      } else if (e.key === 'Backspace') {
        backspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, display, prevValue, operator, waitingForOperand]);

  if (!isOpen) return null;

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const val = parseFloat(display);
    if (val !== 0) {
      setDisplay(String(-val));
    }
  };

  const inputPercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
      }

      setPrevValue(newValue);
      setDisplay(String(Number(newValue.toFixed(6))));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === '=' ? null : nextOperator);
  };

  const handleApply = () => {
    const num = parseFloat(display);
    if (!isNaN(num) && onApplyResult) {
      onApplyResult(num);
      onClose();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="w-[310px] bg-black/95 backdrop-blur-2xl rounded-[40px] p-4 border border-zinc-800 shadow-2xl shadow-black/80 flex flex-col select-none">
        
        {/* Apple Window Control Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-3">
          <div className="flex items-center gap-2">
            <div
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 cursor-pointer flex items-center justify-center transition"
            >
              <X className="w-2 h-2 text-black/70 opacity-0 hover:opacity-100" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[11px] font-semibold text-zinc-500 tracking-wider">
             Calculator
          </span>
          <button
            onClick={clearAll}
            className="text-[10px] font-mono text-zinc-400 hover:text-white transition"
          >
            Clear
          </button>
        </div>

        {/* Display Screen */}
        <div className="px-3 py-4 text-right mb-2">
          <div className="text-[11px] text-zinc-500 h-4 font-mono">
            {prevValue !== null ? `${prevValue} ${operator || ''}` : ''}
          </div>
          <div
            className={`font-light tracking-tight text-white font-sans truncate transition-all ${
              display.length > 9 ? 'text-3xl' : display.length > 6 ? 'text-4xl' : 'text-5xl'
            }`}
          >
            {display}
          </div>
        </div>

        {/* Apple Style Keypad */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Row 1: AC, +/-, %, ÷ */}
          <button
            onClick={clearAll}
            className="w-15 h-15 rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black font-semibold text-lg flex items-center justify-center transition active:opacity-70 shadow-sm"
          >
            {display !== '0' ? 'C' : 'AC'}
          </button>
          <button
            onClick={toggleSign}
            className="w-15 h-15 rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black font-semibold text-lg flex items-center justify-center transition active:opacity-70 shadow-sm"
          >
            ±
          </button>
          <button
            onClick={inputPercent}
            className="w-15 h-15 rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black font-semibold text-lg flex items-center justify-center transition active:opacity-70 shadow-sm"
          >
            %
          </button>
          <button
            onClick={() => performOperation('÷')}
            className={`w-15 h-15 rounded-full ${
              operator === '÷' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb340] text-white'
            } font-bold text-2xl flex items-center justify-center transition active:opacity-70 shadow-sm`}
          >
            ÷
          </button>

          {/* Row 2: 7, 8, 9, × */}
          <button
            onClick={() => inputDigit('7')}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-center transition active:opacity-70"
          >
            7
          </button>
          <button
            onClick={() => inputDigit('8')}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-center transition active:opacity-70"
          >
            8
          </button>
          <button
            onClick={() => inputDigit('9')}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-center transition active:opacity-70"
          >
            9
          </button>
          <button
            onClick={() => performOperation('×')}
            className={`w-15 h-15 rounded-full ${
              operator === '×' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb340] text-white'
            } font-bold text-2xl flex items-center justify-center transition active:opacity-70 shadow-sm`}
          >
            ×
          </button>

          {/* Row 3: 4, 5, 6, - */}
          <button
            onClick={() => inputDigit('4')}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-center transition active:opacity-70"
          >
            4
          </button>
          <button
            onClick={() => inputDigit('5')}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-center transition active:opacity-70"
          >
            5
          </button>
          <button
            onClick={() => inputDigit('6')}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-center transition active:opacity-70"
          >
            6
          </button>
          <button
            onClick={() => performOperation('-')}
            className={`w-15 h-15 rounded-full ${
              operator === '-' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb340] text-white'
            } font-bold text-2xl flex items-center justify-center transition active:opacity-70 shadow-sm`}
          >
            −
          </button>

          {/* Row 4: 1, 2, 3, + */}
          <button
            onClick={() => inputDigit('1')}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-center transition active:opacity-70"
          >
            1
          </button>
          <button
            onClick={() => inputDigit('2')}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-center transition active:opacity-70"
          >
            2
          </button>
          <button
            onClick={() => inputDigit('3')}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-center transition active:opacity-70"
          >
            3
          </button>
          <button
            onClick={() => performOperation('+')}
            className={`w-15 h-15 rounded-full ${
              operator === '+' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb340] text-white'
            } font-bold text-2xl flex items-center justify-center transition active:opacity-70 shadow-sm`}
          >
            +
          </button>

          {/* Row 5: 0 (span 2), ., = */}
          <button
            onClick={() => inputDigit('0')}
            className="col-span-2 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-normal text-xl flex items-center justify-start pl-6 transition active:opacity-70"
          >
            0
          </button>
          <button
            onClick={inputDot}
            className="w-15 h-15 rounded-full bg-[#333333] hover:bg-[#474749] text-white font-bold text-xl flex items-center justify-center transition active:opacity-70"
          >
            .
          </button>
          <button
            onClick={() => performOperation('=')}
            className="w-15 h-15 rounded-full bg-[#ff9f0a] hover:bg-[#ffb340] text-white font-bold text-2xl flex items-center justify-center transition active:opacity-70 shadow-sm"
          >
            =
          </button>
        </div>

        {/* Optional Action to send value */}
        {onApplyResult && (
          <div className="pt-3 mt-2 border-t border-zinc-800 text-center">
            <button
              onClick={handleApply}
              className="w-full py-1.5 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
            >
              Use {display} in active input
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
