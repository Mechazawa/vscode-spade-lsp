import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel("Spade LSP");
  context.subscriptions.push(output);

  context.subscriptions.push(
    vscode.commands.registerCommand("spade-lsp.restartServer", async () => {
      await restart(output);
    }),
  );

  start(output);
}

export async function deactivate(): Promise<void> {
  if (client) {
    await client.stop();
    client = undefined;
  }
}

function resolveCwd(): string | undefined {
  const active = vscode.window.activeTextEditor?.document.uri;
  if (active) {
    const folder = vscode.workspace.getWorkspaceFolder(active);
    if (folder) {
      return folder.uri.fsPath;
    }
  }
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function start(output: vscode.OutputChannel): void {
  const config = vscode.workspace.getConfiguration("spade-lsp");
  const command = config.get<string>("serverCommand", "swim");
  const args = config.get<string[]>("serverArgs", ["lsp"]);
  const cwd = resolveCwd();

  output.appendLine(
    `Starting Spade language server: ${command} ${args.join(" ")}` +
      (cwd ? ` (cwd: ${cwd})` : ""),
  );

  // Note: do not set `transport`. The client communicates over the child's
  // stdio by default; setting `transport: TransportKind.stdio` explicitly makes
  // vscode-languageclient append a `--stdio` argument, which `swim lsp` rejects.
  const serverOptions: ServerOptions = {
    run: { command, args, options: { cwd } },
    debug: { command, args, options: { cwd } },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "spade" }],
    outputChannel: output,
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher("**/*.spade"),
    },
  };

  client = new LanguageClient(
    "spade-lsp",
    "Spade LSP",
    serverOptions,
    clientOptions,
  );

  client.start().catch((err) => {
    output.appendLine(`Failed to start Spade language server: ${err}`);
    void vscode.window.showErrorMessage(
      `Spade LSP: could not start "${command}". Is it on your PATH? See the "Spade LSP" output channel.`,
    );
  });
}

async function restart(output: vscode.OutputChannel): Promise<void> {
  if (client) {
    await client.stop();
    client = undefined;
  }
  start(output);
}
