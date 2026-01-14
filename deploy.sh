#!/bin/bash

# ビルドとデプロイを実行するスクリプト
echo "2026 Adultopia 大人國 - 創作者招募サイトのGitHub Pagesへのデプロイを開始します..."

# creators-wantedディレクトリに移動
cd "$(dirname "$0")/creators-wanted" || exit

# npmスクリプトを実行
echo "デプロイを実行中..."
npm run deploy

echo "デプロイが完了しました！"
echo "サイトは以下のURLで公開されています："
echo "https://adultopia.github.io/creators-wanted "
