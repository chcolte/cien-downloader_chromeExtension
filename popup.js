// ポップアップが開かれたときに実行される
document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: getAllMediaInfo,
    }, (injectionResults) => {
      if (chrome.runtime.lastError) {
        document.getElementById('status').textContent = 'エラーが発生しました。';
        console.error(chrome.runtime.lastError.message);
        return;
      }
      const mediaInfos = injectionResults[0].result;
      populatePopup(mediaInfos);
    });
  });
});

/**
 * 取得したメディア情報をもとにポップアップの表示を生成する
 * @param {Array<{src: string, filename: string}>} mediaInfos
 */
function populatePopup(mediaInfos) {
  const statusEl = document.getElementById('status');
  const listEl = document.getElementById('media-list');
  const downloadAllBtn = document.getElementById('download-all');

  if (!mediaInfos || mediaInfos.length === 0) {
    statusEl.textContent = 'ダウンロード可能なメディアは見つかりませんでした。';
    return;
  }

  statusEl.style.display = 'none';
  downloadAllBtn.style.display = 'block';

  
  downloadAllBtn.addEventListener('click', () => {
    showNotification(`全 ${mediaInfos.length} 件のダウンロードを開始します...`);
    mediaInfos.forEach(info => {
      chrome.downloads.download({ url: info.src, filename: info.filename });
    });
  });

  // 各メディアアイテムをリストに追加
  mediaInfos.forEach(info => {
    const itemEl = document.createElement('li');
    itemEl.className = 'media-item';
    itemEl.textContent = info.filename;
    itemEl.title = info.filename; // 省略されてもホバーでフルネームが見えるように

    itemEl.addEventListener('click', () => {
      const displayName = info.filename.length > 40 ? info.filename.substring(0, 37) + '...' : info.filename;
      showNotification(`「${displayName}」のダウンロードを開始しました。`);
      chrome.downloads.download({
        url: info.src,
        filename: info.filename
      });
    });
    listEl.appendChild(itemEl);
  });
}

let notificationTimer; // タイムアウトIDを保持する変数

/**
 * ポップアップの下部に通知メッセージを表示する
 * @param {string} message 表示するメッセージ
 */
function showNotification(message) {
  const notificationEl = document.getElementById('notification-area');
  notificationEl.textContent = message;
  notificationEl.style.display = 'block';

  // もし既にタイマーがセットされていたら、それをクリアする
  clearTimeout(notificationTimer);

  // 3秒後に通知を非表示にする
  notificationTimer = setTimeout(() => {
    notificationEl.style.display = 'none';
  }, 3000);
}

/**
 * この関数はブラウザのページ上で実行される
 */
function getAllMediaInfo() {
  const mediaElements = document.querySelectorAll(
    'video[src*="media.ci-en.jp"], audio[src*="media.ci-en.jp"]'
  );
  const mediaInfos = [];
  mediaElements.forEach(mediaElement => {
    const src = mediaElement.src;
    let filename = "ci-en_media_file"; 
    const label = mediaElement.getAttribute('data-ga-event-label');
    if (label) {
      filename = label.replace(/[\/\\?%*:|"<>]/g, '_');
    }
    mediaInfos.push({ src, filename });
  });
  return mediaInfos;
}
