# code-sortings

## Description

code-sotings は自分のオリジナルソートアルゴリズムをコーディングし、動作をグラフで確認できる Web アプリです。
画面の配色と余白を調整し、コードとグラフの視認性を高めています。
主要な操作が分かりやすいようにパネル構成と操作ボタンを整理しています。
広い画面ではエディターとグラフを左右に配置します。
サンプルのソート（挿入ソート/シェルソート/バブルソート/選択ソート/クイックソート/マージソート/ヒープソート/カクテルソート）を選択して読み込めます。
実行エラーは画面内のログに表示されます。
グラフ上部に i/j/temp の数値を表示し、Space/←/→で再生操作ができます。
以下リンク先(GitHub Pages)から利用できます。
https://sort.yusuke-hayashi.com
main ブランチへの push で GitHub Actions から自動デプロイされます。
ビルド成果物は dist/ に出力され、GitHub Pages は dist/ を配信します。
配列の長さは 3〜300 の範囲に補正されます。
再生速度は 1 以上の数値を入力してください。
配列の値が 0 以下または数値でない場合、グラフは 0 として描画します。
入力したコードはブラウザ上で実行されるため、信頼できるコードのみ利用してください。

## Development

以下コマンドで http://localhost:4000 で利用できます。
バンドルは Bun を利用します。Bun は未導入の場合はインストールしてください。

```sh
git clone git@github.com:yhay81/code-sortings.git
bun install
bun run dev
```

本番ビルドは以下です。

```sh
bun run build
```

## Contribution

ISSUE/PR を歓迎します！

1. Fork it ( http://github.com/yhay81/code-sortings/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

## Licence

[MIT](https://github.com/yhay81/code-sortings/blob/master/LICENCE)
