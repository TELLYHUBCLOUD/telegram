import { handleStart, handleUsers } from './handlers/commands';
import { handleJoinRequest } from './handlers/joinRequests';
import { verifyToken } from './utils/helpers';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Webhook management
    if (url.pathname === '/setWebhook') {
      return setWebhook(env);
    }
    
    if (url.pathname === '/deleteWebhook') {
      return deleteWebhook(env);
    }
    
    // Main webhook handler
    if (url.pathname === env.WEBHOOK_PATH) {
      if (!verifyToken(request, env.SECRET)) {
        return new Response('Unauthorized', { status: 403 });
      }
      
      const update = await request.json();
      ctx.waitUntil(processUpdate(update, env));
      return new Response('OK');
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function processUpdate(update, env) {
  try {
    if (update.chat_join_request) {
      return handleJoinRequest(update.chat_join_request, env);
    }
    
    const message = update.message;
    if (message?.text?.startsWith('/')) {
      return handleCommand(message, env);
    }
  } catch (error) {
    console.error('Update error:', error);
  }
}

async function handleCommand(message, env) {
  const [command] = message.text.split(' ');
  switch (command) {
    case '/start': return handleStart(message, env);
    case '/users': return handleUsers(message, env);
    default: return;
  }
}

async function setWebhook(env) {
  const webhookUrl = `${env.WEBHOOK_URL}${env.WEBHOOK_PATH}`;
  const result = await callTelegramApi('setWebhook', {
    url: webhookUrl,
    secret_token: env.SECRET
  }, env.TOKEN);
  
  return new Response(
    result.ok ? `Webhook set to ${webhookUrl}` : 'Failed to set webhook',
    { status: result.ok ? 200 : 500 }
  );
}
