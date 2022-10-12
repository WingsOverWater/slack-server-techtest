# Slack Technical Test - Basic Config Management

## Usage

### Installing the tool

1. Open the root directory of this repo:
    ```bash
    cd slack-server-techtest
    ```
1. Copy the bootstrap file onto the server:
    ```bash
    scp bootstrap.sh root@ip:/path/to/directory
    ```
1. Copy the config file onto the server:
    ```bash
    scp config.json root@ip:/path/to/directory
    ```
1. Compile the tool:
    ```bash
    tsc
    ```
1. Copy the compiled tool onto the server:
    ```bash
    scp dist/index.js root@ip:/path/to/directory
    ```
1. SSH into the server:
    ```
    ssh ip -l root
    ```
1. Install dependencies using `bootstrap.sh`:
    ```bash
    cd /path/to/directory
    ./bootstrap.sh
    ```

The bootstrap, config, and Javascript executable are also available via the following presigned URLs from Amazon S3:

* Bootstrap file
* Configuration file
* Compiled Javascript executable file

### Writing config files

`config.json` files consist of tasks defined in JSON.  The basic file format looks like this:

```
{
    "tasks": [
        {
            "name": (string) the display name of the task,
            "type": (string) the task type (package, file, or server),
            "args": {
                a list of arguments, specific to the task type
            },
            "restart": (optional) {
                "service": (string)name of the system service to restart once the task is complete
            }
        },
        {
            ...
        },
        {
            ...
        }
    ]
}
```

There are three types of tasks:

* `package`: installs, updates, and removes Debian packages
* `file`: creates, updates, and removes files
* `service`: starts, restarts, and stops system services

#### `package` task format

```
{
    "name": (string) the display name of the task,
    "type": "package",
    "command": (string) install to install a package, upgrade to update a package, remove to remove a package,
    "args": {
        "package": (string) name of the package to modify
    },
    "restart": (optional string) {
        "service": name of the system service to restart once the task is complete
    }
}
```

#### `file` task format

```
{
    "name": the display name of the task,
    "type": "file",
    "args": {
        "name": (string) name of the file to modify,
        "path": (string) path to the file, without the file name,
        "content": (optional string) The desired content of the file,
        "owner": (optional string) The desired owner of the file
        "group": (optional string) The desired owning group of the file,
        "perms": (optional string) The desired permissions of the file (can use any format that chmod accepts, e.g `a+x`, `744`),
        "remove": (optional boolean) true if you want to delete the file, false if not
    },
    "restart": (optional) {
        "service": (string) name of the system service to restart once the task is complete
    }
}
```


#### `server` task format

```
{
    "name": (string) the display name of the task,
    "type": "service",
    "command": (string) start to start a service, restart to restart an already running service, stop to stop a service,
    "args": {
        "service": (string) name of the service to modify
    }
}
```

### Configuring a server

Once the tool is installed on your server, run the following commands to configure it:

```bash
cd /path/to/directory # the directory that you installed the files into 
nodejs index.js
```

**NOTE**: The tool executable and `config.json` file must be in the same directory.

## Design

### Tool architecture

The tool is built in Typescript on top of Node.js, as a single flat executable file.  Under the hood, it uses Bash via child processes to configure the server.

### Potential improvements

* The raw pattern used in the `config.json` file could be refined and extended to execute other types of tasks.  If extending the tool, I would build out a JSON schema which defines valid task configurations, as this would help with auto-completion in the IDE.  (This would probably aslo require modifying the configuration setup so that the JSON definitions are slightly less flat - i.e. defining each type of task as a separate JSON structure, with names, args etc inside it)
* The failure handling for the file command could be improved to reflect the fact that it implements each change separately.  At the moment, it executes the changes sequentially, and fails at the first error - it would be better if it failed gracefully so that all of the changes attempt execution at least once.
* Currently, when the content field in a file task isn't empty, the tool overwrites the current content with the specified content.  I would want to extend the file parsing and file management for a production setup, so that data can be inserted or appended.  (This also makes the idempotency checks above more important, so that data isn't inserted twice.)

### Limitations

* The package installation task only installs packages which are in the default Debian package repositories.  This could be improved by adding another argument to the task for an external package registry.
* The error handling isn't perfect; there are too many errors which propagate up, and I'm fairly sure that I've missed a couple of edge-cases which should error.  I would improve this before using the tool in production.
* The tool has no tests, and has only been tested on-the-fly using manual configuration files.  The Node/Typescript testing libraries aren't well-suited to testing applications like this, in my experience (see the Tradeoffs section) - that said, tests would be a necessity were the tool to be used in production.
* Service restarts can be done as a standalone task, or attached to another task.  This is to try to keep the tool idempotent as much as possible - if a service restart is contingent on changes actually being made to the file, then they shouldn't happen as frequently.
* There are a couple of places where the tool isn't truly idempotent.  I've chosen to do idempotence checks by verifying whether the state is already as we want it, and only applying changes if it isn't, as this is the approach that I'm familiar with from using Ansible.  However, some of these checks were difficult to execute in bash piped through Node - I couldn't get the file content check to handle newlines properly, and because I used a naive approach to permission changes which pipes straight through to chmod, I struggled to work out how to check against every possible input.  This means that service restarts attached to files will sometimes occur when they shouldn't.  I'm also aware that Ansible has edge cases where idempotency is not built in to the tool as it is, so I'd want to have a broader discussion about how to achieve idempotency in this context.
* Before executing file configuration steps, the tool will create the file if it doesn't already exist.  This is so that a blank file can be created with just a name and path.

### Tradeoffs

* I chose to use Typescript for this task purely because it's the language that I've used most often over the last few months.  Because it's a high-level language which is primarily used for application design, it's not necessarily the ideal choice for running configuration which needs to be handed off to a shell.  Were I writing a tool like this for production usage, I would prefer a lower-level language which is more suited to building CLI tools (Golang is the one that I'm most familiar with).  It would also be possible to build a tool like this in pure Bash, but it wouldn't necessarily be easy to read or maintain.
* The code is optimised for readability and maintainability, not for speed.  The balance may not be right - I've tried to explain the code through functions and variable names rather than comments, which does add some overhead.
* The typing is fairly lazy in places where it potentially shouldn't be.  The fix would be to build out enumerables for the fields in `config.json` which have specific valid values, meaning that invalid values would be caught when the file fails to parse.
* I chose to parse each task in sequence, rather than parsing them all and then executing them one by one.  I haven't tested the tool enough to know what the benefits and drawbacks of one method over another are, so I chose the one that's more common in my experience of coding in Typescript.
