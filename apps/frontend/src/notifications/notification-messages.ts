export const notificationTags = {
  journalAccessRequest: 'journal-access-request',
  journalCoachAccepted: 'journal-coach-accepted',
  journalRecord: (journalId: string) => `coach-journal-record-${journalId}`,
};

export const notificationMessages = {
  requestSentTitle: 'Запрос отправлен',
  requestSentBody: (coachUserName: string) => `Запрос к тренеру ${coachUserName} успешно создан.`,

  newRequestCountTitle: 'Новый запрос на доступ',
  newRequestCountBody: (count: number) =>
    `У вас ${count} ${count === 1 ? 'новый запрос' : 'новых запроса'} в очереди.`,

  coachConnectedTitle: 'Тренер подключился',
  coachConnectedBody: (coachUserName: string) =>
    `Тренер ${coachUserName} принял приглашение и подключился к вашему дневнику.`,

  requestAcceptedTitle: 'Запрос принят',
  requestAcceptedBody: (athleteName: string) =>
    `Вы приняли приглашение от ${athleteName}.`,

  newRecordTitle: 'Новая запись в журнале',
  newRecordBody: (athleteName: string, event?: string) =>
    `${athleteName} добавил новую запись: ${event ?? 'без упражнения'}.`,
};
