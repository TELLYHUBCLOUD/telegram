import { addGroup, addUser } from '../utils/database';
import { callTelegramApi } from '../utils/telegram';
import { randomElement } from '../utils/helpers';
import { GIFS } from '../constants';

export async function handleJoinRequest(joinRequest, env) {
  const { chat, from } = joinRequest;
  
  try {
    await addGroup(env.DB, chat.id);
    await callTelegramApi('approveChatJoinRequest', {
      chat_id: chat.id,
      user_id: from.id
    }, env.TOKEN);

    const gif = randomElement(GIFS);
    await callTelegramApi('sendVideo', {
      chat_id: from.id,
      video: gif,
      caption: `Hello ${from.first_name}!\nWelcome to ${chat.title}\n\nPowered by @TellYCloudbots`
    }, env.TOKEN);

    await addUser(env.DB, from.id);
  } catch (error) {
    console.error('Join request error:', error);
    throw error;
  }
}
