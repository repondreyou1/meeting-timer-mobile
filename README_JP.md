# Meeting Timer - Android版

Meeting Timer アプリケーションの Android バージョンです。

## 特徴

- **クイックタイマー**: 1クリックで5分または10分のカウントダウンを開始
- **カスタムタイマー**: 任意の時間を分単位で設定可能
- **ミーティングアラーム**: 会議開始時間の5分前にアラームを鳴らす設定
- **一時停止/再開**: 必要に応じてタイマーを一時停止・再開
- **視覚・音声アラート**: 終了時に画面の点滅とビープ音でお知らせ
- **大きなUI**: スマートフォンで操作しやすい、押しやすい大きなボタン

## インストール方法

1. リリースから `meeting_timer_mobile.apk` をダウンロードします
2. Androidの設定で「不明なソースからのインストール」を許可します
3. APKファイルをインストールします

## 開発者向け情報

Capacitorで構築されています。

```bash
npm install
npx cap sync
npx cap open android  # Android Studioで開く
```

### APKのビルド

```bash
cd android
./gradlew assembleDebug
```

APKは `android/app/build/outputs/apk/debug/meeting_timer_mobile.apk` に生成されます。

## 使用技術

- **Frontend**: HTML, CSS, JavaScript
- **Framework**: Capacitor
- **Audio**: Web Audio API
- **Notifications**: Android ネイティブ通知

## ライセンス

MIT License
