import type { Achievement } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Lock } from 'lucide-react';

interface AchievementsViewProps {
  achievements: Achievement[];
  userLevel: number;
}

export function AchievementsView({ achievements, userLevel }: AchievementsViewProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Your Progress</CardTitle>
          <p className="text-xs text-gray-600">
            Level {userLevel} • {unlockedCount}/{achievements.length} Unlocked
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`border rounded-lg p-3 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`text-xl ${!achievement.unlocked && 'opacity-30'}`}>
                    {achievement.unlocked ? achievement.icon : <Lock className="h-5 w-5 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm ${achievement.unlocked ? '' : 'text-gray-600'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {achievement.description}
                    </p>
                    
                    {!achievement.unlocked && achievement.target && achievement.progress !== undefined && (
                      <div className="mt-2">
                        <Progress 
                          value={(achievement.progress / achievement.target) * 100} 
                          className="h-1.5"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          {achievement.progress} / {achievement.target}
                        </p>
                      </div>
                    )}

                    {achievement.unlocked && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Unlocked
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Learning Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
              <div>
                <p className="text-xs">Getting Started</p>
                <p className="text-xs text-gray-600">Complete your first trade</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${unlockedCount < 2 && 'opacity-50'}`}>
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                {unlockedCount >= 2 ? '✓' : '2'}
              </div>
              <div>
                <p className="text-xs">Building Knowledge</p>
                <p className="text-xs text-gray-600">Unlock 2+ achievements</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${unlockedCount < 4 && 'opacity-50'}`}>
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                {unlockedCount >= 4 ? '✓' : '3'}
              </div>
              <div>
                <p className="text-xs">Experienced Investor</p>
                <p className="text-xs text-gray-600">Unlock 4+ achievements</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
