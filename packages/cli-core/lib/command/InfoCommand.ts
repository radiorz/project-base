import { Command, createCommand } from 'commander';
import { AbstractCommand, Action } from './command.interface';
import { echo } from '../Info';
export class InfoCommand extends AbstractCommand {
  program: Command | undefined;

  init(): void {
    this.program = this.options.program || createCommand();
  }
  start(): void {
    this.program?.addCommand(
      createCommand('info')
        .description('show info')
        .action(() => {
          echo(this.options);
        }),
    );
  }
}
