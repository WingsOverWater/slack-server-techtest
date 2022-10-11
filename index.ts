#!/usr/bin/env node

import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

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
    path?: string
    content?: string
    owner?: string
    group?: string
    perms?: string
    remove?: boolean
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
    console.log(`***Reading data from ${filePath}***`)
    configData = JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'))
  } catch (error) {
    throw new Error(`File ${filePath} is missing or malformed: ${error}`)
  }
  await createConfig(configData)
}

async function createConfig (configData: ConfigData): Promise<void> {
  for(const taskData of configData.tasks) {
    switch(taskData.type){
      case 'package': {
        try {
          await parsePackageOptions(taskData as PackageTask)
        }
        catch (error) {
          throw new Error(`Step ${taskData.name} failed to execute: ${error}`)
        }
        break
      }
      case 'file': {
        try {
          await parseFileOptions(taskData as FileTask)
        }
        catch (error) {
          throw new Error(`Step ${taskData.name} failed to execute: ${error}`)
        }
        break
      }
      case 'service': {
        try {
          await parseServiceOptions(taskData as ServiceTask)
        }
        catch (error) {
          throw new Error(`Step ${taskData.name} failed to execute: ${error}`)
        }
        break
      }
      default: {
        throw new Error('Unrecognised task type.  Valid tasks: package, file, service')
      }
    }
  }
}

async function runCommandWithCheck (changeCommand: string, changeArgs: string[], condition: boolean): Promise<boolean> {
  try {
    if (condition) {
      await runShellCommand(changeCommand, changeArgs, true)
      return true
    } else {
      return false
    }
  } catch (error) {
    throw new Error(`Changeset execution failed: ${error}`)
  }
}

async function parsePackageOptions (packageData: PackageTask): Promise<void> {
  console.log(`***Executing task ${packageData.name}...***`)
  let installed = true
  let packageChanged = false
  try {
    await runShellCommand('dpkg', ['-s', packageData.args.package], false)
  } catch (error) {
    installed = false
  }
  switch(packageData.command){
    case 'install': {
      packageChanged = await runCommandWithCheck('sh', ['-c', `sudo apt-get update && sudo apt-get install -y ${packageData.args.package}`], !installed)
      break
    }
    case 'upgrade': {
      packageChanged = await runCommandWithCheck('sh', ['-c', `sudo apt-get update && sudo apt-get upgrade -y ${packageData.args.package}`], !installed)
      break
    }
    case 'remove': {
      packageChanged = await runCommandWithCheck('sh', ['-c', `sudo apt-get update && sudo apt-get remove -y ${packageData.args.package}`], installed)
      break
    }
    default: {
      throw new Error('Unrecognised package command.  Valid commands: install, upgrade, remove')
    }
  }
  if (packageChanged) {
    if (packageData.restart) {
      await handleRestartOnTask(packageData.restart.service)
    }
  } else {
    console.log('***Changeset matches current configuration, skipped...***')
  }
}

async function parseFileOptions (fileData: FileTask): Promise<void> {
  console.log(`***Executing task ${fileData.name}...***`)
  let fileExists = await runShellCommand('sh', ['-c', `find ${fileData.args.path} -type f -name ${fileData.args.name}`], false)
  let fileChanged = false
  if (fileData.args.remove) {
    fileChanged = await runCommandWithCheck('sh', ['-c', `sudo rm ${fileData.args.path}/${fileData.args.name}`], fileExists.includes(fileData.args.name))
  } else {
    fileChanged = await runCommandWithCheck('sh', ['-c', `touch ${fileData.args.path}/${fileData.args.name}`], !(fileExists.includes(fileData.args.name)))
    if (fileData.args.content != undefined) {
      let fileContentMatches = await runShellCommand('sh', ['-c', `echo ${fileData.args.path}/${fileData.args.name}`], false) == await runShellCommand('sh', ['-c', `echo ${fileData.args.content}`], false)
      try {
        fileChanged = await runCommandWithCheck('sh', ['-c', `echo ${fileData.args.content} > ${fileData.args.path}/${fileData.args.name}`], fileContentMatches)
      } catch (error) {
        throw new Error(`Content change failed to execute: ${error}`)
      }
    }
    if (fileData.args.owner != undefined) {
      fileChanged = await runCommandWithCheck('sh', ['-c', `sudo chown ${fileData.args.owner} ${fileData.args.path}/${fileData.args.name}`], await runShellCommand('sh', ['-c', `stat -c '%U' ${fileData.args.name}`], false) == fileData.args.owner)
    }
    if (fileData.args.group != undefined) {
      fileChanged = await runCommandWithCheck('sh', ['-c', `sudo chgrp ${fileData.args.group} ${fileData.args.path}/${fileData.args.name}`], await runShellCommand('sh', ['-c', `stat -c '%G' ${fileData.args.name}`], false) == fileData.args.group)
    }
    if (fileData.args.perms != undefined) {
      fileChanged = await runCommandWithCheck('sh', ['-c', `sudo chmod ${fileData.args.perms} ${fileData.args.path}/${fileData.args.name}`], fileExists.includes(fileData.args.name))
    }
  }
  if (fileChanged) {
    if (fileData.restart) {
      await handleRestartOnTask(fileData.restart.service)
    }
  } else {
    console.log('***Changeset matches current configuration, skipped...***')
  }
}

async function parseServiceOptions (serviceData: ServiceTask): Promise<void> {
  console.log(`***Executing task ${serviceData.name}...***`)
  switch(serviceData.command){
    case 'start': {
      await runCommandWithCheck('sh', ['-c', `sudo systemctl start ${serviceData.args.service}`], await runShellCommand('sh', ['-c', `systemctl is-enabled ${serviceData.args.service}`], false) == 'disabled')
      break
    }
    case 'restart': {
      await runCommandWithCheck('sh', ['-c', `sudo systemctl restart ${serviceData.args.service}`], await runShellCommand('sh', ['-c', `systemctl is-enabled ${serviceData.args.service}`], false) == 'enabled')
      break
    }
    case 'stop': {
      await runCommandWithCheck('sh', ['-c', `sudo systemctl stop ${serviceData.args.service}`], await runShellCommand('sh', ['-c', `systemctl is-enabled ${serviceData.args.service}`], false) == 'enabled')
      break
    }
    default: {
      throw new Error('Unrecognised service command.  Valid commands: start, restart, stop')
    }
  }
}

async function handleRestartOnTask (service: string): Promise<void> {
  console.log(`***Restarting service ${service}...***`)
  let restartCommand = `sudo systemctl restart ${service}`
  try {
    await runShellCommand('sh', ['-c', restartCommand], true)
  } catch (error) {
    throw new Error(`Server restart failed: ${error}`)
  }
}

async function runShellCommand (shellCommand: string, commandArgs: string[], stream: boolean): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let shell = spawn(shellCommand, commandArgs)
    let output: ''
    if(stream) {
      shell.stdout.on('data', function(data){         
        console.log(data.toString())
      })
    }
    shell.stdout.on('data', function(data){         
      output += data.toString()
    })
    if (shell.stderr !== null) {
      shell.stderr.on('data', (data) => {
        console.log(data.toString());
      });
    }
    shell.on("error", function (error) {
      reject(error)
    })
    shell.on("exit", function(code) {
      if (code !== 0) {
        reject(`Shell command failed with code ${code}`)
      } else {
        resolve(output)
      }
    })
  })
}

readConfig('config.json')
