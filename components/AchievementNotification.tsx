import { motion, AnimatePresence } from "motion/react";
import { Achievement } from "../types";
import { Trophy, Sparkles } from "lucide-react";

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementNotification({
  achievement,
  onClose,
}: AchievementNotificationProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          className="absolute top-20 right-2 z-50 w-[calc(100%-1rem)]"
          onAnimationComplete={() => {
            setTimeout(onClose, 4000);
          }}
        >
          <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-1 rounded-lg shadow-2xl">
            <div className="bg-gray-900 rounded-lg p-3 relative overflow-hidden">
              {/* Animated background shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-3 w-3 text-yellow-400" />
                  <p className="text-xs text-yellow-400 uppercase tracking-wide">
                    Achievement Unlocked!
                  </p>
                  <Sparkles className="h-3 w-3 text-yellow-400" />
                </div>

                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="text-3xl"
                  >
                    {achievement.icon}
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="text-white text-sm">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {achievement.description}
                    </p>
                  </div>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full mt-2 origin-left"
                />

                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-green-400">
                    +50 XP
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Particle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
              initial={{
                x: "50%",
                y: 30,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `calc(50% + ${(Math.random() - 0.5) * 150}px)`,
                y: 30 + (Math.random() - 0.5) * 150,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 0.3 + i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}