Programming Frameworks and Languages
====================================

* [Module Handbook](./docs/module_handbook.md)
    * Assignments
        1. [digital_artifact](./docs/assignment_digital_artifact.md)
        2. [technical_report](./docs/assignment_report.md)
* Cloud VSCode IDE
    * GitHub CodeSpaces
        * [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/calaldees/frameworks_and_languages_module?quickstart=1)
            * https://codespaces.new/USERNAME/REPO?quickstart=1
        * Manage: https://github.com/codespaces/
        * Shutdown: `gh cs stop`
        * Issues:
            * Ports need to be set to `public` manually (this can't be automated and is tedious)
                * [Allow for ports to be public by default #4068](https://github.com/orgs/community/discussions/4068)
                * `gh codespace ports visibility 8000:public -c $CODESPACE_NAME`
    * GitPod
        * [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/calaldees/frameworks_and_languages_module)
            * https://gitpod.io/#https://github.com/USERNAME/REPO
        * Manage: https://gitpod.io/workspaces
        * Shutdown: `gp stop`
        * Issues:
            * `git push` wont work until permissions are set 
                * [GitPod: granting-additional-github-oauth-permissions](https://www.gitpod.io/docs/configure/authentication/github#granting-additional-github-oauth-permissions)
                    * `public_repo`, `repo` and `workflow`
