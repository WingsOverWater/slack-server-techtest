import * as fs from 'fs'
import * as path from 'path'

export interface Task {
  name: string
  type: string // possibly should be enum?
  command: string
  args: {}
}

export interface ConfigData {
  tasks: Array<Task>
}

class ConfigurationParser {
  private configData: ConfigData
  // some of these methods will also need to be private - is a singleton class the right way to do this?

  readConfig (filePath: string): void {
    this.configData = JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'))
    // this either needs a try/catch or an if/else to pick up files which don't exist
    // may not be able to differentiate between failure to parse the JSON and an invalid file name?
    this.createConfig(this.configData)
    }

  createConfig (configData: ConfigData): void {
    configData.tasks.forEach(taskData => {
      switch(taskData.type){
        case "package": {
          // hand off to package parser
          break
        }
        case "file": {
          // hand off to file parser
          break
        }
        default: {
          throw new Error("Unrecognised task type.  Valid tasks: package, file")
        }
      }
    })
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

  checkCurrentState (): void {
    // run command which checks current state
    // if current state does not match desired configuration, hand off to execute
  }

  executeStep (): void {
    // execute configuration change
    // return success or failure
  }

  runConfigChangeset (): void {

  }
}

const configParser = new ConfigurationParser()

export default configParser
