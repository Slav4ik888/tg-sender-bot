/* Функция отправки сообщения всем подписчикам с задержкой 200мс */
export async function broadcast(bot, subscribers, message) {
  const results = {
    success: [],
    errors: [],
    ms: []
  };

  // Ограничение: не более 30 сообщений в секунду (200мс = 5 сообщений/сек)
  const BATCH_DELAY = 200;

  for (let i = 0; i < subscribers.length; i++) {
    const userId = subscribers[i];
    const ms = Date.now();

    console.log('ms:', ms, 'userId: ', userId);
    results.ms.push(ms);

    try {
      await bot.telegram.sendMessage(userId, message);
      results.success.push(userId);
    }
    catch (error) {
      results.errors.push({ userId, error: error.message });
      // subscribers = subscribers.filter(id => id !== userId);
    }

    // Задержка после каждого сообщения
    if (i < subscribers.length - 1) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }

  return results;
}
