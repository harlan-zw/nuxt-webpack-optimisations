import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'

export interface Options {
  measure: boolean | SpeedMeasurePlugin.Options
  profile: 'risky' | 'experimental' | 'safe' | false
}
