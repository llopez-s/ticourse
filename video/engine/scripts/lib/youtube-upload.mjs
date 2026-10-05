// The upload of one lesson video, step by step: check the channel, videos.insert, thumbnail, captions,
// playlist. Each finished step is written to the state (out/youtube-upload.json) at once, so a rerun after a
// failure only does what is missing and never uploads the video a second time.
import {
  PLAYLIST_TITLES,
  addToPlaylist,
  assertChannel,
  insertCaptions,
  myChannel,
  myPlaylists,
  pickPlaylist,
  resumableUpload,
  setThumbnail,
  videoResource,
} from './youtube-api.mjs';

const mib = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;

/**
 * Runs the missing steps and resolves with the final state: { videoId, thumbnail, captions, playlist }.
 * `files` = { size, readChunk(start, end), poster: { bytes, file }, vtt }; `saveState(state)` persists it.
 */
export async function runUpload({ fetch, token, meta, files, state: initial, saveState, privacy, sleep, log = console.log, warn = console.warn }) {
  const state = { ...initial };
  const save = () => saveState({ ...state });

  const channel = assertChannel(await myChannel({ fetch, token }));
  log(`canal: ${channel.snippet.title}`);

  if (!state.videoId) {
    log(`subiendo ${mib(files.size)} (${privacy})…`);
    const video = await resumableUpload({
      fetch,
      token,
      resource: videoResource({ title: meta.title, description: meta.description, tags: meta.tags, privacy }),
      size: files.size,
      readChunk: files.readChunk,
      sleep,
      onProgress: (done, total) => log(`  ${Math.round((100 * done) / total)} %`),
    });
    state.videoId = video.id;
    state.privacy = privacy;
    state.uploadedAt = new Date().toISOString();
    save();
    log(`vídeo creado: ${video.id}`);
  } else {
    log(`el vídeo ya estaba subido (${state.videoId}): no se sube otra vez`);
  }

  if (!state.thumbnail) {
    await setThumbnail({ fetch, token, videoId: state.videoId, bytes: files.poster.bytes, file: files.poster.file });
    state.thumbnail = true;
    save();
    log('miniatura puesta');
  }

  if (!state.captions) {
    await insertCaptions({ fetch, token, videoId: state.videoId, vtt: files.vtt });
    state.captions = true;
    save();
    log('subtítulos en español subidos');
  }

  if (!state.playlist) {
    const playlistId = pickPlaylist(await myPlaylists({ fetch, token }), meta.track);
    if (!playlistId) {
      warn(`no encuentro la lista «${PLAYLIST_TITLES[meta.track]}» en el canal: añade el vídeo a mano`);
    } else {
      await addToPlaylist({ fetch, token, playlistId, videoId: state.videoId });
      state.playlist = playlistId;
      save();
      log(`añadido a la lista «${PLAYLIST_TITLES[meta.track]}»`);
    }
  }
  return state;
}
