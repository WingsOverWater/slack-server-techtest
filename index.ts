import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

export interface Task {
  name: string
  type: string // possibly should be enum?
  command: string
  args: {} // this may not parse correctly?
  restart?: {
    service: string
  }
}

export interface PackageTask {
  name: string
  type: string // possibly should be enum?
  command: string
  args: {
    package: string
  }
  restart?: {
    service: string
  }
}

export interface FileTask {
  name: string
  type: string // possibly should be enum?
  command: string
  args: {
    content: string
    owner: string
    group: string
    perms: string
  }
  restart?: {
    service: string
  }
}

export interface ServiceTask {
  name: string
  type: string // possibly should be enum?
  command: string
  args: {
    service: string
  }
}

export interface ConfigData {
  tasks: Array<Task>
}

class ConfigurationParser {
  private configData: ConfigData
  // is a singleton class the right way to do this?

  readConfig (filePath: string): void {
    this.configData = JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'))
    // this either needs a try/catch or an if/else to pick up files which don't exist
    // may not be able to differentiate between failure to parse the JSON and an invalid file name?
    this.createConfig(this.configData)
    }

  private createConfig (configData: ConfigData): void {
    configData.tasks.forEach(taskData => {
      switch(taskData.type){
        case "package": {
          this.parsePackageOptions(taskData as PackageTask)
          break
        }
        case "file": {
          this.parseFileOptions(taskData as FileTask)
          break
        }
        case "service": {
          this.parseServiceOptions(taskData as ServiceTask)
          break
        }
        default: {
          throw new Error("Unrecognised task type.  Valid tasks: package, file, service")
        }
      }
    })
  }

  private parsePackageOptions (packageData: PackageTask): void {
    let packageShellCommand: string
    switch(packageData.command){
      case "install": {
        packageShellCommand = `sudo apt update && sudo apt install ${packageData.args.package}`
        break
      }
      case "upgrade": {
        packageShellCommand = `sudo apt update && sudo apt upgrade ${packageData.args.package}`
        break
      }
      case "remove": {
        packageShellCommand = `sudo apt remove ${packageData.args.package}`
        break
      }
      default: {
        throw new Error("Unrecognised package command.  Valid commands: install, upgrade, remove")
      }
    }
    // need a try/catch block around both of these
    this.runConfigChangeset(packageShellCommand)
    if (packageData.restart) {
      this.handleRestartOnTask(packageData.restart.service)
    }
  }

  private parseFileOptions (fileData: FileTask): void {
    let fileShellCommand: string
    switch(fileData.command){
      case "create": {
        fileShellCommand = 'create'
        break
      }
      case "modify": {
        fileShellCommand = 'modify'
        break
      }
      case "delete": {
        fileShellCommand = 'delete'
        break
      }
      default: {
        throw new Error("Unrecognised file command.  Valid commands: create, modify, delete")
      }
    }
    // this section will need to pull in args
    // untie metadata changes from file changes?
    // need a try/catch block around both of these
    this.runConfigChangeset(fileShellCommand)
    if (fileData.restart) {
      this.handleRestartOnTask(fileData.restart.service)
    }
  }

  private parseServiceOptions (serviceData: ServiceTask): void {
    let serviceShellCommand: string
    switch(serviceData.command){
      case "start": {
        serviceShellCommand = `sudo systemctl start ${serviceData.args.service}`
        break
      }
      case "restart": {
        serviceShellCommand = `sudo systemctl restart ${serviceData.args.service}`
        break
      }
      case "stop": {
        serviceShellCommand = `sudo systemctl stop ${serviceData.args.service}`
        break
      }
      default: {
        throw new Error("Unrecognised service command.  Valid commands: start, restart, stop")
      }
    }
    // need a try/catch block here
    this.runConfigChangeset(serviceShellCommand)
  }

  private handleRestartOnTask (service: string): void {
    let restartCommand = `sudo systemctl restart ${service}`
    // need some sort of error handling here
    this.runConfigChangeset(restartCommand)
  }

  // handle the case where a server restart is attached to a task

  private checkCurrentState (): boolean {
    let configShouldApply = true
    // run command which checks current state
    // if current state matches desired state, configShouldApply becomes false
    return configShouldApply
  }

  private executeStep (shellCommand: string): void {
    exec(shellCommand, (err, stdout, stderr) => {
      // handle responses and callbacks from the shell
    })
    // will need error handling here
    // return success or failure?
  }

  private runConfigChangeset (configShellCommand: string): void {
    // error handling
    let applyChange = this.checkCurrentState()
    if (applyChange) {
      this.executeStep(configShellCommand)
    }
  }
}

const configParser = new ConfigurationParser()

export default configParser
