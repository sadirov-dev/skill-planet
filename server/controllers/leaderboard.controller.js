const leaderboardDB = [
  { rank: 1, id: 'u1', name: 'Алинур Каримов', avatar: '/images/avatar_teacher2.jpg', xp: 4850, streak: 5, coursesCompleted: 4, badge: '👑 Top Student' },
  { rank: 2, id: 'l2', name: 'Камола Эшматова', avatar: '/images/avatar_teacher1.jpg', xp: 4120, streak: 12, coursesCompleted: 3, badge: '🔥 English Master' },
  { rank: 3, id: 'l3', name: 'Жасур Усманов', avatar: '/images/avatar_teacher3.jpg', xp: 3900, streak: 8, coursesCompleted: 3, badge: '⚡ Speed Learner' },
  { rank: 4, id: 'l4', name: 'Дилноза Юлдашева', avatar: '/images/avatar_teacher1.jpg', xp: 3450, streak: 4, coursesCompleted: 2, badge: '🌟 English Pro' },
  { rank: 5, id: 'l5', name: 'Фарход Нурматов', avatar: '/images/avatar_teacher3.jpg', xp: 3100, streak: 15, coursesCompleted: 2, badge: '♟️ Chess Grandmaster' }
];

export const getLeaderboard = (req, res) => {
  return res.json({
    success: true,
    leaderboard: leaderboardDB,
  });
};

export const getPlatformStats = (req, res) => {
  return res.json({
    success: true,
    stats: {
      totalStudents: 15420,
      totalCourses: 24,
      totalTeachers: 12,
      completionRate: '94%',
    }
  });
};
