

import React, { useState, useEffect, useRef } from 'react';
import { DeedDefinition } from '../types';
import { Check, X, Star, Edit2, Trash2, Settings2 } from 'lucide-react';
import { toPersianDigits } from '../constants';

interface DeedInputProps {
  deed: DeedDefinition;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  customTitle?: string;
  onCustomTitleChange?: (title: string) => void;
  onDelete?: () => void;
  onQuickEdit?: () => void;
  onRemoveFromRoutine?: () => void;
  isEditing?: boolean;
}

const CustomSlider = ({ 
  value, 
  onChange, 
  disabled, 
  isQada = false 
}: { 
  value: number; 
  onChange: (val: number) => void; 
  disabled?: boolean; 
  isQada?: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handlePreset = (presetVal: number) => {
    if (disabled || isQada) return;
    onChange(presetVal);
  };

  return (
    <div className="w-full space-y-1">
      <div className="w-full h-9 relative flex items-center group">
        {/* Track Container */}
        <div className="w-full h-4 bg-gray-100 dark:bg-gray-700/80 rounded-full shadow-inner border border-gray-200/60 dark:border-gray-600/50 overflow-hidden relative transition-all">
          
          {/* Tick Notch Markers at 25%, 50%, 75% */}
          <div className="absolute inset-0 flex justify-between px-[25%] pointer-events-none opacity-30">
            <div className="w-0.5 h-full bg-gray-400 dark:bg-gray-500" />
            <div className="w-0.5 h-full bg-gray-400 dark:bg-gray-500" />
          </div>

          {/* Fill */}
          <div 
            className={`absolute top-0 right-0 bottom-0 transition-all duration-200 ease-out rounded-full ${
              isQada 
                ? 'bg-red-100 w-full opacity-0' 
                : value === 100
                  ? 'bg-gradient-to-l from-emerald-400 via-green-500 to-teal-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                  : value >= 50
                    ? 'bg-gradient-to-l from-emerald-300 via-green-500 to-emerald-600'
                    : 'bg-gradient-to-l from-yellow-300 via-emerald-400 to-green-500'
            }`}
            style={{ width: isQada ? '0%' : `${value}%` }}
          />
        </div>

        {/* Thumb - Custom Visual */}
        {!isQada && (
          <div 
            className={`absolute w-7 h-7 bg-white dark:bg-gray-800 rounded-full shadow-md border-2 pointer-events-none z-10 flex items-center justify-center transition-all duration-150 transform ${
              isDragging ? 'scale-125 shadow-lg ring-4 ring-green-500/20' : 'group-hover:scale-110'
            } ${
              value === 100 
                ? 'border-emerald-500 text-emerald-500' 
                : value >= 50 
                  ? 'border-green-500 text-green-500' 
                  : value > 0 
                    ? 'border-yellow-500 text-yellow-500' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-400'
            }`}
            style={{ 
              right: `calc(${value}% - 14px)`
            }}
          >
            {value === 100 ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
                value >= 50 ? 'bg-green-500' : value > 0 ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
              }`} />
            )}

            {/* Floating percentage Badge on active/hover */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {toPersianDigits(value)}٪
            </div>
          </div>
        )}

        {/* Native Input - Invisible Overlay */}
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={isQada ? 0 : value}
          disabled={disabled || isQada}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`absolute inset-0 w-full h-full opacity-0 z-20 ${disabled || isQada ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        />
      </div>

      {/* Tappable Quick Presets (0%, 25%, 50%, 75%, 100%) */}
      {!isQada && !disabled && (
        <div className="flex justify-between items-center px-0.5 pt-0.5">
          {[0, 25, 50, 75, 100].map((preset) => (
            <button
              type="button"
              key={preset}
              onClick={() => handlePreset(preset)}
              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                value === preset
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-black scale-105'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {toPersianDigits(preset)}٪
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const DeedInput: React.FC<DeedInputProps> = ({ 
  deed, 
  value, 
  onChange, 
  disabled,
  customTitle,
  onCustomTitleChange,
  onDelete,
  onQuickEdit,
  onRemoveFromRoutine,
  isEditing
}) => {
  // Handle Golden Deeds
  if (deed.type === 'golden') {
    const isDone = value === 100;
    // Determine bonus points
    const isDoubleBonus = deed.id === 'golden_night_prayer' || deed.id === 'golden_father_hand' || deed.id === 'golden_mother_hand';
    const bonusPoints = isDoubleBonus ? 20 : 10;

    return (
        <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between transition-colors duration-300 group ${
            isDone 
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600' 
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-yellow-200'
        } ${disabled ? 'opacity-80' : ''}`}>
            
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className={`p-2 rounded-full flex-shrink-0 ${isDone ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                    {isDoubleBonus ? (
                        <div className="flex items-center gap-0.5">
                            <Star className={`w-4 h-4 ${isDone ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                            <Star className={`w-4 h-4 ${isDone ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                        </div>
                    ) : (
                        <Star className={`w-5 h-5 ${isDone ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    )}
                </div>
                
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-medium truncate ${isDone ? 'text-yellow-800 dark:text-yellow-100' : 'text-gray-700 dark:text-gray-200'}`}>
                            {customTitle || deed.title}
                        </span>
                        <span className="text-[11px] font-normal text-gray-400 dark:text-gray-500 shrink-0">
                            (ضریب: {toPersianDigits(deed.weight ?? 1)})
                        </span>
                        {deed.isCustom && !disabled && onDelete && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                className="text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors p-1.5 z-20 relative flex-shrink-0"
                                title="حذف این مورد"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 mt-0.5">
                        {toPersianDigits(bonusPoints)}+ امتیاز
                    </span>
                </div>
            </div>

            {/* Quick Actions inside Box */}
            {!disabled && (onQuickEdit || onRemoveFromRoutine) && (
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ml-1.5 mr-1.5">
                {onQuickEdit && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onQuickEdit(); }}
                    className={`p-1.5 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all ${
                      isEditing ? 'text-primary-500 bg-primary-50 dark:bg-primary-950/30' : ''
                    }`}
                    title="تنظیمات سریع"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                )}
                {onRemoveFromRoutine && !deed.isMandatory && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveFromRoutine(); }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                    title="حذف از برنامه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <button
                onClick={() => !disabled && onChange(isDone ? 0 : 100)}
                disabled={disabled}
                className={`w-14 h-8 rounded-full flex-shrink-0 flex items-center transition-colors duration-300 p-1 justify-end ${
                    isDone ? (disabled ? 'bg-yellow-300 dark:bg-yellow-800' : 'bg-yellow-500') : 'bg-gray-200 dark:bg-gray-600'
                } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDone ? 'translate-x-6' : 'translate-x-0'}`}>
                    {isDone ? <Check className={`w-4 h-4 ${disabled ? 'text-yellow-300' : 'text-yellow-500'}`} /> : <X className="w-4 h-4 text-gray-400" />}
                </div>
            </button>
        </div>
    );
  }

  if (deed.type === 'binary') {
    const isDone = value === 100;
    return (
      <div className={`bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between transition-colors ${disabled ? 'opacity-80' : 'hover:border-primary-200 dark:hover:border-primary-800'} group`}>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{deed.title}</span>
            <span className="text-[11px] font-normal text-gray-400 dark:text-gray-500 shrink-0">
                (ضریب: {toPersianDigits(deed.weight ?? 1)})
            </span>
            {deed.isCustom && !disabled && onDelete && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors p-1.5 z-20 relative flex-shrink-0"
                    title="حذف این مورد"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </div>

        {/* Quick Actions inside Box */}
        {!disabled && (onQuickEdit || onRemoveFromRoutine) && (
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ml-1.5 mr-1.5">
            {onQuickEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onQuickEdit(); }}
                className={`p-1.5 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all ${
                  isEditing ? 'text-primary-500 bg-primary-50 dark:bg-primary-950/30' : ''
                }`}
                title="تنظیمات سریع"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            )}
            {onRemoveFromRoutine && !deed.isMandatory && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveFromRoutine(); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                title="حذف از برنامه"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => !disabled && onChange(isDone ? 0 : 100)}
          disabled={disabled}
          className={`w-14 h-8 rounded-full flex-shrink-0 flex items-center transition-colors duration-300 p-1 justify-end ${
            isDone ? (disabled ? 'bg-primary-300 dark:bg-primary-800' : 'bg-primary-500') : 'bg-gray-200 dark:bg-gray-600'
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDone ? 'translate-x-6' : 'translate-x-0'}`}>
             {isDone ? <Check className={`w-4 h-4 ${disabled ? 'text-primary-300' : 'text-primary-500'}`} /> : <X className="w-4 h-4 text-gray-400" />}
          </div>
        </button>
      </div>
    );
  }

  if (deed.type === 'prayer') {
    const isQada = value === -100;
    const displayValue = isQada ? 0 : value;

    return (
      <div className={`p-4 rounded-2xl border shadow-sm flex flex-col gap-6 transition-colors ${
        isQada 
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'
      } ${disabled ? 'opacity-80' : ''} group`}>
        
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className={`font-medium truncate ${isQada ? 'text-red-800 dark:text-red-200' : 'text-gray-700 dark:text-gray-200'}`}>
                {deed.title}
                </span>
                <span className="text-[11px] font-normal text-gray-400 dark:text-gray-500 shrink-0">
                    (ضریب: {toPersianDigits(deed.weight ?? 1)})
                </span>
                {deed.isCustom && !disabled && onDelete && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors p-1.5 z-20 relative flex-shrink-0"
                        title="حذف این مورد"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Quick Actions inside Box */}
            {!disabled && (onQuickEdit || onRemoveFromRoutine) && (
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ml-1.5 mr-1.5">
                {onQuickEdit && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onQuickEdit(); }}
                    className={`p-1.5 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all ${
                      isEditing ? 'text-primary-500 bg-primary-50 dark:bg-primary-950/30' : ''
                    }`}
                    title="تنظیمات سریع"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                )}
                {onRemoveFromRoutine && !deed.isMandatory && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveFromRoutine(); }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                    title="حذف از برنامه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${isQada ? 'text-red-700 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    قضا شد
                </span>
                <button
                    onClick={() => {
                        if (disabled) return;
                        onChange(isQada ? 0 : -100);
                    }}
                    disabled={disabled}
                    className={`w-14 h-8 rounded-full flex-shrink-0 flex items-center transition-colors duration-300 p-1 justify-end ${
                        isQada ? (disabled ? 'bg-red-300 dark:bg-red-800' : 'bg-red-500') : 'bg-gray-200 dark:bg-gray-600'
                    } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${isQada ? 'translate-x-6' : 'translate-x-0'}`}>
                        {isQada ? <Check className={`w-4 h-4 ${disabled ? 'text-red-300' : 'text-red-500'}`} /> : <X className="w-4 h-4 text-gray-400" />}
                    </div>
                </button>
            </div>
        </div>

        <div className="w-full">
            <CustomSlider 
                value={displayValue} 
                onChange={onChange} 
                disabled={disabled} 
                isQada={isQada}
            />
            
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-1 mt-2">
                <span>ضعیف</span>
                <span>متوسط</span>
                <span>عالی</span>
            </div>
        </div>
      </div>
    );
  }

  // Standard Scalar (Non-Prayer)
  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3 transition-colors ${disabled ? 'opacity-80' : 'hover:border-primary-200 dark:hover:border-primary-800'} group`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-gray-700 dark:text-gray-200 font-medium truncate">{deed.title}</span>
            <span className="text-[11px] font-normal text-gray-400 dark:text-gray-500 shrink-0">
                (ضریب: {toPersianDigits(deed.weight ?? 1)})
            </span>
            {deed.isCustom && !disabled && onDelete && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors p-1.5 z-20 relative flex-shrink-0"
                    title="حذف این مورد"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </div>

        {/* Quick Actions inside Box */}
        {!disabled && (onQuickEdit || onRemoveFromRoutine) && (
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ml-1.5 mr-1.5">
            {onQuickEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onQuickEdit(); }}
                className={`p-1.5 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all ${
                  isEditing ? 'text-primary-500 bg-primary-50 dark:bg-primary-950/30' : ''
                }`}
                title="تنظیمات سریع"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            )}
            {onRemoveFromRoutine && !deed.isMandatory && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveFromRoutine(); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                title="حذف از برنامه"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      <CustomSlider 
        value={value} 
        onChange={onChange} 
        disabled={disabled} 
      />

      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-1">
        <span>ضعیف</span>
        <span>متوسط</span>
        <span>عالی</span>
      </div>
    </div>
  );
};