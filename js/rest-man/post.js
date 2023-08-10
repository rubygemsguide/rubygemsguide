import { Application } from "stimulus@3.2.2"

import TerminalController from "./controllers/terminal_controller.js"

window.Stimulus = Application.start()
Stimulus.register("terminal", TerminalController)