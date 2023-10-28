export enum SortTypeEnum {
  Asc = 1,
  Desc,
  'Ascending' = 1,
  'Descending',
};

export enum UsersSortByEnum {
  Username = 1,
  EarnedMoney,
  RegistrationDate,
  'Earned money' = 2,
  'Registration date',
};

export enum QuestionsSortByEnum {
  DifficultyLevel = 1,
  'Difficulty level' = 1,
};

export enum CategoriesSortByEnum {
  Name = 1,
  QuestionsCount,
  'Questions count' = 2,
};

export enum PushNotificationsTypeEnum {
  Scheduled = 1,
  Sent,
};

export enum EventsTypeEnum {
  ScheduledGames = 1,
  PastGames,
  'Scheduled games' = 1,
  'Past games',
};

export enum GameDetailsTypeEnum {
  QuestionsAnalytics = 1,
  Winners,
  ParticipatedUsers,
  'Questions analytics' = 1,
  'Participated users' = 3,
};

export enum WebRTCRoles {
  Publisher = 1,
  Subscriber,
};

export enum QuestionAnswersEnum {
  A = 1,
  B,
  C,
};

export enum DifficultyLevelEnum {
  Lite = 1,
  Easy,
  Medium,
  Hard,
  VeryHard,
  'Very hard' = 5,
};

export enum GameTypeEnum {
  Development = 1,
  Released,
};

export enum QuestionsTypeEnum {
  Categories = 1,
  UsersQuestions,
  'Users questions' = 2,
};

export enum GameStatisticsStatusEnum {
  Sent = 1,
  Closed,
};

export enum QuestionStateEnum {
  Unused = 1,
  InGame,
  Used,
  'In game' = 2,
}

