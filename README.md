# Spade LSP for VSCode

A VSCode extension that connects the editor to the [Spade](https://spade-lang.org)
language server, giving you in-editor diagnostics, go-to-definition, hover, and
the other features the server supports.

Spade ships a language server but, at the time of writing, the only VSCode
extension on the marketplace (`spade-lang.spade-syntax`) provides syntax
highlighting only. This extension fills the LSP gap. Install both for the full
experience: `spade-lang.spade-syntax` for colors and this one for the language
server.

## Requirements

You need the Spade toolchain on your `PATH`. By default the extension launches
the server as `swim lsp`, which sets up the compiler environment for you:

```bash
cargo install --git https://gitlab.com/spade-lang/swim
```

Alternatively you can run the server binary directly (see `spade-lsp.serverCommand`
below):

```bash
cargo install --git https://gitlab.com/spade-lang/spade spade-language-server
```

## Install

From a packaged `.vsix`:

```bash
git clone https://github.com/Mechazawa/vscode-spade-lsp
cd vscode-spade-lsp
npm install
npx @vscode/vsce package
code --install-extension vscode-spade-lsp-*.vsix
```

## How it works

The extension activates when you open a `.spade` file or a workspace that
contains a `swim.toml`. It starts the configured server over stdio with its
working directory set to the workspace root, so the server picks up your
`swim.toml` project.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `spade-lsp.serverCommand` | `swim` | Executable that launches the server. Set to `spade-language-server` to skip the `swim` wrapper. |
| `spade-lsp.serverArgs` | `["lsp"]` | Arguments for the command. Use `[]` when `serverCommand` is `spade-language-server`. |
| `spade-lsp.trace.server` | `off` | Log JSON-RPC traffic to the "Spade LSP" output channel. |

Run **Spade: Restart Language Server** from the command palette after changing
these, or if the server gets into a bad state.

## Development

```bash
npm install
npm run compile   # or: npm run watch
```

Press `F5` in VSCode to launch an Extension Development Host with the extension
loaded.

## License

MIT
