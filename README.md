# Slack Technical Test - Basic Config Management

## Usage

### Installing the tool

### Writing config files

### Configuring a server

## Design

### Tool architecture

### Limitations and tradeoffs

* eventual choice of Typescript/Node was due to familiarity - not necessarily the ideal language for this, would have preferred to write it in something more suited for CLI tools (my Golang skills are very rusty)
* idempotence is a very complex concept, and it's hard to build a tool which is truly idempotent - here, we check whether the state is already as we want it, and only apply changes if it isn't.  This is the same sort of approach that some of the config management tools (Ansible?) use, but on a broader scale, there will always be edge cases
* in terms of improvements/building the tool out, the same pattern should work for other types of tasks if necessary.  The config schema might need to be built out for different types of tasks.
* code is optimised for readability and maintainability, not for speed - there is always a degree of trade-off here
* notes about why I did the server restarts the way that I did
* explanation of parsing tasks on the fly rather than parsing the entire file and then handing off in turn - I'm unsure that parsing on the fly is the right way to do this, but for a proof of concept, it seemed to result in cleaner, more readable code
