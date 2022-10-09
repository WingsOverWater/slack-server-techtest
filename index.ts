
export interface Task {
  name: string
  type: string
  args: {}
}

class ConfigurationParser {

}

const configParser = new ConfigurationParser()

export default configParser

// package install
// package update
// package delete

// file create
// file update
// file delete
// note: untie metadata?

// start/stop/restart server on changes
// should this be a separate task?

