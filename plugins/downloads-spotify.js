import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return m.reply("❀ Por favor, proporciona el nombre de una canción o artista.")
  try {
    await m.react('🕒')

    const res = await axios.get(`${global.APIs.adonix.url}/download/spotify?apikey=${global.APIs.adonix.key}&q=${encodeURIComponent(text)}`)
    if (!res.data?.status || !res.data?.song || !res.data?.downloadUrl) throw new Error("No se encontró la canción en Adonix.")
    
    const s = res.data.song
    const data = {
      title: s.title || "Desconocido",
      artist: s.artist || "Desconocido",
      album: "Desconocido",
      duration: s.duration || "Desconocido",
      popularity: "Desconocido",
      release: "Desconocido",
      type: "spotify",
      source: "adonix",
      image: s.thumbnail || null,
      download: res.data.downloadUrl,
      url: text
    }

    const caption = `「✦」Descargando *<${data.title}>*\n\n> ꕥ Autor » *${data.artist}*\n${data.album && data.album !== "Desconocido" ? `> ❑ Álbum » ${data.album}\n` : ''}${data.duration ? `ⴵ Duración » ${data.duration}\n` : ''}${data.popularity && data.popularity !== "Desconocido" ? `✰ Popularidad » ${data.popularity}\n` : ''}${data.release && data.release !== "Desconocido" ? `☁︎ Publicado » ${data.release}\n` : ''}${data.url ? `🜸 Enlace » ${data.url}` : ''}`

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          containsAutoReply: true,
          renderLargerThumbnail: true,
          title: '✧ s⍴᥆𝗍і𝖿ᥡ • mᥙsіᥴ ✧',
          body: dev,
          mediaType: 1,
          thumbnailUrl: data.image,
          mediaUrl: data.url,
          sourceUrl: data.url
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, { audio: { url: data.download }, fileName: `${data.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
    await m.react('✔️')

  } catch (err) {
    await m.react('✖️')
    m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${err.message}`)
  }
}

handler.help = ["spotify"]
handler.tags = ["download"]
handler.command = ["spotify", "splay"]
handler.group = true

export default handler