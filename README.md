# cien-downloader_chromeExtension
ci-enの動画/音声をダウンロードするためのchrome拡張機能（実態はHTMLからurlを抽出してダウンロードさせてるだけ）

### 使い方
- chrome系ウェブブラウザを開きます(Google Chrome, Microsoft Edge, Chromium, Vivaldiなど)
- 拡張機能のページを開きます
    - chrome: ```chrome://extensions```
    - vivaldi: ```vivaldi://extensions```
    など
- 右上の「デベロッパーモード」をONにします
- 「パッケージ化されていない拡張機能を読み込む」ボタンをクリックし，以下のファイルが入った**フォルダ**を選択します。
    - icon.png
    - icon128.png
    - manifest.json
    - popup.html
    - popup.js

※まあ，このプロジェクトのフォルダをそのまま読み込めば多分使えます

これで多分使えるようになってる

（しかし，yt-dlpがci-enに公式対応してないのはなんかあるんかね.. 暗号化も何もかかっとらんのだけども）
