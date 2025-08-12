import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Coffee, Award, TrendingUp, Calendar, Plus, Minus, RotateCcw } from 'lucide-react-native';

export default function EspressoTracker() {
  const [todayCount, setTodayCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [totalAllTime, setTotalAllTime] = useState<number>(0);
  const [weeklyCount, setWeeklyCount] = useState<number>(0);
  const [lastUpdateDate, setLastUpdateDate] = useState<string>(new Date().toDateString());
  const [hasSpecialBadge, setHasSpecialBadge] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastUpdateDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastUpdateDate === yesterday.toDateString() && todayCount > 0) {
        setStreak((prev) => prev + 1);
      } else if (todayCount === 0) {
        setStreak(0);
      }
      setTodayCount(0);
      setLastUpdateDate(today);
    }
  }, []);

  useEffect(() => {
    if (streak >= 365) setHasSpecialBadge(true);
  }, [streak]);

  const incrementCount = () => {
    const newCount = todayCount + 1;
    setTodayCount(newCount);
    setTotalAllTime((prev) => prev + 1);
    setWeeklyCount((prev) => prev + 1);
    if (todayCount === 0) {
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastUpdateDate === yesterday.toDateString()) {
        setStreak((prev) => prev + 1);
      } else if (lastUpdateDate !== today) {
        setStreak(1);
      }
      setLastUpdateDate(today);
    }
  };

  const decrementCount = () => {
    if (todayCount > 0) {
      setTodayCount((prev) => prev - 1);
      setTotalAllTime((prev) => Math.max(0, prev - 1));
      setWeeklyCount((prev) => Math.max(0, prev - 1));
      if (todayCount === 1) {
        const today = new Date().toDateString();
        if (lastUpdateDate === today) setStreak(0);
      }
    }
  };

  const resetWeekly = () => setWeeklyCount(0);

  const streakColor =
    streak >= 365 ? '#7e22ce' : streak >= 100 ? '#ca8a04' : streak >= 30 ? '#ea580c' : streak >= 7 ? '#16a34a' : '#4b5563';

  return (
    <ScrollView className="flex-1 bg-amber-50" contentContainerStyle={{ padding: 16 }}>
      <View className="max-w-md self-center w-full">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="flex-row items-center mb-2">
            <Coffee size={32} color="#92400e" />
            <Text className="text-3xl font-bold text-amber-800 ml-2">Espresso Tracker</Text>
          </View>
          <Text className="text-amber-600">Track your daily coffee ritual</Text>
        </View>

        {/* Special Badge */}
        {hasSpecialBadge && (
          <View className="items-center mb-6">
            <View className="flex-row items-center bg-purple-600 px-4 py-2 rounded-full">
              <Award size={20} color="#fff" />
              <Text className="text-white font-bold ml-2">Master Barista</Text>
            </View>
          </View>
        )}

        {/* Today's Count */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 }}>
          <View className="items-center">
            <Text className="text-lg font-semibold text-gray-700 mb-4">Today's Espresso</Text>
            <View className="flex-row items-center justify-center space-x-4 mb-4">
              <TouchableOpacity onPress={decrementCount} disabled={todayCount === 0} className="bg-red-500 rounded-full p-3 opacity-100">
                <Minus size={24} color="#fff" />
              </TouchableOpacity>

              <View className="items-center mx-4">
                <Text className="text-6xl font-bold text-amber-700 mb-2">{todayCount}</Text>
                <View className="flex-row justify-center">
                  {Array.from({ length: Math.min(todayCount, 5) }, (_, i) => (
                    <Coffee key={i} size={24} color="#d97706" />
                  ))}
                  {todayCount > 5 && (
                    <Text className="text-amber-600 ml-2">+{todayCount - 5}</Text>
                  )}
                </View>
              </View>

              <TouchableOpacity onPress={incrementCount} className="bg-green-500 rounded-full p-3">
                <Plus size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-4 mb-6">
          {/* Streak */}
          <View className="flex-1 bg-white rounded-xl p-4 shadow" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
            <View className="flex-row items-center mb-2">
              <TrendingUp size={20} color={streakColor} />
              <Text className="font-semibold text-gray-700 ml-2">Streak</Text>
            </View>
            <Text style={{ color: streakColor }} className="text-2xl font-bold">
              {streak}
            </Text>
            <Text className="text-sm text-gray-500">days</Text>
          </View>

          {/* Weekly Count */}
          <View className="flex-1 bg-white rounded-xl p-4 shadow" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Calendar size={20} color="#2563eb" />
                <Text className="font-semibold text-gray-700 ml-2">This Week</Text>
              </View>
              <TouchableOpacity onPress={resetWeekly} accessibilityLabel="Reset weekly count">
                <RotateCcw size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold text-blue-600">{weeklyCount}</Text>
            <Text className="text-sm text-gray-500">cups</Text>
          </View>
        </View>

        {/* Total All Time */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
          <View className="flex-row items-center mb-2">
            <Award size={20} color="#9333ea" />
            <Text className="font-semibold text-gray-700 ml-2">All Time Total</Text>
          </View>
          <Text className="text-3xl font-bold text-purple-600">{totalAllTime}</Text>
          <Text className="text-sm text-gray-500">espressos consumed</Text>
        </View>

        {/* Progress to Special Badge */}
        {!hasSpecialBadge && (
          <View className="bg-white rounded-xl p-4">
            <Text className="font-semibold text-gray-700 mb-3">Master Barista Progress</Text>
            <View className="w-full h-3 bg-gray-200 rounded-full mb-2">
              <View
                className="h-3 bg-purple-600 rounded-full"
                style={{ width: `${Math.min((streak / 365) * 100, 100)}%` }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">{streak} days</Text>
              <Text className="text-sm text-gray-600">{365 - streak} days to go</Text>
            </View>
          </View>
        )}

        {/* Special Achievement Message */}
        {hasSpecialBadge && (
          <View className="bg-purple-600 rounded-xl p-4 items-center">
            <Award size={32} color="#fff" />
            <Text className="text-white font-bold text-lg mt-2">Congratulations!</Text>
            <Text className="text-white/90 text-sm text-center">
              You've achieved a 365-day espresso streak! You're a true Master Barista! ☕
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
