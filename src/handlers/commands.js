import { callTelegramApi } from '../utils/telegram';
import { getStats, getUsers } from '../utils/database';
import { isAdmin } from '../utils/helpers';

export async function handleStart(message, env) {
  const { chat, from } = message;
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🗯 Channel', url: 'https://t.me/TellYCloudbots' },
        { text: '💬 Support', url: 'https://t.me/TellYCloud' }
      ],
      [
        { text: '➕ Add to Group', url: `https://t.me/${env.BOT_USERNAME}?startgroup` },
        { text: '➕ Add to Channel', url: `https://t.me/${env.BOT_USERNAME}?startchannel` }
      ]
    ]
  };

  await callTelegramApi('sendPhoto', {
    chat_id: chat.id,
    photo: 'https://envs.sh/RYZ.jpg',
    caption: `🦊 Hello ${from.first_name}!\nI'm an auto approve bot.\n\nPowered by @TellYCloudbots`,
    reply_markup: JSON.stringify(keyboard)
  }, env.TOKEN);
}

export async function handleUsers(message, env) {
  if (!isAdmin(message.from.id, env.ADMIN_ID)) return;
  
  const stats = await getStats(env.DB);
  await callTelegramApi('sendMessage', {
    chat_id: message.chat.id,
    text: `Users: ${stats.users}\nGroups: ${stats.groups}\nTotal: ${stats.total}`,
    parse_mode: 'Markdown'
  }, env.TOKEN);
}
