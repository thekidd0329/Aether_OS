import React, { useState } from 'react';
import { MonetPalette } from '../../types';
import { Delete, History, RotateCcw } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface CalculatorAppProps {
  palette: MonetPalette;
  onClose: () => void;
}

export const CalculatorApp: React.FC<CalculatorAppProps> = ({ palette, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleDigit = (digit: string) => {
    audioEngine.playClick(600 + parseInt(digit || '0') * 30, 'sine', 0.03);
    if (display === '0' && digit !== '.') {
      setDisplay(digit);
    } else if (display === '0' && digit === '.') {
      setDisplay('0.');
    } else if (digit === '.' && display.includes('.')) {
      return;
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOp = (op: string) => {
    audioEngine.playClick(850, 'triangle', 0.04);
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleEqual = () => {
    audioEngine.playClick(1000, 'triangle', 0.06);
    if (!equation) return;
    try {
      const fullEq = equation + display;
      // safe simple evaluation
      const sanitized = fullEq.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      const resStr = Number.isInteger(result) ? result.toString() : Number(result.toFixed(4)).toString();
      setHistory([`${fullEq} = ${resStr}`, ...history.slice(0, 9)]);
      setEquation('');
      setDisplay(resStr);
    } catch {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    audioEngine.playClick(450, 'sine', 0.04);
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    audioEngine.playClick(500, 'sine', 0.03);
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const buttons = [
    { label: 'C', action: handleClear, type: 'special' },
    { label: '⌫', action: handleBackspace, type: 'special' },
    { label: '%', action: () => setDisplay((parseFloat(display) / 100).toString()), type: 'special' },
    { label: '÷', action: () => handleOp('÷'), type: 'op' },

    { label: '7', action: () => handleDigit('7'), type: 'num' },
    { label: '8', action: () => handleDigit('8'), type: 'num' },
    { label: '9', action: () => handleDigit('9'), type: 'num' },
    { label: '×', action: () => handleOp('×'), type: 'op' },

    { label: '4', action: () => handleDigit('4'), type: 'num' },
    { label: '5', action: () => handleDigit('5'), type: 'num' },
    { label: '6', action: () => handleDigit('6'), type: 'num' },
    { label: '-', action: () => handleOp('-'), type: 'op' },

    { label: '1', action: () => handleDigit('1'), type: 'num' },
    { label: '2', action: () => handleDigit('2'), type: 'num' },
    { label: '3', action: () => handleDigit('3'), type: 'num' },
    { label: '+', action: () => handleOp('+'), type: 'op' },

    { label: '±', action: () => setDisplay((parseFloat(display) * -1).toString()), type: 'num' },
    { label: '0', action: () => handleDigit('0'), type: 'num' },
    { label: '.', action: () => handleDigit('.'), type: 'num' },
    { label: '=', action: handleEqual, type: 'equal' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <span className="text-xs font-bold text-neutral-300">Calculator</span>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <History size={16} />
        </button>
      </div>

      {/* Screen Display */}
      <div className="p-5 flex flex-col justify-end text-right min-h-[140px] bg-neutral-900/40">
        <span className="text-xs text-neutral-500 font-mono tracking-wider h-5">
          {equation}
        </span>
        <span className="text-4xl font-extrabold tracking-tight font-mono text-white truncate">
          {display}
        </span>
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="bg-neutral-900 p-3 border-b border-neutral-800 max-h-32 overflow-y-auto space-y-1">
          <div className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Calculation Tape</div>
          {history.length === 0 ? (
            <div className="text-xs text-neutral-500 italic">No history yet</div>
          ) : (
            history.map((h, i) => (
              <div key={i} className="text-xs font-mono text-neutral-300">
                {h}
              </div>
            ))
          )}
        </div>
      )}

      {/* Keypad */}
      <div className="flex-1 grid grid-cols-4 gap-2.5 p-4 bg-neutral-950">
        {buttons.map((btn, idx) => {
          const isNum = btn.type === 'num';
          const isOp = btn.type === 'op';
          const isEqual = btn.type === 'equal';

          return (
            <button
              key={idx}
              onClick={btn.action}
              className={`rounded-2xl flex items-center justify-center font-bold text-lg transition-transform active:scale-90 shadow-sm ${
                isEqual
                  ? 'text-white'
                  : isOp
                  ? 'bg-neutral-800 text-amber-400 hover:bg-neutral-700'
                  : isNum
                  ? 'bg-neutral-900/90 text-white hover:bg-neutral-800'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
              style={isEqual ? { backgroundColor: palette.primary } : {}}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
