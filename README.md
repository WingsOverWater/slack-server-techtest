# Slack Technical Test - Basic Config Management

## Usage

### Installing the tool

1. Open the root directory of this repo and install NPM dependencies:
    ```bash
    cd slack-server-techtest
    npm i
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

* [Bootstrap file](https://slack-server-techtest-202210.s3.us-west-2.amazonaws.com/bootstrap.sh?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0yIkgwRgIhAI9V%2FNNMJYxckHWQFp4J3oYzCB%2FoEoNDPINb6hbS7576AiEAlmDPFxh031nflb9D3Hn6%2F9VBn41Lm7g6c%2FMOEa9ixKQq6wMIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw0MjUyNzgzODk2NDYiDINBVNV5P6Pe99ifByq%2FA9hyjYnX5fG%2Bh%2Fd4Hw2VaMI2w63uC2YRPeLHpXyi03mRKpnwQiiErUMmjYX1CvcofbhMa6YmB3KVzIGuM1G4zGzqO4tpxf5Hztzz31MSs1KZne3cJlA14zEOlSez8P6yOxqHJRsm11Cl%2F94rq9ljq%2FbZYj3A5NRiqtobXptgUd%2FHIcjlbl3XONYfYnvZbKRZXlQJBVTaL4BFKYFnPSarzhmXR6PzHQV0xs3DeIDHDS5te1hROYYKJVZlp9Sy8eiM8Inft9DEoxAXhwrd%2FI0scennJnze6SkmsJ9pAVr%2FbqT4wkJ5UgOFPIptGMGrZePpCo6sJVsjnwf2PtEcaPpWENxE2RSBH5A6EdFnUMUsWcdOVvwgqwaZRn12sNg6b00QRIzD7LmMAqFucrG6dDUObGRCCy%2BuxhcWTJ1kWcWFUBSn1rJufsFWfE3AQy%2FcfPagnoR8I97RboYWwNsYBRWd2BCRcHsBgiMnkPH5FzG9APDw27yYHlBGH%2FCsVcjxAEa82%2FCQovdlInOd6U%2Fan3MF2pyteiIbZeusPN5cIA9CiYdKiBfNnplLWfDhxiF6JmqmpKgLJEAtXbp4h9B5hBxARTD6o5iaBjqTAvo2GE4%2FPALoZrXJ2gW146CKphJj3e9r2D6K%2Frol5JnHco2Qm5zFR6k9zv%2FWrP%2F%2Fe4eWjc90ayDJ%2B1GRfQYBCOJsmofwwwPb95bzd18bJtEbqWwxr%2FshTzAGqm6rERv9EBmciPUm0rMCfg1e0e72vIravVIMWOjAXtq64p94ynhoNPbtxKDgEUUMYV9KFhxshRq5Xpz30ffpdeMmj0J4wRR73WtQKeFHyir92%2FVVqOM47kxKrIpyZlOU40gBAEm5prKr56P2EwHsHkjWy%2BrxbxgLrUXmAKvAprfYtVh4Uo18Y%2BUbpY8D6RgHAgoyBAcgQytodEQZb2JD7qqt0SuSMUMZKiUKhuRn0UBsVHQXiE51ABQE&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20221012T010616Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAWGBERHWHLMZPLWYJ%2F20221012%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=4ab1303b73417a1994747038c8c3344efecaaea48e9df4390e1cb4824e3892c6)
* [Configuration file](https://slack-server-techtest-202210.s3.us-west-2.amazonaws.com/config.json?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0yIkgwRgIhAI9V%2FNNMJYxckHWQFp4J3oYzCB%2FoEoNDPINb6hbS7576AiEAlmDPFxh031nflb9D3Hn6%2F9VBn41Lm7g6c%2FMOEa9ixKQq6wMIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw0MjUyNzgzODk2NDYiDINBVNV5P6Pe99ifByq%2FA9hyjYnX5fG%2Bh%2Fd4Hw2VaMI2w63uC2YRPeLHpXyi03mRKpnwQiiErUMmjYX1CvcofbhMa6YmB3KVzIGuM1G4zGzqO4tpxf5Hztzz31MSs1KZne3cJlA14zEOlSez8P6yOxqHJRsm11Cl%2F94rq9ljq%2FbZYj3A5NRiqtobXptgUd%2FHIcjlbl3XONYfYnvZbKRZXlQJBVTaL4BFKYFnPSarzhmXR6PzHQV0xs3DeIDHDS5te1hROYYKJVZlp9Sy8eiM8Inft9DEoxAXhwrd%2FI0scennJnze6SkmsJ9pAVr%2FbqT4wkJ5UgOFPIptGMGrZePpCo6sJVsjnwf2PtEcaPpWENxE2RSBH5A6EdFnUMUsWcdOVvwgqwaZRn12sNg6b00QRIzD7LmMAqFucrG6dDUObGRCCy%2BuxhcWTJ1kWcWFUBSn1rJufsFWfE3AQy%2FcfPagnoR8I97RboYWwNsYBRWd2BCRcHsBgiMnkPH5FzG9APDw27yYHlBGH%2FCsVcjxAEa82%2FCQovdlInOd6U%2Fan3MF2pyteiIbZeusPN5cIA9CiYdKiBfNnplLWfDhxiF6JmqmpKgLJEAtXbp4h9B5hBxARTD6o5iaBjqTAvo2GE4%2FPALoZrXJ2gW146CKphJj3e9r2D6K%2Frol5JnHco2Qm5zFR6k9zv%2FWrP%2F%2Fe4eWjc90ayDJ%2B1GRfQYBCOJsmofwwwPb95bzd18bJtEbqWwxr%2FshTzAGqm6rERv9EBmciPUm0rMCfg1e0e72vIravVIMWOjAXtq64p94ynhoNPbtxKDgEUUMYV9KFhxshRq5Xpz30ffpdeMmj0J4wRR73WtQKeFHyir92%2FVVqOM47kxKrIpyZlOU40gBAEm5prKr56P2EwHsHkjWy%2BrxbxgLrUXmAKvAprfYtVh4Uo18Y%2BUbpY8D6RgHAgoyBAcgQytodEQZb2JD7qqt0SuSMUMZKiUKhuRn0UBsVHQXiE51ABQE&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20221012T010636Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAWGBERHWHLMZPLWYJ%2F20221012%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=d08452d097464a50702ca2804d3fdb4ce82095530f6ebea41be71f31bb11620a)
* [Compiled Javascript executable file](https://slack-server-techtest-202210.s3.us-west-2.amazonaws.com/index.js?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0yIkgwRgIhAI9V%2FNNMJYxckHWQFp4J3oYzCB%2FoEoNDPINb6hbS7576AiEAlmDPFxh031nflb9D3Hn6%2F9VBn41Lm7g6c%2FMOEa9ixKQq6wMIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw0MjUyNzgzODk2NDYiDINBVNV5P6Pe99ifByq%2FA9hyjYnX5fG%2Bh%2Fd4Hw2VaMI2w63uC2YRPeLHpXyi03mRKpnwQiiErUMmjYX1CvcofbhMa6YmB3KVzIGuM1G4zGzqO4tpxf5Hztzz31MSs1KZne3cJlA14zEOlSez8P6yOxqHJRsm11Cl%2F94rq9ljq%2FbZYj3A5NRiqtobXptgUd%2FHIcjlbl3XONYfYnvZbKRZXlQJBVTaL4BFKYFnPSarzhmXR6PzHQV0xs3DeIDHDS5te1hROYYKJVZlp9Sy8eiM8Inft9DEoxAXhwrd%2FI0scennJnze6SkmsJ9pAVr%2FbqT4wkJ5UgOFPIptGMGrZePpCo6sJVsjnwf2PtEcaPpWENxE2RSBH5A6EdFnUMUsWcdOVvwgqwaZRn12sNg6b00QRIzD7LmMAqFucrG6dDUObGRCCy%2BuxhcWTJ1kWcWFUBSn1rJufsFWfE3AQy%2FcfPagnoR8I97RboYWwNsYBRWd2BCRcHsBgiMnkPH5FzG9APDw27yYHlBGH%2FCsVcjxAEa82%2FCQovdlInOd6U%2Fan3MF2pyteiIbZeusPN5cIA9CiYdKiBfNnplLWfDhxiF6JmqmpKgLJEAtXbp4h9B5hBxARTD6o5iaBjqTAvo2GE4%2FPALoZrXJ2gW146CKphJj3e9r2D6K%2Frol5JnHco2Qm5zFR6k9zv%2FWrP%2F%2Fe4eWjc90ayDJ%2B1GRfQYBCOJsmofwwwPb95bzd18bJtEbqWwxr%2FshTzAGqm6rERv9EBmciPUm0rMCfg1e0e72vIravVIMWOjAXtq64p94ynhoNPbtxKDgEUUMYV9KFhxshRq5Xpz30ffpdeMmj0J4wRR73WtQKeFHyir92%2FVVqOM47kxKrIpyZlOU40gBAEm5prKr56P2EwHsHkjWy%2BrxbxgLrUXmAKvAprfYtVh4Uo18Y%2BUbpY8D6RgHAgoyBAcgQytodEQZb2JD7qqt0SuSMUMZKiUKhuRn0UBsVHQXiE51ABQE&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20221012T010648Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43199&X-Amz-Credential=ASIAWGBERHWHLMZPLWYJ%2F20221012%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=5d366fff970db372ba7dcc1a649bc095af38f011e93cbc4d5c76130219531769)

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
