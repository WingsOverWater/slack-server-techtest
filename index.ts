#!/usr/bin/env node

import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// convert everything to async to handle the callbacks
// add some output messages so that the user knows what's going on
// move the server restart task in with the check, so that it doesn't happen when the check fails

export interface Task {
  name: string
  type: string
  command?: string
  args: {}
  restart?: {
    service: string
  }
}

interface PackageTask {
  name: string
  type: string
  command: string
  args: {
    package: string
  }
  restart?: {
    service: string
  }
}

interface FileTask {
  name: string
  type: string
  args: {
    name: string
    content?: string
    owner?: string
    group?: string
    perms?: string
  }
  restart?: {
    service: string
  }
}

interface ServiceTask {
  name: string
  type: string
  command: string
  args: {
    service: string
  }
}

interface ConfigData {
  tasks: Array<Task>
}

function readConfig (filePath: string): void {
  let configData: ConfigData
  try {
    configData = JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'))
  } catch (error) {
    throw new Error(`File ${filePath} is missing or malformed.  ${error}`)
  }
  // may not be able to differentiate between failure to parse the JSON and an invalid file name?  need to test
  createConfig(configData)
}

function createConfig (configData: ConfigData): void {
  configData.tasks.forEach(taskData => {
    switch(taskData.type){
      case 'package': {
        try {
          parsePackageOptions(taskData as PackageTask)
        }
        catch (error) {
          throw new Error(`Step ${taskData.name} is missing a required argument: ${error}`)
        }
        break
      }
      case 'file': {
        try {
          parseFileOptions(taskData as FileTask)
        }
        catch (error) {
          throw new Error(`Step ${taskData.name} is missing a required argument: ${error}`)
        }
        break
      }
      case 'service': {
        try {
          parseServiceOptions(taskData as ServiceTask)
        }
        catch (error) {
          throw new Error(`Step ${taskData.name} is missing a required argument: ${error}`)
        }
        break
      }
      default: {
        throw new Error('Unrecognised task type.  Valid tasks: package, file, service')
      }
    }
  })
}

// these two methods should be generalisable, I just can't work out how yet
function runCommandWithCheck (changeCommand: string, checkCommand: string, condition: string): void {
  try {
    let check = runShellCommand(checkCommand)
    if (check == condition) {
      runShellCommand(changeCommand)
    }
  } catch (error) {
    throw new Error(`Changeset execution failed: ${error}`)
  }
}

function runCommandWithNotNullCheck (changeCommand: string, checkCommand: string): void {
  try {
    let check = runShellCommand(checkCommand)
    if (check != "") {
      runShellCommand(changeCommand)
    }
  } catch (error) {
    throw new Error(`Changeset execution failed: ${error}`)
  }
}

function parsePackageOptions (packageData: PackageTask): void {
  switch(packageData.command){
    case 'install': {
      runCommandWithNotNullCheck(`sudo apt update && sudo apt install ${packageData.args.package}`, `apt --installed list | grep ${packageData.args.package}`)
      break
    }
    case 'upgrade': {
      runCommandWithNotNullCheck(`sudo apt update && sudo apt upgrade ${packageData.args.package}`, `apt --installed list | grep ${packageData.args.package}`)
      break
    }
    case 'remove': {
      runCommandWithCheck(`sudo apt update && sudo apt remove ${packageData.args.package}`, `apt --installed list | grep ${packageData.args.package}`, "")
      break
    }
    default: {
      throw new Error('Unrecognised package command.  Valid commands: install, upgrade, remove')
    }
  }
  try {
    if (packageData.restart) {
      handleRestartOnTask(packageData.restart.service)
    }
  } catch (error) {
    throw new Error(`System task restart failed: ${error}`)
  }
}

function parseFileOptions (fileData: FileTask): void {
  runCommandWithCheck(`touch ${fileData.name}`, `find . -type f -name ${fileData.name}`, `./${fileData.name}`)
  if (fileData.args.content != undefined) {
    // need to run a check here
    runShellCommand(`printf ${fileData.args.content} > ${fileData.args.name}`)
  }
  if (fileData.args.owner != undefined) {
    runCommandWithCheck(`sudo chown ${fileData.args.owner} ${fileData.args.name}`, `stat -c '%U' ${fileData.args.name}`, fileData.args.owner)
  }
  if (fileData.args.group != undefined) {
    runCommandWithCheck(`sudo chgrp ${fileData.args.group} ${fileData.args.name}`, `stat -c '%G' ${fileData.args.name}`, fileData.args.group)
  }
  if (fileData.args.perms != undefined) {
    runShellCommand(`sudo chmod ${fileData.args.perms} ${fileData.args.name}`)
  }
}

function parseServiceOptions (serviceData: ServiceTask): void {
  switch(serviceData.command){
    case 'start': {
      runCommandWithCheck(`sudo systemctl start ${serviceData.args.service}`, `systemctl is-enabled ${serviceData.args.service}`, 'disabled')
      break
    }
    case 'restart': {
      runCommandWithCheck(`sudo systemctl restart ${serviceData.args.service}`, `systemctl is-enabled ${serviceData.args.service}`, 'enabled')
      break
    }
    case 'stop': {
      runCommandWithCheck(`sudo systemctl stop ${serviceData.args.service}`, `systemctl is-enabled ${serviceData.args.service}`, 'enabled')
      break
    }
    default: {
      throw new Error('Unrecognised service command.  Valid commands: start, restart, stop')
    }
  }
}

function handleRestartOnTask (service: string): void {
  let restartCommand = `sudo systemctl restart ${service}`
  try {
    runShellCommand(restartCommand)
  } catch (error) {
    throw new Error(`Server restart failed: ${error}`)
  }
}

function runShellCommand (shellCommand: string): string {
  try {
    exec(shellCommand, (err, stdout, stderr) => {
      callback: 
    })
  } catch (error) {
    throw new Error(`Command failed to execute: ${error}`)
    // unsure of what sort of error handling should happen here - maybe not the correct structure?
  }
}

readConfig('config.json')
