# Communication protocol between back- and frontend
from typing import Text, Optional, Dict, Any, Tuple, List

from parlai.core.agents import Agent
import parlai.mturk.tasks.dialoguetest.echo as echo
import os, json

with open(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "constants.json"), "r"
) as file:
    ALL_CONSTANTS = json.load(file)

COMMAND_SETUP = ALL_CONSTANTS["back_to_front"]["command_setup"]
COMMAND_REVIEW = ALL_CONSTANTS["back_to_front"]["command_review"]

MESSAGE_COMPLETE_PREFIX = ALL_CONSTANTS["front_to_back"]["complete_prefix"]
MESSAGE_DONE_PREFIX = ALL_CONSTANTS["front_to_back"]["done_prefix"]
MESSAGE_QUERY_PREFIX = ALL_CONSTANTS["front_to_back"]["query_prefix"]

WORKER_COMMAND_COMPLETE = "complete"
WORKER_COMMAND_DONE = "done"
WORKER_COMMAND_QUERY = "query"

WORKER_DISCONNECTED = "disconnect"

SYSTEM_ID = ALL_CONSTANTS["agent_ids"]["system_id"]
WIZARD_ID = ALL_CONSTANTS["agent_ids"]["wizard_id"]
USER_ID = ALL_CONSTANTS["agent_ids"]["user_id"]
KNOWLEDGE_BASE_ID = ALL_CONSTANTS["agent_ids"]["knowledgebase_id"]


@echo.echo_out(output=echo.log_write, prefix="extract_command_message(...) = ")
def extract_command_message(
    message: Optional[Dict[Text, Any]]
) -> Tuple[Optional[Text], Optional[Text]]:
    command = None
    parameters = None
    if message and message.get("text"):
        text = message.get("text", "")
        if text.startswith(MESSAGE_COMPLETE_PREFIX):
            command = WORKER_COMMAND_COMPLETE
            parameters = None
        elif text.startswith(MESSAGE_DONE_PREFIX):
            command = WORKER_COMMAND_DONE
            parameters = text[len(MESSAGE_DONE_PREFIX) :].strip()
        elif text.startswith(MESSAGE_QUERY_PREFIX):
            command = WORKER_COMMAND_QUERY
            parameters = text[len(MESSAGE_QUERY_PREFIX) :].strip()
        elif text == "[DISCONNECT]":
            command = WORKER_DISCONNECTED
            parameters = None

    return command, parameters


@echo.echo_in(
    output=echo.log_write, prolog={"text": None, "recipient": (lambda a: a.id)}
)
def send_mturk_message(text: Text, recipient: Agent) -> None:
    message = {"id": SYSTEM_ID, "text": text}
    recipient.observe(message)


@echo.echo_in(
    output=echo.log_write, prolog={"text": None, "recipient": (lambda a: a.id)}
)
def send_kb_message(text: Text, recipient: Agent) -> None:
    recipient.observe({"id": KNOWLEDGE_BASE_ID, "kb_item": text})


@echo.echo_in(output=echo.log_write, prolog={"recipient": (lambda a: a.id)})
def send_setup_command(
    task_description: Text,
    completion_requirements: List[Text],
    form_description: Dict[Text, Any],
    completion_questions: List[Text],
    recipient: Agent,
):
    recipient.observe(
        {
            "id": recipient.id,
            "text": "",
            "command": COMMAND_SETUP,
            "task_description": task_description,
            "completion_requirements": completion_requirements,
            "completion_questions": completion_questions,
            "form_description": form_description,
        }
    )