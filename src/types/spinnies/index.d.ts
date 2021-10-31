declare module 'spinnies' {
  export type Color =
    | 'black'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'
    | 'blackBright'
    | 'gray'
    | 'grey'
    | 'redBright'
    | 'greenBright'
    | 'yellowBright'
    | 'blueBright'
    | 'magentaBright'
    | 'cyanBright'
    | 'whiteBright'
    | 'bgBlack'
    | 'bgRed'
    | 'bgGreen'
    | 'bgYellow'
    | 'bgBlue'
    | 'bgMagenta'
    | 'bgCyan'
    | 'bgWhite'
    | 'bgBlackBright'
    | 'bgGray'
    | 'bgGrey'
    | 'bgRedBright'
    | 'bgGreenBright'
    | 'bgYellowBright'
    | 'bgBlueBright'
    | 'bgMagentaBright'
    | 'bgCyanBright'
    | 'bgWhiteBright'

  export type SpinniesStatus =
    | 'succeed'
    | 'fail'
    | 'spinning'
    | 'non-spinnable'
    | 'stopped'

  export type SpinniesStopAllStatus = 'succeed' | 'fail' | 'stopped'

  export interface SpinniesConstructorOptions {
    color?: Color
    succeedColor?: Color
    failColor?: Color
    spinnerColor?: Color
    succeedPrefix?: string
    failPrefix?: string
    spinner?: {
      interval?: number
      frames?: string[]
    }
    disableSpins?: boolean
  }

  export interface SpinniesOptions {
    text?: string
    indent?: number
    status?: SpinniesStatus
    color?: Color
    succeedColor?: Color
    failColor?: Color
    spinnerColor?: Color
    succeedPrefix?: string
    failPrefix?: string
    spinner?: {
      interval?: number
      frames?: string[]
    }
    disableSpins?: boolean
  }

  export interface SpinniesAddOrUpdateOptions {
    text?: string
    indent?: number
    status?: SpinniesStatus
    color?: Color
    succeedColor?: Color
    failColor?: Color
  }

  export interface SpinniesSuccededOptions {
    text?: string
    succeedColor?: Color
  }

  export interface SpinniesFailOptions {
    text?: string
    failColor?: Color
  }

  export default class Spinnies {
    constructor(optons?: SpinniesConstructorOptions)
    add(name: string, options?: SpinniesAddOrUpdateOptions): SpinniesOptions
    pick(name: string): SpinniesOptions
    remove(name: string): SpinniesOptions
    update(name: string, options?: SpinniesAddOrUpdateOptions): SpinniesOptions
    succeed(name: string, options?: SpinniesSuccededOptions): SpinniesOptions
    fail(name: string, options?: SpinniesFailOptions): SpinniesOptions
    stopAll(status: SpinniesStopAllStatus): void
    hasActiveSpinners(): boolean
  }
}
