const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '5343962365:AAFdBUWZFhEU3E9xJG91db7NyLpBJ1t_5m4';
const bot = new TelegramBot(TOKEN, {polling: true})
const Instagram = require('instagram-downloader');

const fs = require('fs');
const youtube = require('ytdl-core');
let state;

bot.on('message', async (message) => {
    const chatId = message.chat.id;
    const username = message.from.first_name;
    if (message.text === '/start') {
        bot.sendMessage(
            chatId,
            `Здравствуйте ${username} \n Добро пожаловать в бот-загрузчик видео с YouTube ✋✋!\nПросто пришлите мне ссылку на видео на YouTube`
        ).finally();
        state = 1;
    } else if (message.text === '/admin') {
        await bot.sendMessage(chatId, 'Admin👉 @aspnet_ng_developer')
    } else if (message.text === '/help') {
        await bot.sendMessage(chatId, 'List of Commands \n /start-Restart bot \n /help-List of commands \n /admin-Contact to admin')
    } else {
        if (youtube.validateURL(message.text)) {
            let info = await youtube.getInfo(message.text)
            const video_title = info.videoDetails.title + '.mp4'
            console.log(fs.existsSync(`files/${video_title}`));
            if (fs.existsSync(`files/${video_title}`)) {
                async function justSend() {
                    await bot.sendMessage(
                        chatId,
                        'Sending'
                    )
                    try {
                        setTimeout(async () => {
                            await bot.sendVideo(
                                chatId,
                                `files/${video_title}`,
                                {caption: video_title + 'more videos 👉 @yt_vdownloader_bot'}
                            )
                        }, 1000)
                    } catch (e) {
                        // console.log(e);
                    }
                }

                await justSend();
            } else {
                async function botSendVideo() {
                    await bot.sendMessage(
                        chatId,
                        'Video found ,Please 20 seconds for uploading'
                    )
                    try {
                        await youtube(message.text).pipe(fs.createWriteStream(`files/${video_title}`));
                        setTimeout(async () => {
                            await bot.sendVideo(
                                chatId,
                                `files/${video_title}`,
                                {caption: video_title + 'more videos 👉 @yt_vdownloader_bot'}
                            )
                        }, 20000)
                    } catch (e) {
                        // console.log(e);
                    }
                }

                await botSendVideo();
            }
        }
            // else if (!youtube.validateURL(message.text)) {
            //     await bot.sendMessage(
            //         chatId,
            //         'Неверный URL-адрес видео, проверьте URL-адрес YouTube!!'
            //     )
        // }
        else if (message.text.startsWith('https://www.instagram.com')) {
            Instagram('https://www.instagram.com/p/B4CR8RoHCn6/?igshid=o1mtap82mf30')
                .then(data => {
                    console.log(data)
                    // const {entry_data: {PostPage}} = data;
                    // return PostPage.map(post => post.graphql.shortcode_media)
                })
            // .then(images => images.map(img => img.display_url))
            // .then(console.log)
        }
    }
})
