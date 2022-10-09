import * as path from 'path'

export interface Task {
  name: string
  type: string
  args: {}
}

class ConfigurationParser {
  readConfig (): void {
    // read in config file (JSON parse?)
    // hand off to the global config creator
  }

  createConfig (): void {
    // for each task in config file, check type
    // hand off to the correct parser
  }

  checkCurrentState (): void {
    // run command which checks current state
    // if current state does not match desired configuration, hand off to execute
  }

  executeStep (): void {
    // execute configuration change
    // return success or failure
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
