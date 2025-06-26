import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Trophy,
  Star,
  Zap,
  Target,
  BookOpen,
  Brain,
  Sparkles,
  Award,
  Flame,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  requirement: number;
  current: number;
  unlocked: boolean;
  category: "questions" | "streak" | "subjects" | "special";
}

export interface UserStats {
  totalQuestions: number;
  currentStreak: number;
  longestStreak: number;
  subjectsExplored: number;
  perfectDays: number;
  level: number;
  xp: number;
}

interface AchievementSystemProps {
  stats: UserStats;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  stats,
  onAchievementUnlocked,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_question",
      name: "Getting Started",
      description: "Ask your first question",
      icon: Star,
      color: "kids-yellow",
      requirement: 1,
      current: stats.totalQuestions,
      unlocked: stats.totalQuestions >= 1,
      category: "questions",
    },
    {
      id: "question_master",
      name: "Question Master",
      description: "Ask 10 questions",
      icon: Brain,
      color: "kids-purple",
      requirement: 10,
      current: stats.totalQuestions,
      unlocked: stats.totalQuestions >= 10,
      category: "questions",
    },
    {
      id: "streak_starter",
      name: "Streak Starter",
      description: "Learn for 3 days in a row",
      icon: Flame,
      color: "kids-orange",
      requirement: 3,
      current: stats.currentStreak,
      unlocked: stats.longestStreak >= 3,
      category: "streak",
    },
    {
      id: "week_warrior",
      name: "Week Warrior",
      description: "Learn for 7 days in a row",
      icon: Trophy,
      color: "kids-green",
      requirement: 7,
      current: stats.currentStreak,
      unlocked: stats.longestStreak >= 7,
      category: "streak",
    },
    {
      id: "subject_explorer",
      name: "Subject Explorer",
      description: "Try all 5 subjects",
      icon: BookOpen,
      color: "kids-blue",
      requirement: 5,
      current: stats.subjectsExplored,
      unlocked: stats.subjectsExplored >= 5,
      category: "subjects",
    },
    {
      id: "perfect_student",
      name: "Perfect Student",
      description: "Complete 5 perfect learning days",
      icon: Award,
      color: "kids-pink",
      requirement: 5,
      current: stats.perfectDays,
      unlocked: stats.perfectDays >= 5,
      category: "special",
    },
  ]);

  useEffect(() => {
    // Check for newly unlocked achievements
    achievements.forEach((achievement) => {
      const wasUnlocked = achievement.unlocked;
      const shouldBeUnlocked = achievement.current >= achievement.requirement;

      if (!wasUnlocked && shouldBeUnlocked) {
        const updatedAchievement = { ...achievement, unlocked: true };
        setAchievements((prev) =>
          prev.map((a) => (a.id === achievement.id ? updatedAchievement : a)),
        );
        onAchievementUnlocked?.(updatedAchievement);
      }
    });
  }, [stats]);

  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min((achievement.current / achievement.requirement) * 100, 100);
  };

  const getLevelProgress = () => {
    const xpForNextLevel = (stats.level + 1) * 100;
    const xpForCurrentLevel = stats.level * 100;
    const currentLevelXp = stats.xp - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    return (currentLevelXp / xpNeeded) * 100;
  };

  return (
    <div className="space-y-4">
      {/* Level and XP Display */}
      <Card className="bg-gradient-to-r from-kids-purple to-kids-blue text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-lg">Level {stats.level}</span>
            </div>
            <span className="text-sm opacity-90">{stats.xp} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Streak Display */}
      <Card className="bg-gradient-to-r from-kids-orange to-kids-yellow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Flame className="w-6 h-6" />
              <div>
                <div className="font-bold text-lg">
                  {stats.currentStreak} Day Streak
                </div>
                <div className="text-sm opacity-90">
                  Longest: {stats.longestStreak} days
                </div>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const progress = getProgressPercentage(achievement);

          return (
            <Card
              key={achievement.id}
              className={`relative overflow-hidden transition-all duration-300 ${
                achievement.unlocked
                  ? "border-2 border-kids-yellow shadow-lg"
                  : "opacity-75 border-gray-200"
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div
                    className={`p-2 rounded-lg bg-${achievement.color} ${
                      achievement.unlocked ? "animate-pulse" : ""
                    }`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-gray-600 leading-tight">
                      {achievement.description}
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>
                          {achievement.current}/{achievement.requirement}
                        </span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className={`bg-${achievement.color} h-1 rounded-full transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle className="w-4 h-4 text-kids-green" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export const AchievementNotification: React.FC<{
  achievement: Achievement | null;
  onClose: () => void;
}> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const Icon = achievement.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <Card className="border-2 border-kids-yellow bg-white shadow-2xl max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full bg-${achievement.color} animate-bounce`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-kids-purple">
                Achievement Unlocked!
              </div>
              <div className="text-lg font-black">{achievement.name}</div>
              <div className="text-sm text-gray-600">
                {achievement.description}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
