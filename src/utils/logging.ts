import chalk from 'chalk'

class Logger {
  private get timestamp(): string {
    return new Date().toISOString().replace('T', ' ').split('.')[0]
  }

  public debug(message: string): void {
    console.log(
      `${chalk.gray(this.timestamp)} ${chalk.blue.bold('DEBUG')} ${message}`,
    )
  }

  public info(message: string): void {
    console.log(
      `${chalk.gray(this.timestamp)} ${chalk.green.bold('INFO')} ${message}`,
    )
  }

  public warn(message: string): void {
    console.log(
      `${chalk.gray(this.timestamp)} ${chalk.yellow.bold('WARN')} ${message}`,
    )
  }

  public error(message: string): void {
    console.log(`${chalk.gray(this.timestamp)} ${chalk.red.bold('ERROR')} ${message}`)
  }
}

const logger = new Logger()

export { logger }