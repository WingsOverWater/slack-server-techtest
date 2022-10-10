#!/usr/bin/env node

import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// add some output messages so that the user knows what's going on

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

async function readConfig (filePath: string): Promise<void> {
  let configData: ConfigData
  try {
    configData = JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'))
  } catch (error) {
    throw new Error(`File ${filePath} is missing or malformed.  ${error}`)
  }
  // may not be able to differentiate between failure to parse the JSON and an invalid file name?  need to test
  await createConfig(configData)
}

async function createConfig (configData: ConfigData): Promise<void> {
  configData.tasks.forEach(async taskData => {
    switch(taskData.type){
      case 'package': {
        try {
          await parsePackageOptions(taskData as PackageTask)
        }
        catch (error) {
          throw new Error(`Step ${taskData.name} is missing a required argument: ${error}`)
        }
        break
      }
      case 'file': {
        try {
          await parseFileOptions(taskData as FileTask)
        }
        catch (error) {
          throw new Error(`Step ${taskData.name} is missing a required argument: ${error}`)
        }
        break
      }
      case 'service': {
        try {
          await parseServiceOptions(taskData as ServiceTask)
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
async function runCommandWithCheck (changeCommand: string, checkCommand: string, condition: string, restart: {service: string} | undefined): Promise<void> {
  try {
    let check = await runShellCommand(checkCommand)
    if (check == condition) {
      await runShellCommand(changeCommand)
      if (restart) {
        await handleRestartOnTask(restart.service)
      }
    }
  } catch (error) {
    throw new Error(`Changeset execution failed: ${error}`)
  }
}

async function runCommandWithNotNullCheck (changeCommand: string, checkCommand: string, restart: {service: string} | undefined): Promise<void> {
  try {
    let check = await runShellCommand(checkCommand)
    if (check != "") {
      await runShellCommand(changeCommand)
      if (restart) {
        await handleRestartOnTask(restart.service)
      }
    }
  } catch (error) {
    throw new Error(`Changeset execution failed: ${error}`)
  }
}

async function parsePackageOptions (packageData: PackageTask): Promise<void> {
  switch(packageData.command){
    case 'install': {
      await runCommandWithNotNullCheck(`sudo apt update && sudo apt install ${packageData.args.package}`, `apt --installed list | grep ${packageData.args.package}`, packageData.restart)
      break
    }
    case 'upgrade': {
      await runCommandWithNotNullCheck(`sudo apt update && sudo apt upgrade ${packageData.args.package}`, `apt --installed list | grep ${packageData.args.package}`, packageData.restart)
      break
    }
    case 'remove': {
      await runCommandWithCheck(`sudo apt update && sudo apt remove ${packageData.args.package}`, `apt --installed list | grep ${packageData.args.package}`, "",packageData.restart)
      break
    }
    default: {
      throw new Error('Unrecognised package command.  Valid commands: install, upgrade, remove')
    }
  }

}

async function parseFileOptions (fileData: FileTask): Promise<void> {
  await runCommandWithCheck(`touch ${fileData.name}`, `find . -type f -name ${fileData.name}`, `./${fileData.name}`, fileData.restart)
  if (fileData.args.content != undefined) {
    // need to run a check here
    await runShellCommand(`printf ${fileData.args.content} > ${fileData.args.name}`)
  }
  if (fileData.args.owner != undefined) {
    await runCommandWithCheck(`sudo chown ${fileData.args.owner} ${fileData.args.name}`, `stat -c '%U' ${fileData.args.name}`, fileData.args.owner, fileData.restart)
  }
  if (fileData.args.group != undefined) {
    await runCommandWithCheck(`sudo chgrp ${fileData.args.group} ${fileData.args.name}`, `stat -c '%G' ${fileData.args.name}`, fileData.args.group, fileData.restart)
  }
  if (fileData.args.perms != undefined) {
    await runShellCommand(`sudo chmod ${fileData.args.perms} ${fileData.args.name}`)
  }
}

async function parseServiceOptions (serviceData: ServiceTask): Promise<void> {
  switch(serviceData.command){
    case 'start': {
      await runCommandWithCheck(`sudo systemctl start ${serviceData.args.service}`, `systemctl is-enabled ${serviceData.args.service}`, 'disabled', undefined)
      break
    }
    case 'restart': {
      await runCommandWithCheck(`sudo systemctl restart ${serviceData.args.service}`, `systemctl is-enabled ${serviceData.args.service}`, 'enabled', undefined)
      break
    }
    case 'stop': {
      await runCommandWithCheck(`sudo systemctl stop ${serviceData.args.service}`, `systemctl is-enabled ${serviceData.args.service}`, 'enabled', undefined)
      break
    }
    default: {
      throw new Error('Unrecognised service command.  Valid commands: start, restart, stop')
    }
  }
}

async function handleRestartOnTask (service: string): Promise<void> {
  let restartCommand = `sudo systemctl restart ${service}`
  try {
    await runShellCommand(restartCommand)
  } catch (error) {
    throw new Error(`Server restart failed: ${error}`)
  }
}

async function runShellCommand (shellCommand: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(shellCommand, {encoding: "utf8"}, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    })
  })
}

readConfig('config.json')
