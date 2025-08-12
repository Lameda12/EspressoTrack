import React, { useState, useEffect } from 'react';
import { Coffee, Award, TrendingUp, Calendar, Plus, Minus, RotateCcw } from 'lucide-react';

const EspressoTracker = () => {
  const [todayCount, setTodayCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalAllTime, setTotalAllTime] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date().toDateString());
  const [hasSpecialBadge, setHasSpecialBadge] = useState(false);

  // Load data from memory on component mount
  useEffect(() => {
    const today = new Date().toDateString();
    
    // Check if it's a new day
    if (lastUpdateDate !== today) {
      // New day - check if streak continues or breaks
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastUpdateDate === yesterday.toDateString() && todayCount > 0) {
        // Streak continues
        setStreak(prev => prev + 1);
      } else if (todayCount === 0) {
        // Streak breaks
        setStreak(0);
      }
      
      // Reset daily count for new day
      setTodayCount(0);
      setLastUpdateDate(today);
    }
  }, []);

  // Check for special badge (365-day streak)
  useEffect(() => {
    if (streak >= 365) {
      setHasSpecialBadge(true);
    }
  }, [streak]);

  const incrementCount = () => {
    const newCount = todayCount + 1;
    setTodayCount(newCount);
    setTotalAllTime(prev => prev + 1);
    setWeeklyCount(prev => prev + 1);
    
    // If this is the first espresso today, potentially start/continue streak
    if (todayCount === 0) {
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastUpdateDate === yesterday.toDateString()) {
        setStreak(prev => prev + 1);
      } else if (lastUpdateDate !== today) {
        setStreak(1); // Start new streak
      }
      
      setLastUpdateDate(today);
    }
  };

  const decrementCount = () => {
    if (todayCount > 0) {
      setTodayCount(prev => prev - 1);
      setTotalAllTime(prev => Math.max(0, prev - 1));
      setWeeklyCount(prev => Math.max(0, prev - 1));
      
      // If count goes to 0 and it's today, potentially break streak
      if (todayCount === 1) {
        const today = new Date().toDateString();
        if (lastUpdateDate === today) {
          setStreak(0);
        }
      }
    }
  };

  const resetWeekly = () => {
    setWeeklyCount(0);
  };

  const getStreakColor = () => {
    if (streak >= 365) return 'text-purple-600';
    if (streak >= 100) return 'text-yellow-600';
    if (streak >= 30) return 'text-orange-600';
    if (streak >= 7) return 'text-green-600';
    return 'text-gray-600';
  };

  const getStreakBadge = () => {
    if (hasSpecialBadge) {
      return (
        <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full">
          <Award className="w-5 h-5" />
          <span className="font-bold">Master Barista</span>
        </div>
      );
    }
    if (streak >= 100) {
      return (
        <div className="flex items-center space-x-2 bg-yellow-500 text-white px-3 py-1 rounded-full">
          <Award className="w-4 h-4" />
          <span>Century Club</span>
        </div>
      );
    }
    if (streak >= 30) {
      return (
        <div className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-full">
          <Award className="w-4 h-4" />
          <span>Monthly Master</span>
        </div>
      );
    }
    if (streak >= 7) {
      return (
        <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full">
          <Award className="w-4 h-4" />
          <span>Weekly Warrior</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Coffee className="w-8 h-8 text-amber-700" />
            <h1 className="text-3xl font-bold text-amber-800">Espresso Tracker</h1>
          </div>
          <p className="text-amber-600">Track your daily coffee ritual</p>
        </div>

        {/* Special Badge */}
        {getStreakBadge() && (
          <div className="flex justify-center mb-6">
            {getStreakBadge()}
          </div>
        )}

        {/* Today's Count */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Today's Espresso</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={decrementCount}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors"
                disabled={todayCount === 0}
              >
                <Minus className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <div className="text-6xl font-bold text-amber-700 mb-2">
                  {todayCount}
                </div>
                <div className="flex justify-center">
                  {Array.from({ length: Math.min(todayCount, 5) }, (_, i) => (
                    <Coffee key={i} className="w-6 h-6 text-amber-600 mx-1" />
                  ))}
                  {todayCount > 5 && <span className="text-amber-600 mx-1">+{todayCount - 5}</span>}
                </div>
              </div>
              
              <button
                onClick={incrementCount}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Streak */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className={`w-5 h-5 ${getStreakColor()}`} />
              <h3 className="font-semibold text-gray-700">Streak</h3>
            </div>
            <div className={`text-2xl font-bold ${getStreakColor()}`}>
              {streak}
            </div>
            <div className="text-sm text-gray-500">days</div>
          </div>

          {/* Weekly Count */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-700">This Week</h3>
              </div>
              <button
                onClick={resetWeekly}
                className="text-gray-400 hover:text-gray-600"
                title="Reset weekly count"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {weeklyCount}
            </div>
            <div className="text-sm text-gray-500">cups</div>
          </div>
        </div>

        {/* Total All Time */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-700">All Time Total</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {totalAllTime}
          </div>
          <div className="text-sm text-gray-500">espressos consumed</div>
        </div>

        {/* Progress to Special Badge */}
        {!hasSpecialBadge && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Master Barista Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((streak / 365) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{streak} days</span>
              <span>{365 - streak} days to go</span>
            </div>
          </div>
        )}

        {/* Special Achievement Message */}
        {hasSpecialBadge && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-bold text-lg">Congratulations!</h3>
            <p className="text-sm opacity-90">
              You've achieved a 365-day espresso streak! You're a true Master Barista! ☕
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EspressoTracker;