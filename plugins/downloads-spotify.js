import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix }) => {
if (!text) return m.reply("❀ Por favor, proporciona el nombre de una canción o artista.")
try {
await m.react('🕒')

let data = null
try {
const res = await axios.get(`${global.APIs.adonix.url}/download/spotify?apikey=${global.APIs.adonix.key}q=${encodeURIComponent(text)}`)
if (!res.data?.status || !res.data?.song || !res.data?.downloadUrl) throw new Error("No se encontró la canción en Adonix.")
const s = res.data.song
data = {
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
} catch (errAdonix) {

const isUrl = /https?:\/\/(open\.)?spotify\.com\/track\/[a-zA-Z0-9]+/.test(text)
let trackUrl = text
let info = null
if (!isUrl) {
const search = await axios.get(`${global.APIs.delirius.url}/search/spotify?q=${encodeURIComponent(text)}&limit=1`)
const result = Array.isArray(search.data?.data) ? search.data.data[0] : null
if (!result || !result.url) throw new Error("ꕥ No se encontraron resultados.")
trackUrl = result.url
info = { title: result.title || "Desconocido", artist: result.artist || "Desconocido", album: result.album || null, duration: result.duration || null, popularity: result.popularity || null, release: result.publish || null, image: result.image || null, url: result.url }
}
const resDel = await axios.get(`${global.APIs.delirius.url}/download/spotifydl?url=${encodeURIComponent(trackUrl)}`)
const d = resDel.data?.data
if (!resDel.data?.status || !d?.url) throw new Error("ꕥ No se pudo obtener el audio en Delirius.")
data = {
title: d.title || info?.title || "Desconocido",
artist: d.author || info?.artist || "Desconocido",
album: info?.album || "Desconocido",
duration: info?.duration || `${Math.floor(d.duration / 60000)}:${String(Math.floor((d.duration % 60000) / 1000)).padStart(2, '0')}`,
popularity: info?.popularity || "Desconocido",
release: info?.release || "Desconocido",
type: d.type,
source: d.source,
image: d.image || info?.image,
download: d.url,
url: info?.url || trackUrl
}
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
sourceUrl: data.url,
}}}, { quoted: m })

await conn.sendMessage(m.chat, { audio: { url: data.download }, fileName: `${data.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
await m.react('✔️')
} catch (err) {
await m.react('✖️')
m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${err.message}`)
}}

handler.help = ["spotify"]
handler.tags = ["download"]
handler.command = ["spotify", "splay"]
handler.group = true

export default handler