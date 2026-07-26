# code-sortings

## Description

code-sortings は、Pythonで書いたソートアルゴリズムの動きをブラウザ上で確認できるWebアプリです。

ユーザーは通常のPythonとして `def sort(array):` を定義します。アプリが渡すlist互換の追跡配列が、添字の読み取り、比較、代入、交換を自動的に記録するため、可視化用のコードを手で追加する必要はありません。

```python
def sort(array):
    for end in range(len(array) - 1, 0, -1):
        for i in range(end):
            if array[i] > array[i + 1]:
                array[i], array[i + 1] = array[i + 1], array[i]
```

サンプルとして、挿入・シェル・バブル・選択・クイック・マージ・ヒープ・カクテルソートを収録しています。

公開版: https://sort.yusuke-hayashi.com

## Runtime

- PythonはPyodideを使い、専用Web Worker内で実行します。
- 実行が15秒を超えるとWorkerを破棄して停止します。
- 可視化操作は最大200,000件です。
- 長い実行は最大5,000フレームへ差分を保ったまま圧縮します。
- 配列の長さは3〜300へ補正されます。
- 配列の長さ変更や有限数値以外の代入はエラーになります。
- 初回のみPythonエンジンのダウンロードに時間がかかる場合があります。

PyodideからはWeb APIへアクセスできるため、信頼できるPythonコードだけを実行してください。WorkerはUI停止を防ぐための実行境界であり、敵対的コードに対する完全なセキュリティサンドボックスではありません。

## Optional visualization hints

通常の添字操作だけで可視化できます。必要な場合だけ以下の補助APIを利用できます。

```python
array.swap(i, j)
array.mark_sorted(i)
array.unmark_sorted(i)
array.note("pivot", pivot)
```

## Development

BunとPython 3.12以降を利用します。

```sh
git clone git@github.com:yhay81/code-sortings.git
cd code-sortings
bun install
bun run dev
```

本番ビルドと品質チェック:

```sh
bun run check
bun run build
```

## Deployment

本番サイトはCloudflare Workers Static Assetsから配信します。

- Worker: `code-sortings`
- Custom Domain: https://sort.yusuke-hayashi.com
- Preview: https://code-sortings.yusuke8h.workers.dev

Cloudflareへログインした環境から、品質チェック・ビルド・デプロイをまとめて実行できます。

```sh
bunx wrangler login
bun run deploy
```

`wrangler.jsonc` が `dist` の静的ファイルとCustom Domainを管理します。`main`ブランチへのpushでは、GitHub Actionsが品質チェック・本番ビルド・Cloudflare設定のdry runを行います。

## Licence

[MIT](https://github.com/yhay81/code-sortings/blob/main/LICENCE)
