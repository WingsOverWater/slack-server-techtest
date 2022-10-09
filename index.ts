import * as path from 'path'

export interface Task {
  name: string
  type: string
  args: {}
}

class ConfigurationParser {
  readConfig (): void {

  }

  parseConfig (): void{

  }

  executeStep (): void {

  }

  parsePackageOptions (): void {
    // package install
    // package update
    // package delete
  }

  parseFileOptions (): void {
    // file create
    // file update
    // file delete
    // note: untie metadata?
  }

  parseServerOptions (): void {
    // start/stop/restart server on changes
    // should this be a separate task?
  }
}

const configParser = new ConfigurationParser()

export default configParser
